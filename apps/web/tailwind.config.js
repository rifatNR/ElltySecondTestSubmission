/** @type {import('tailwindcss').Config} */
export default {
	safelist: [
        "text-purple-500", "bg-purple-100", "bg-purple-500",
        "text-blue-500", "bg-blue-100", "bg-blue-500",
        "text-emerald-500", "bg-emerald-100", "bg-emerald-500",
        "text-stone-500", "bg-stone-100", "bg-stone-500",
        "text-orange-500", "bg-orange-100", "bg-orange-500",
        "text-red-500", "bg-red-100", "bg-red-500",
        "text-neutral-500", "bg-neutral-100", "bg-neutral-500",
        "text-pink-500", "bg-pink-100", "bg-pink-500",
    ],
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontSize: {
                xxs: "0.7rem",
            },
            colors: {
                "custom-red": {
                    live: "#FF3636",
                    breaking: "#FF0000",
                },
                "ekhon-green": {
                    300: "#2AED0A",
                },
            },
            fontFamily: {
                roboto: ["Roboto Slab", "sans-serif"],
                inter: ["Inter", "sans-serif"],
            },
            borderRadius: {
                "custom-rounded": "55px",
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            screens: {
                print: {
                    raw: "print",
                },
                xs: "392px",
            },
            zIndex: {
                decoration: "-10",
                body: "3",
                loader: "4",
                navbar: "10",
                hoverEffectCardContent: "4",
                "preview-remove-button": "4",
                attachpentPrevNext: "100",
            },
            keyframes: {
                "accordion-down": {
                    from: {
                        height: "0",
                    },
                    to: {
                        height: "var(--radix-accordion-content-height)",
                    },
                },
                "accordion-up": {
                    from: {
                        height: "var(--radix-accordion-content-height)",
                    },
                    to: {
                        height: "0",
                    },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
