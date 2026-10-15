
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

export const themes = {
  day: {
    name: "Day",
    description: "Clean and bright",
    bg: "bg-slate-50 text-slate-800",
    surface: "bg-white text-slate-800 border-slate-200",
    card: "bg-white border-slate-200 shadow-sm",
    text: "text-slate-800",
    muted: "text-slate-500",
    border: "border-slate-200",
    hover: "hover:bg-slate-100",
  },

  night: {
    name: "Night",
    description: "Comfortable dark mode",
    bg: "bg-slate-950 text-slate-100",
    surface: "bg-slate-900 text-slate-100 border-slate-800",
    card: "bg-slate-900 border-slate-800",
    text: "text-slate-100",
    muted: "text-slate-400",
    border: "border-slate-800",
    hover: "hover:bg-slate-800",
  },

  midnight: {
    name: "Midnight",
    description: "Deep blue interface",
    bg: "bg-[#101b30] text-slate-100",
    surface: "bg-[#182640] text-slate-100 border-[#293955]",
    card: "bg-[#182640] border-[#293955]",
    text: "text-slate-100",
    muted: "text-slate-400",
    border: "border-[#293955]",
    hover: "hover:bg-[#1c2b46]",
  },
};

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem("admin-theme");

    if (!saved) return "day";

    const parsed = JSON.parse(saved);

    if (parsed === "light") return "day";
    if (parsed === "dark") return "night";

    return themes[parsed] ? parsed : "day";
  } catch {
    return "day";
  }
};

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState(getInitialTheme);

  const currentTheme = themes[themeKey] || themes.day;

  useEffect(() => {
    document.documentElement.dataset.theme = themeKey;

    try {
      localStorage.setItem("admin-theme", JSON.stringify(themeKey));
    } catch {
      // Continue even if browser storage is unavailable.
    }
  }, [themeKey]);

  return (
    <ThemeContext.Provider
      value={{ themeKey, setThemeKey, currentTheme, themes }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};
