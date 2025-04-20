import React from "react";

import { AppShell, AppShellNavbarConfiguration, AppShellProps, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { NavbarNested } from "~/components/NavbarNested/NavbarNested";
import classes from "~/components/NavbarNested/NavbarNested.module.css";


interface LayoutProps {
    children: React.ReactNode;
    padding?: AppShellProps["padding"];
}

const AppLayout: React.FC<LayoutProps> = ({ children, padding }) => {
    const [opened, { toggle, close }] = useDisclosure();

    const navBreakpoint: AppShellNavbarConfiguration["breakpoint"] = "md";

    return (
        <AppShell
            navbar={{ width: "290", breakpoint: navBreakpoint, collapsed: { mobile: !opened } }}
            padding={padding}
        >
            <NavbarNested onCloseClick={close} as={AppShell.Navbar} className={classes.navbar} />

            {/* Mobile open button */}
            <Burger opened={false} onClick={toggle}
                hiddenFrom={navBreakpoint}
                size="sm"
                m="sm"
            />

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
};

export default AppLayout;
