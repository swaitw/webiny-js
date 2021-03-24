import React, { Suspense, lazy } from "react";
import Helmet from "react-helmet";
import { Route } from "@webiny/react-router";
import { RoutePlugin } from "@webiny/app/types";
import { CircularProgress } from "@webiny/ui/Progress";
import { AdminLayout } from "@webiny/app-admin/components/AdminLayout";

const Loader = ({ children, ...props }) => (
    <Suspense fallback={<CircularProgress />}>{React.cloneElement(children, props)}</Suspense>
);

const CarManufacturers = lazy(() => import("./views/CarManufacturers"));

export default (): RoutePlugin => ({
    type: "route",
    name: "route-admin-carManufacturers",
    route: (
        <Route
            path={"/carManufacturers"}
            exact
            render={() => (
                <AdminLayout>
                    <Helmet>
                        <title>CarManufacturers</title>
                    </Helmet>
                    <Loader>
                        <CarManufacturers />
                    </Loader>
                </AdminLayout>
            )}
        />
    )
});
