
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, CloudMoon } from "lucide-react";

const options = [
  { key: "day", label: "Day", icon: Sun },
  { key: "night", label: "Night", icon: Moon },
  { key: "midnight", label: "Midnight", icon: CloudMoon },
];

const ThemeSwitcher = () => {
  const { themeKey, setThemeKey } = useTheme();

  return (
    <div
      className="flex items-center gap-1 rounded-xl border border-slate-200
      bg-white/90 p-1 shadow-sm
      [html[data-theme='night']_&]:border-slate-700
      [html[data-theme='night']_&]:bg-slate-900
      [html[data-theme='midnight']_&]:border-[#293955]
      [html[data-theme='midnight']_&]:bg-[#182640]"
      role="group"
      aria-label="Choose appearance"
    >
      {options.map(({ key, label, icon: Icon }) => {
        const active = themeKey === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => setThemeKey(key)}
            aria-pressed={active}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            className={`flex items-center justify-center gap-1.5
              rounded-lg px-2.5 py-2 text-xs font-semibold
              transition sm:px-3
              ${
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }
              [html[data-theme='night']_&:not([aria-pressed='true'])]:text-slate-300
              [html[data-theme='night']_&:not([aria-pressed='true'])]:hover:bg-slate-800
              [html[data-theme='midnight']_&:not([aria-pressed='true'])]:text-slate-300
              [html[data-theme='midnight']_&:not([aria-pressed='true'])]:hover:bg-[#293955]`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
