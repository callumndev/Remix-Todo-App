import { Link } from "@remix-run/react";
import React from "react";

import { ActionIcon } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";

import { ColorSchemeToggle } from "~/components/ColorSchemeToggle/ColorSchemeToggle";

interface LayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <ActionIcon
                variant="subtle"
                size="xl"
                aria-label="Go home"
                pos="absolute"
                top={16}
                left={16}
                component={Link}
                to="/"
            >
                <IconHome stroke={1.5} />
            </ActionIcon>

            <ColorSchemeToggle
                pos="absolute"
                top={16}
                right={16}
            />

            {children}
        </>
    );
};

export default AuthLayout;
