"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import MoonIcon from "./MoonIcon";
import SunIcon from "./SunIcon";
import { Button } from "./button";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={() =>
        setTheme(
          theme === "dark" || resolvedTheme === "dark" ? "light" : "dark"
        )
      }
    >
      {mounted && (theme === "dark" || resolvedTheme === "dark") ? (
        <SunIcon className="fill-gray-700/10" />
      ) : (
        <MoonIcon className={" "} />
      )}
    </button>
  );
};

export default ThemeSwitch;
