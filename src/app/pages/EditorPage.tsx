import { useCallback, useEffect, useRef, useState } from 'react';
import { getContent, getTenantConfig, putContent } from '../lib/api';
import { FieldRenderer } from '../components/FieldRenderer';
import type { ContentData, ContentValue, SaveStatus, SectionSchema, TemplateSchema } from '../types';

interface EditorPageProps {
  tenant: string;
  activeSection: string;
}

const AUTOSAVE_DELAY_MS = 2000;

export function EditorPage({ tenant, activeSection }: EditorPageProps) {
  const [schema, setSchema] = useState<TemplateSchema | null>(null);
  const [content, setContent] = useState<ContentData>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestContent = useRef<ContentData>(content);

  // Keep ref in sync so save callback always has latest data
  useEffect(() => {
    latestContent.current = content;
  }, [content]);

  // Load schema + content
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoadError(null);
        const [config, data] = await Promise.all([
          getTenantConfig(tenant),
          getContent(tenant),
        ]);
        if (!cancelled) {
          setSchema(config.schema);
          setContent(data);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load content');
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [tenant]);

  const scheduleSave = useCallback(() => {
    setSaveStatus('saving');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await putContent(tenant, latestContent.current);
        setSaveStatus('saved');
      } catch {
        setSaveStatus('error');
      }
    }, AUTOSAVE_DELAY_MS);
  }, [tenant]);

  function handleFieldChange(key: string, value: ContentValue) {
    setContent((prev) => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
    scheduleSave();
  }

  // Cleanup timer on unmount
  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  if (loadError) {
    return (
      <div className="p-6 text-red-600">
        Error: {loadError}
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="p-6 text-gray-400 animate-pulse">Loading schema...</div>
    );
  }

  const currentSection: SectionSchema | undefined = schema.sections.find(
    (s) => s.id === activeSection
  );

  return (
    <div className="flex flex-col h-full">
      {/* Save status bar */}
      <div className="flex items-center justify-between px-6 py-2 border-b bg-white">
        <h2 className="text-base font-semibold text-gray-800">
          {currentSection?.label ?? 'Editor'}
        </h2>
        <SaveStatusBadge status={saveStatus} />
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {currentSection ? (
          currentSection.fields.map((field) => (
            <FieldRenderer
              key={field.key}
              schema={field}
              value={content[field.key] ?? ''}
              onChange={handleFieldChange}
            />
          ))
        ) : (
          <p className="text-gray-400 italic">Select a section from the sidebar.</p>
        )}
      </div>
    </div>
  );
}

function SaveStatusBadge({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null;

  const cfg = {
    saving: { cls: 'text-gray-400', label: 'Saving…' },
    saved: { cls: 'text-green-600', label: '✓ Saved' },
    error: { cls: 'text-red-600', label: '✕ Save failed' },
  }[status];

  return <span className={`text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>;
}
