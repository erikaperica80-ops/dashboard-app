import { useEffect, useState } from 'react';
import { getTenantConfig, logout } from '../lib/api';
import { Sidebar } from '../components/Sidebar';
import { Preview } from '../components/Preview';
import { EditorPage } from './EditorPage';
import type { SectionSchema } from '../types';

interface DashboardPageProps {
  tenant: string;
  onLogout: () => void;
}

export function DashboardPage({ tenant, onLogout }: DashboardPageProps) {
  const [sections, setSections] = useState<SectionSchema[]>([]);
  const [activeSection, setActiveSection] = useState('');
  const [tenantName, setTenantName] = useState(tenant);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getTenantConfig(tenant)
      .then((config) => {
        if (!cancelled) {
          setTenantName(config.name ?? tenant);
          const secs = config.schema?.sections ?? [];
          setSections(secs);
          if (secs.length > 0) setActiveSection(secs[0].id);
        }
      })
      .catch(() => {/* non-fatal: editor will show its own error */});
    return () => { cancelled = true; };
  }, [tenant]);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // ignore logout errors
    }
    onLogout();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        tenantName={tenantName}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel */}
        <div
          className={[
            'flex flex-col overflow-hidden border-r',
            showPreview ? 'w-1/2' : 'flex-1',
          ].join(' ')}
        >
          <EditorPage tenant={tenant} activeSection={activeSection} />
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <Preview tenant={tenant} />
          </div>
        )}
      </div>

      {/* Toggle preview button */}
      <button
        type="button"
        title={showPreview ? 'Hide preview' : 'Show preview'}
        aria-label={showPreview ? 'Hide preview' : 'Show preview'}
        onClick={() => setShowPreview((p) => !p)}
        className="fixed bottom-4 right-4 z-50 bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors text-lg"
      >
        {showPreview ? '×' : '👁'}
      </button>
    </div>
  );
}
