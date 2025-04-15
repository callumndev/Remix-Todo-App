import { Link, useRouteLoaderData } from "@remix-run/react";
import React from "react";

import { ActionIcon, Center, Code, Divider, Group, NavLink, ScrollArea, ThemeIcon } from "@mantine/core";
import {
    IconCalendarWeek,
    IconChevronRight,
    IconClipboardList,
    IconDashboard,
    IconLock,
    IconX,
} from "@tabler/icons-react";

import { UserMenu } from "../UserButton/UserButton";
import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";
import { Logo } from "../Logo";
import { loader } from "~/root";
import classes from "./NavbarNested.module.css";

type NavbarNestedProps<T extends React.ElementType> = {
    as?: T;
    onCloseClick: React.MouseEventHandler<HTMLButtonElement>;
} & React.ComponentPropsWithoutRef<T>;

export function NavbarNested<T extends React.ElementType = typeof React.Fragment>({
    as,
    onCloseClick,
    ...props
}: NavbarNestedProps<T>) {
    const data = useRouteLoaderData<typeof loader>("root");
    const Component = as || React.Fragment;

    return (
        <Component {...props}>
            <div className={classes.header}>
                <Group mb={10} justify="space-between">
                    <Logo style={{ width: 120 }} />
                    <Group gap={"xl"} justify="space-between">
                        <ColorSchemeToggle />

                        <ActionIcon
                            onClick={onCloseClick}
                            variant="transparent"
                            aria-label="Mobile close navbar button"
                            hiddenFrom="sm"
                        >
                            <IconX />
                        </ActionIcon>
                    </Group>
                </Group>
                {data?.appVersion && (<Code fw={700}>v{data.appVersion}</Code>)}
            </div>

            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>
                    <NavLink
                        label="My Tasks"
                        leftSection={<>
                            <ThemeIcon variant="light" size={30}>
                                <IconClipboardList size={18} />
                            </ThemeIcon>
                        </>}
                        className={classes.control}
                        component={Link}
                        to="/my-tasks"
                    />

                    <Center>
                        <Divider w={"75%"} m={5} />
                    </Center>

                    <NavLink
                        label="Overview"
                        leftSection={<>
                            <ThemeIcon variant="light" size={30}>
                                <IconDashboard size={18} />
                            </ThemeIcon>
                        </>}
                        className={classes.control}
                        component={Link}
                        to="/overview"
                    />

                    <NavLink
                        label="Calendar"
                        leftSection={<>
                            <ThemeIcon variant="light" size={30}>
                                <IconCalendarWeek size={18} />
                            </ThemeIcon>
                        </>}
                        className={classes.control}
                        component={Link}
                        to="/calendar"
                    />

                    <NavLink
                        label="Admin"
                        leftSection={<>
                            <ThemeIcon variant="light" size={30}>
                                <IconLock size={18} />
                            </ThemeIcon>
                        </>}
                        className={classes.control}
                    >
                        <NavLink
                            label="Users"
                            className={classes.link}
                            component={Link}
                            to="/admin/users"
                        />
                        <NavLink
                            label="Bans"
                            className={classes.link}
                            component={Link}
                            to="/admin/bans"
                        />
                    </NavLink>
                </div>
            </ScrollArea>

            <div className={classes.footer}>
                <UserMenu
                    image={data?.authSession?.user.image}
                    name={data?.authSession?.user.name}
                    email={data?.authSession?.user.email}
                    icon={<IconChevronRight size={14} stroke={1.5} />}
                />
            </div>
        </Component>
    );
}
