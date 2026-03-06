import { useState } from 'react';
import type { ViewportSize } from '../types';

interface PreviewProps {
  tenant: string;
}

const VIEWPORTS: { id: ViewportSize; label: string; width: string }[] = [
  { id: 'mobile', label: 'Mobile', width: 'w-[375px]' },
  { id: 'tablet', label: 'Tablet', width: 'w-[768px]' },
  { id: 'desktop', label: 'Desktop', width: 'w-full' },
];

export function Preview({ tenant }: PreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [key, setKey] = useState(0);

  const src = `http://localhost:4321?tenant=${encodeURIComponent(tenant)}`;
  const activeWidth = VIEWPORTS.find((v) => v.id === viewport)?.width ?? 'w-full';

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
        <div className="flex gap-1">
          {VIEWPORTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setViewport(v.id)}
              className={[
                'px-3 py-1 text-xs rounded font-medium transition-colors',
                viewport === v.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50',
              ].join(' ')}
            >
              {v.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          title="Refresh preview"
          onClick={() => setKey((k) => k + 1)}
          className="text-xs text-gray-500 hover:text-indigo-600 transition-colors px-2 py-1 rounded border border-gray-200 hover:border-indigo-300"
        >
          ↺ Refresh
        </button>
      </div>

      {/* Frame container */}
      <div className="flex-1 overflow-auto bg-gray-100 flex justify-center p-4">
        <div className={`${activeWidth} h-full min-h-[400px] transition-all duration-300`}>
          <iframe
            key={key}
            src={src}
            title="Landing preview"
            className="w-full h-full border rounded shadow-sm bg-white"
          />
        </div>
      </div>
    </div>
  );
}
