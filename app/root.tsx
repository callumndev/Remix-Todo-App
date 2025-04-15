import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
    data,
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useRouteError,
} from "@remix-run/react";
import { cssBundleHref } from "@remix-run/css-bundle";
import { useEffect } from "react";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { getToast } from "remix-toast";

import { auth } from "./lib/auth.server";
import { showNotificationFromToastData } from "./lib/notifications";
import { appVersion } from "./lib/package.server";
import { theme } from "./theme";

export const links: LinksFunction = () => [
    ...(cssBundleHref
        ? [{ rel: "stylesheet", href: cssBundleHref }]
        : []),
];

export const meta: MetaFunction = () => {
    return [
        { title: "Remix Todo App" },
        { name: "description", content: "Developed by github.com/callumndev" },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const authSession = await auth.api.getSession({
        headers: request.headers,
    });

    const { toast, headers } = await getToast(request);

    return data({
        authSession,
        toast,
        appVersion,
    }, {
        headers,
    });
}

export function Layout({ children }: { children: React.ReactNode }) {
    const data = useLoaderData<typeof loader>();

    useEffect(() => {
        if (data?.toast)
            showNotificationFromToastData(data.toast);
    }, [data?.toast]);

    return (
        <html lang="en" {...mantineHtmlProps}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <ColorSchemeScript />
                <Meta />
                <Links />
            </head>
            <body>
                <MantineProvider theme={theme}>
                    <Notifications />
                    {children}
                </MantineProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
            </div>
        );
    } else if (error instanceof Error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </div>
        );
    } else {
        return <h1>Unknown Error</h1>;
    }
}
