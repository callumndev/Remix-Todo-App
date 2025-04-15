import React from "react";

import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { NavbarNested } from "~/components/NavbarNested/NavbarNested";
import classes from "~/components/NavbarNested/NavbarNested.module.css";


interface LayoutProps {
    children: React.ReactNode;
}

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
    const [opened, { toggle, close }] = useDisclosure();

    return (
        <AppShell
            navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
            padding="md"
        >
            <NavbarNested onCloseClick={close} as={AppShell.Navbar} className={classes.navbar} />

            <AppShell.Main>
                {/* Mobile open button */}
                <Burger opened={false} onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />

                {children}
            </AppShell.Main>
        </AppShell>
    );
};

export default AppLayout;
