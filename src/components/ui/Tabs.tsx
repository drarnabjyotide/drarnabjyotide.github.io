import { cn } from '../../lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  darkMode?: boolean;
  size?: 'sm' | 'md';
}

export default function Tabs({ tabs, active, onChange, darkMode, size = 'md' }: TabsProps) {
  return (
    <div className={cn(
      'flex border-b',
      darkMode ? 'border-slate-700' : 'border-slate-200'
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2 border-b-2 transition-all font-medium whitespace-nowrap',
            size === 'sm' ? 'text-xs px-3 py-2' : 'text-sm px-4 py-3',
            active === tab.id
              ? 'border-blue-600 text-blue-600'
              : cn(
                  'border-transparent',
                  darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                )
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'px-1.5 py-0.5 rounded-full text-xs',
              active === tab.id
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
