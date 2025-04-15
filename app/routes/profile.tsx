import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

import { Avatar, Badge, Button, Card, Center, Text } from "@mantine/core";
import { redirectWithError } from "remix-toast";

import AppLayout from "~/layouts/AppLayout/AppLayout";
import { auth } from "~/lib/auth.server";
import { authClient } from "~/lib/auth.client";

export async function loader({ request }: LoaderFunctionArgs) {
    const authSession = await auth.api.getSession({
        headers: request.headers,
    });

    if (!authSession)
        return redirectWithError("/login", "You need to login to access this page");

    return {
        authSession,
    };
}

export default function Profile() {
    const data = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return (
        <AppLayout>
            <Card withBorder padding="xl" radius="md" >
                <Avatar
                    src={data.authSession.user.image}
                    size={80}
                    radius={80}
                    mx="auto"
                />
                <Text ta="center" fz="lg" fw={500} mt="sm">
                    {data.authSession.user.name}
                </Text>
                <Center>
                    <Text fz="sm" c="dimmed">
                        {data.authSession.user.email}
                    </Text>
                    <Badge
                        ml={5}
                        variant="light"
                        color={data.authSession.user.emailVerified ? "green" : "red"}
                    >
                        {data.authSession.user.emailVerified ? "Verified" : "Not Verified"}
                    </Badge>
                </Center>
                <Center>
                    <Button
                        onClick={() => {
                            authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => navigate("/login"),
                                },
                            });
                        }}
                        radius="md" mt="xl" size="md"
                        variant="filled" color="red"
                    >
                        Logout
                    </Button>
                </Center>
            </Card>
        </AppLayout>
    );
}
