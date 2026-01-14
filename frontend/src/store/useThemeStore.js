import { create } from "zustand";

export const useThemeStore = create((set) => ({
    dark: localStorage.getItem("theme") === "dark",

    toggleTheme: () =>
        set((state) => {
            const newTheme = state.dark ? "light" : "dark";
            localStorage.setItem("theme", newTheme);

            if (newTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }

            return { dark: !state.dark };
        }),
}));

