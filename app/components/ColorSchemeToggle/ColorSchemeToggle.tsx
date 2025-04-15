import { ActionIcon, useMantineColorScheme, useComputedColorScheme, MantineStyleProps } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import cx from "clsx";

import classes from "./ColorSchemeToggle.module.css"

export function ColorSchemeToggle(props: MantineStyleProps) {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

    return (
        <ActionIcon
            onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
            variant="default"
            size="xl"
            aria-label="Toggle color scheme"
            {...props}
        >
            <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
            <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
        </ActionIcon>
    );
}
