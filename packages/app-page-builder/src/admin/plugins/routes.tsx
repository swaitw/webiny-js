import React from "react";
import { Route } from "@webiny/react-router";
import Helmet from "react-helmet";
import { AdminLayout } from "@webiny/app-admin/components/AdminLayout";
import { SecureRoute } from "@webiny/app-security/components";
import { RoutePlugin } from "@webiny/app/types";
import { CompositionScope } from "@webiny/react-composition";

import Categories from "../views/Categories/Categories";
import Menus from "../views/Menus/Menus";
import Pages from "~/admin/views/Pages/Table";
import BlockCategories from "../views/BlockCategories/BlockCategories";
import PageBlocks from "../views/PageBlocks/PageBlocks";
import PageTemplates from "~/admin/views/PageTemplates/PageTemplates";

import { PageEditor } from "~/pageEditor/Editor";
import { BlockEditor } from "~/blockEditor/Editor";
import { TemplateEditor } from "~/templateEditor/Editor";
import { RenderPluginsLoader } from "~/admin/components/PluginLoaders/RenderPluginsLoader";
import { EditorPluginsLoader } from "~/admin/components/PluginLoaders/EditorPluginsLoader";

const ROLE_PB_CATEGORY = "pb.category";
const ROLE_PB_MENUS = "pb.menu";
const ROLE_PB_PAGES = "pb.page";
const ROLE_PB_BLOCK = "pb.block";
const ROLE_PB_TEMPLATE = "pb.template";

const plugins: RoutePlugin[] = [
    {
        name: "route-pb-categories",
        type: "route",
        route: (
            <Route
                path="/page-builder/categories"
                element={
                    <SecureRoute permission={ROLE_PB_CATEGORY}>
                        <AdminLayout>
                            <Helmet title={"Page Builder - Categories"} />
                            <Categories />
                        </AdminLayout>
                    </SecureRoute>
                }
            />
        )
    },
    {
        name: "route-pb-menus",
        type: "route",
        route: (
            <Route
                path="/page-builder/menus"
                element={
                    <SecureRoute permission={ROLE_PB_MENUS}>
                        <AdminLayout>
                            <Helmet title={"Page Builder - Menus"} />
                            <Menus />
                        </AdminLayout>
                    </SecureRoute>
                }
            />
        )
    },
    {
        name: "route-pb-pages",
        type: "route",
        route: (
            <Route
                path="/page-builder/pages"
                element={
                    <SecureRoute permission={ROLE_PB_PAGES}>
                        <RenderPluginsLoader>
                            <AdminLayout>
                                <Helmet title={"Page Builder - Pages"} />
                                <CompositionScope name={"pb.page"}>
                                    <Pages />
                                </CompositionScope>
                            </AdminLayout>
                        </RenderPluginsLoader>
                    </SecureRoute>
                }
            />
        )
    },
    {
        name: "route-pb-page-editor",
        type: "route",
        route: (
            <Route
                path="/page-builder/editor/:id"
                element={
                    <SecureRoute permission={ROLE_PB_PAGES}>
                        <EditorPluginsLoader>
                            <Helmet title={"Page Builder - Edit page"} />
                            <CompositionScope name={"pb.pageEditor"}>
                                <PageEditor />
                            </CompositionScope>
                        </EditorPluginsLoader>
                    </SecureRoute>
                }
            />
        )
    },
    {
        name: "route-pb-page-templates",
        type: "route",
        route: (
            <Route
                path="/page-builder/page-templates"
                element={
                    <SecureRoute permission={ROLE_PB_TEMPLATE}>
                        <RenderPluginsLoader>
                            <AdminLayout>
                                <Helmet title={"Page Builder - Page Templates"} />
                                <PageTemplates />
                            </AdminLayout>
                        </RenderPluginsLoader>
                    </SecureRoute>
                }
            />
        )
    },
    {
        name: "route-pb-template-editor",
        type: "route",
        route: (
            <Route
                path="/page-builder/template-editor/:id"
                element={
                    <SecureRoute permission={ROLE_PB_TEMPLATE}>
                        <EditorPluginsLoader>
                            <Helmet title={"Page Builder - Edit template"} />
                            <CompositionScope name={"pb.templateEditor"}>
                                <TemplateEditor />
                            </CompositionScope>
                        </EditorPluginsLoader>
                    </SecureRoute>
                }
            />
        )
    },
    {
        name: "route-pb-block-categories",
        type: "route",
        route: (
            <Route
                path="/page-builder/block-categories"
                element={
                    <SecureRoute permission={ROLE_PB_BLOCK}>
                        <AdminLayout>
                            <Helmet title={"Page Builder - Block Categories"} />
                            <BlockCategories />
                        </AdminLayout>
                    </SecureRoute>
                }
            />
        )
    },
    {
        name: "route-pb-page-blocks",
        type: "route",
        route: (
            <Route
                path="/page-builder/page-blocks"
                element={
                    <SecureRoute permission={ROLE_PB_BLOCK}>
                        <RenderPluginsLoader>
                            <AdminLayout>
                                <Helmet title={"Page Builder - Blocks"} />
                                <PageBlocks />
                            </AdminLayout>
                        </RenderPluginsLoader>
                    </SecureRoute>
                }
            />
        )
    },
    {
        name: "route-pb-block-editor",
        type: "route",
        route: (
            <Route
                path="/page-builder/block-editor/:id"
                element={
                    <SecureRoute permission={ROLE_PB_PAGES}>
                        <EditorPluginsLoader>
                            <Helmet title={"Page Builder - Edit block"} />
                            <CompositionScope name={"pb.blockEditor"}>
                                <BlockEditor />
                            </CompositionScope>
                        </EditorPluginsLoader>
                    </SecureRoute>
                }
            />
        )
    }
];

export default plugins;
