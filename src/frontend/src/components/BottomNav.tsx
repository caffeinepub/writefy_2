import { BookOpen, Home, PenLine, Play } from "lucide-react";
import type { Screen } from "../lib/types";

interface BottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const TABS: {
  id: Screen;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
}[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "library", icon: BookOpen, label: "Library" },
  { id: "create", icon: PenLine, label: "Create" },
  { id: "play", icon: Play, label: "Play" },
];

export function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  return (
    <nav
      data-ocid="bottom_nav"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      aria-label="Main navigation"
    >
      <div
        className="flex items-center gap-1 px-3 py-3 rounded-full"
        style={{
          background: "rgba(15,15,15,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeScreen === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              data-ocid={`nav.${tab.id}.tab`}
              onClick={() => onNavigate(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-full transition-all duration-200 cursor-pointer min-w-[52px]"
              style={{
                color: isActive ? "#22C55E" : "#6B7280",
                boxShadow: isActive ? "0 0 16px rgba(34,197,94,0.2)" : "none",
                background: isActive ? "rgba(34,197,94,0.08)" : "transparent",
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span
                className="font-medium leading-none"
                style={{ fontSize: "11px", letterSpacing: "0.02em" }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
