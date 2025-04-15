import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Anchor, Group, Text, Title } from "@mantine/core";
import { redirectWithError } from "remix-toast";

import AppLayout from "~/layouts/AppLayout/AppLayout";
import { auth } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const authSession = await auth.api.getSession({
        headers: request.headers,
    });

    if (!authSession)
        return redirectWithError("/login", "You need to login to access this page");

    return null;
}

export default function Index() {
    return (
        <AppLayout>
            <Title
                ta="center"
                mt={100}
            >
                Welcome to{" "}
                <Text inherit variant="gradient" component="span" gradient={{ from: "pink", to: "yellow" }}>
                    Mantine
                </Text>
            </Title>
            <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
                This starter Vite project includes a minimal setup, if you want to learn more on Mantine +
                Vite integration follow{" "}
                <Anchor href="https://mantine.dev/guides/vite/" size="lg">
                    this guide
                </Anchor>
                . To get started edit pages/Home.page.tsx file.
            </Text>

            <Group justify="center" mt="xl">
                <Anchor component={Link} to="/login">Login</Anchor>
                <Anchor component={Link} to="/register">Register</Anchor>
                <Anchor component={Link} to="/profile">Profile</Anchor>
            </Group>
        </AppLayout>
    );
}
