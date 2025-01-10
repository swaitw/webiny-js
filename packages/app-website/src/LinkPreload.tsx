import React, { useEffect, useMemo } from "react";
import gql from "graphql-tag";
import { useApolloClient } from "@apollo/react-hooks";
import { makeDecoratable } from "@webiny/app";
import { Link, To } from "@webiny/react-router";
import { getPrerenderId, isPrerendering } from "@webiny/app/utils";
import { GET_PUBLISHED_PAGE } from "./Page/graphql";
import { usePageElements } from "@webiny/app-page-builder-elements";

const preloadedPaths: string[] = [];

interface GetPreloadPagePath {
    (path: string): string;
}

interface LinkPreloadOptions {
    getPreloadPagePath?: GetPreloadPagePath;
}

const defaultGetPreloadPagePath: GetPreloadPagePath = path => {
    return path;
};

const useLinkPreload = (path: string | To, options: LinkPreloadOptions) => {
    const getPreloadPagePath = options.getPreloadPagePath ?? defaultGetPreloadPagePath;

    const { loaderCache } = usePageElements();

    const apolloClient = useApolloClient();
    const preloadPath = async (pathname: string) => {
        // We only need a clean pathname, without query parameters.
        pathname = pathname.split("?")[0];

        if (!pathname.startsWith("/") || preloadedPaths.includes(pathname)) {
            return;
        }

        preloadedPaths.push(pathname);

        const graphqlJson = `cache.json?k=${getPrerenderId()}`;
        const fetchPath = pathname !== "/" ? `${pathname}/${graphqlJson}` : `/${graphqlJson}`;
        const pageState = await fetch(fetchPath.replace("//", "/"))
            .then(res => res.json())
            .catch(() => null);

        if (pageState) {
            const { apolloGraphQl, peLoaders } = pageState;
            if (Array.isArray(apolloGraphQl)) {
                for (let i = 0; i < apolloGraphQl.length; i++) {
                    const { query, variables, data } = apolloGraphQl[i];
                    apolloClient.writeQuery({
                        query: gql`
                            ${query}
                        `,
                        data,
                        variables
                    });
                }
            }

            if (Array.isArray(peLoaders)) {
                for (let i = 0; i < peLoaders.length; i++) {
                    const { key, value } = peLoaders[i];
                    loaderCache.write(key, value);
                }
            }
        } else {
            const finalPath = getPreloadPagePath(pathname);
            apolloClient.query({
                query: GET_PUBLISHED_PAGE(),
                variables: {
                    id: null,
                    path: finalPath,
                    preview: false,
                    returnErrorPage: true,
                    returnNotFoundPage: true
                }
            });
        }
    };

    useEffect(() => {
        if (typeof path === "string") {
            preloadPath(path);
        }
    }, [path]);
};

interface LinkPreloadProps {
    getPreloadPagePath?: GetPreloadPagePath;
}

export const LinkPreload = makeDecoratable("LinkPreload", (preloadProps: LinkPreloadProps) => {
    if (isPrerendering()) {
        return null;
    }

    const LinkDecorator = useMemo(() => {
        return Link.createDecorator(Original => {
            return function Link(props) {
                let { to } = props;

                if (typeof to === "string" && to.startsWith(window.location.origin)) {
                    to = to.replace(window.location.origin, "");
                }

                useLinkPreload(to, { getPreloadPagePath: preloadProps.getPreloadPagePath });

                return <Original {...props} />;
            };
        });
    }, [preloadProps.getPreloadPagePath]);

    return <LinkDecorator />;
});
