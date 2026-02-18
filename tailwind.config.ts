import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            colors: {
                // Vega Color Palette
                vega: {
                    blue: {
                        50: '#EEF3F9',
                        100: '#D4E2F1',
                        200: '#A9C5E3',
                        300: '#7EA8D5',
                        400: '#5B8FC9',
                        500: '#4C78A8', // Primary blue
                        600: '#3D5F87',
                        700: '#2E4766',
                        800: '#1F2F44',
                        900: '#0F1722',
                    },
                    teal: {
                        50: '#EDF9F8',
                        100: '#D4F0ED',
                        200: '#A9E1DB',
                        300: '#7ED2C9',
                        400: '#72B7B2', // Secondary teal
                        500: '#5A9D98',
                        600: '#48827E',
                        700: '#366863',
                        800: '#244D49',
                        900: '#12332E',
                    },
                    green: {
                        50: '#EEF7ED',
                        100: '#D5ECD3',
                        200: '#ABD9A7',
                        300: '#81C67B',
                        400: '#54A24B', // Analytics green
                        500: '#43823C',
                        600: '#33622E',
                        700: '#224120',
                        800: '#112112',
                        900: '#091009',
                    },
                    orange: {
                        50: '#FEF3ED',
                        100: '#FDE0D4',
                        200: '#FBC1A9',
                        300: '#F9A27E',
                        400: '#F58518', // Accent orange
                        500: '#D66D0F',
                        600: '#B7560C',
                        700: '#983E09',
                        800: '#792706',
                        900: '#5A0F03',
                    },
                    coral: {
                        50: '#FEEDED',
                        100: '#FDD4D4',
                        200: '#FBA9A9',
                        300: '#F97E7E',
                        400: '#E45756', // Destructive coral
                        500: '#C54645',
                        600: '#A63534',
                        700: '#872423',
                        800: '#681312',
                        900: '#490201',
                    },
                    gray: {
                        50: '#F9F9F9',
                        100: '#F2F2F2', // Light backgrounds
                        200: '#DEDEDE', // Borders
                        300: '#C7C7C7',
                        400: '#9C9C9C', // Muted text
                        500: '#7C7C7C',
                        600: '#5C5C5C',
                        700: '#4C4C4C', // Dark text
                        800: '#3C3C3C',
                        900: '#1C1C1C',
                    },
                },
                // Shadcn UI compatibility
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [],
};
export default config;

