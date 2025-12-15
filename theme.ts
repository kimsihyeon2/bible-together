"use client";

import { createTheme, MantineColorsTuple } from "@mantine/core";

const warmPaper: MantineColorsTuple = [
    "#fffcf5",
    "#fff7e6",
    "#ffeecc",
    "#ffe3b3",
    "#ffd999",
    "#ffd28a",
    "#ffcb7a", // Primary
    "#e6b66e",
    "#cca262",
    "#b38e56",
];

const deepMidnight: MantineColorsTuple = [
    "#f4f6fb",
    "#e8ebf6",
    "#cfd8ee",
    "#b5c4e6",
    "#9db2df",
    "#849fd7",
    "#6b8dd0", // Primary Dark
    "#5a77b0",
    "#4a6191",
    "#3a4c73",
];

export const theme = createTheme({
    colors: {
        warmPaper,
        deepMidnight,
    },
    primaryColor: "deepMidnight",
    fontFamily: "var(--font-inter), sans-serif",
    headings: {
        fontFamily: "var(--font-inter), sans-serif",
    },
    components: {
        Button: {
            defaultProps: {
                radius: "xl",
                size: "md",
            },
        },
        Card: {
            defaultProps: {
                radius: "lg",
                withBorder: true,
            },
        },
    },
});
