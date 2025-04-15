import { Outlet } from "@remix-run/react";

import AuthLayout from "~/layouts/AuthLayout/AuthLayout";

export default function Layout() {
    return (
        <AuthLayout>
            <Outlet />
        </AuthLayout>
    );
}
