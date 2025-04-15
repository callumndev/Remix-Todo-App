import { Link, useNavigate } from "@remix-run/react";
import { forwardRef } from "react";

import { Group, Avatar, Text, UnstyledButton, Menu, type MantineStyleProps } from "@mantine/core";
import { IconLogout, IconUser } from "@tabler/icons-react";

import classes from "./UserButton.module.css";
import { authClient } from "~/lib/auth.client";

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button">, MantineStyleProps {
    image?: string | null;
    name?: string;
    email?: string;
    icon?: React.ReactNode;
}

export const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
    ({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
        <UnstyledButton
            ref={ref}
            {...others}
            className={classes.user}
        >
            <Group>
                <Avatar src={image} radius="xl" />

                {(name || email) && (
                    <div style={{ flex: 1 }}>
                        {name && (
                            <Text size="sm" fw={500}>
                                {name}
                            </Text>
                        )}

                        {email && (
                            <Text c="dimmed" size="xs">
                                {email}
                            </Text>
                        )}
                    </div>
                )}

                {icon}
            </Group>
        </UnstyledButton>
    )
);

UserButton.displayName = "UserButton";

export function UserMenu(props: UserButtonProps) {
    const navigate = useNavigate();

    return (
        <Menu withArrow>
            {/* User button */}
            <Menu.Target>
                <UserButton {...props} />
            </Menu.Target>

            {/* Menu items */}
            <Menu.Dropdown>
                <Menu.Item
                    leftSection={<IconUser size={14} />}
                    component={Link}
                    to="/profile"
                >
                    Profile
                </Menu.Item>
                <Menu.Item
                    onClick={() => {
                        authClient.signOut({
                            fetchOptions: {
                                onSuccess: () => navigate("/login"),
                            },
                        });
                    }}
                    leftSection={<IconLogout size={14} />}
                    color="red"
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
