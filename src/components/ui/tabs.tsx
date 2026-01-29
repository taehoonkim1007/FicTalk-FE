import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => {
  return (
    <div className="mb-6 flex border-b border-stone-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-3 text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "border-b-2 border-emerald-500 text-emerald-400"
              : "text-stone-400 hover:text-stone-200",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
