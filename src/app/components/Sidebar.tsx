import type { SectionSchema } from '../types';

interface SidebarProps {
  sections: SectionSchema[];
  activeSection: string;
  onSelectSection: (id: string) => void;
  tenantName: string;
  onLogout: () => void;
}

export function Sidebar({
  sections,
  activeSection,
  onSelectSection,
  tenantName,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="flex flex-col w-64 min-h-screen bg-gray-900 text-white shrink-0">
      <div className="px-5 py-4 border-b border-gray-700">
        <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Tenant</div>
        <div className="font-semibold truncate">{tenantName}</div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelectSection(section.id)}
            className={[
              'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
              activeSection === section.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            ].join(' ')}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-gray-700">
        <button
          type="button"
          onClick={onLogout}
          className="w-full text-left text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
