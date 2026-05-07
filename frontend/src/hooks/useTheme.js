import { useEffect, useState } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("ethara-theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("ethara-theme", theme);
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
  };
};

export default useTheme;
