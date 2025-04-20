import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";

import { ActionIcon, Avatar, Badge, Button, Card, Center, Group, Stack, Table, Text, Title, Tooltip } from "@mantine/core";
import { redirectWithError } from "remix-toast";
import { formatDistanceToNow, format } from "date-fns";
import { UAParser } from "ua-parser-js";

import AppLayout from "~/layouts/AppLayout/AppLayout";
import { auth } from "~/lib/auth.server";
import { authClient } from "~/lib/auth.client";
import { IconDeviceDesktop, IconDeviceMobile, IconDeviceUnknown, IconShield, IconTrash } from "@tabler/icons-react";

export async function loader({ request }: LoaderFunctionArgs) {
    const authSession = await auth.api.getSession({
        headers: request.headers,
    });

    if (!authSession)
        return redirectWithError("/login", "You need to login to access this page");

    const sessions = await auth.api.listSessions({
        headers: request.headers,
    });

    return {
        authSession,
        sessions,
    };
}

export async function action({
    request,
}: ActionFunctionArgs) {
    const authSession = await auth.api.getSession({
        headers: request.headers,
    });

    if (!authSession)
        return redirectWithError("/login", "You need to login to access this page");

    const formData = await request.formData();
    const intent = formData.get("intent");

    // Delete session by token
    if (intent === "delete") {
        const token = formData.get("session-token");
        if (typeof token == "string")
            await auth.api.revokeSession({
                headers: request.headers,
                body: {
                    token,
                },
            })
    }

    // Revoke all other sessions
    if (intent == "revoke-others") {
        await auth.api.revokeOtherSessions({
            headers: request.headers,
        });
    }

    return null;
}

export default function Profile() {
    const data = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    const rows = data.sessions.map((session) => {
        let deviceGroup = null;

        if (session.userAgent?.length) {
            const { browser, device } = UAParser(session.userAgent);
            const DeviceIcon = device.is("mobile") ? IconDeviceMobile : IconDeviceDesktop;
            deviceGroup = (
                <>
                    <DeviceIcon size={30} />
                    <Text fz="sm" fw={500}>
                        {device.model}
                    </Text>
                    <Text fz="sm" fw={500} c="dimmed">
                        {browser.name}
                    </Text>
                </>
            );
        }
        else
            deviceGroup = (
                <>
                    <IconDeviceUnknown size={30} />
                    <Text fz="sm" fw={500}>
                        Unknown
                    </Text>
                </>
            );

        return (
            <Table.Tr key={session.id}>
                <Table.Td>
                    <Group gap="sm">
                        {deviceGroup}
                        {session.id == data.authSession.session.id && (
                            <Badge color="green" variant="light">
                                Current
                            </Badge>
                        )}
                    </Group>
                </Table.Td>

                <Table.Td visibleFrom="lg">
                    {session.ipAddress ? (
                        <Text>{session.ipAddress}</Text>
                    ) : (
                        <Text
                            c="dimmed"
                            fs="italic"
                        >
                            Not available
                        </Text>
                    )}
                </Table.Td>

                <Table.Td>
                    <Text fz="sm">{formatDistanceToNow(session.createdAt, { addSuffix: true })}</Text>
                    <Text fz="sm" c="dimmed">{format(session.createdAt, "MMM d, yyyy h:mm a")}</Text>
                </Table.Td>

                <Table.Td visibleFrom="lg">
                    <Text fz="sm">{formatDistanceToNow(session.expiresAt, { addSuffix: true })}</Text>
                    <Text fz="sm" c="dimmed">{format(session.expiresAt, "MMM d, yyyy h:mm a")}</Text>
                </Table.Td>

                <Table.Td>
                    <Form method="post">
                        <input
                            hidden
                            type="text"
                            name="session-token"
                            defaultValue={session.token}
                        />
                        <Group gap={0} justify="flex-end">
                            <Tooltip
                                disabled={session.id != data.authSession.session.id}
                                label="Logout to revoke the current session"
                            >
                                <ActionIcon
                                    variant="subtle" color="red"
                                    type="submit"
                                    name="intent"
                                    value="delete"
                                    disabled={session.id == data.authSession.session.id}
                                >
                                    <IconTrash size={16} stroke={1.5} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Form>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <AppLayout padding="sm">
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

            <Card withBorder padding="xl" radius="md" mt="md">
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Title order={2} fz="lg" fw={500}>Active Sessions</Title>
                        <Group gap={4} align="center">
                            <IconShield color="grey" stroke={1.5} size={16} />
                            <Text size="sm" c="dimmed">
                                Sessions expire after 7 days
                            </Text>
                        </Group>
                    </Group>

                    <Group justify="flex-end">
                        <Form method="post">
                            <Button
                                variant="outline" color="red"
                                type="submit" name="intent" value="revoke-others"
                            >
                                Sign out other devices
                            </Button>
                        </Form>
                    </Group>
                </Stack>

                <Table
                    verticalSpacing="sm"
                    horizontalSpacing="sm"
                    mt="lg"
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Device</Table.Th>
                            <Table.Th visibleFrom="lg">IP Address</Table.Th>
                            <Table.Th>Created</Table.Th>
                            <Table.Th visibleFrom="lg">Expires</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Card>
        </AppLayout>
    );
}
