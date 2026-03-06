import type { ContentData, ContentValue, FieldSchema } from '../types';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Textarea } from './common/Textarea';

interface FieldRendererProps {
  schema: FieldSchema;
  value: ContentValue;
  onChange: (key: string, value: ContentValue) => void;
}

export function FieldRenderer({ schema, value, onChange }: FieldRendererProps) {
  const { key, label, type, placeholder, required } = schema;

  if (type === 'text') {
    return (
      <Input
        id={key}
        label={label}
        value={typeof value === 'string' ? value : ''}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(key, e.target.value)}
      />
    );
  }

  if (type === 'textarea') {
    return (
      <Textarea
        id={key}
        label={label}
        value={typeof value === 'string' ? value : ''}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(key, e.target.value)}
      />
    );
  }

  if (type === 'number') {
    return (
      <Input
        id={key}
        label={label}
        type="number"
        value={typeof value === 'number' ? value : ''}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(key, e.target.valueAsNumber)}
      />
    );
  }

  if (type === 'boolean') {
    return (
      <div className="flex items-center gap-3">
        <input
          id={key}
          type="checkbox"
          checked={typeof value === 'boolean' ? value : false}
          onChange={(e) => onChange(key, e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor={key} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      </div>
    );
  }

  if (type === 'array' && schema.fields) {
    const items = Array.isArray(value) ? (value as Record<string, ContentValue>[]) : [];

    const updateItem = (index: number, fieldKey: string, fieldValue: ContentValue) => {
      const next = items.map((item, i) =>
        i === index ? { ...item, [fieldKey]: fieldValue } : item
      );
      onChange(key, next);
    };

    const addItem = () => {
      const blank: ContentData = {};
      schema.fields!.forEach((f) => { blank[f.key] = ''; });
      onChange(key, [...items, blank]);
    };

    const removeItem = (index: number) => {
      onChange(key, items.filter((_, i) => i !== index));
    };

    return (
      <fieldset className="border border-gray-200 rounded-md p-4 space-y-4">
        <legend className="text-sm font-medium text-gray-700 px-1">{label}</legend>
        {items.map((item, index) => (
          <div key={index} className="space-y-3 border border-gray-100 rounded p-3 relative">
            <button
              type="button"
              aria-label="Remove item"
              onClick={() => removeItem(index)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs"
            >
              ✕
            </button>
            {schema.fields!.map((subField) => (
              <FieldRenderer
                key={subField.key}
                schema={subField}
                value={item[subField.key] ?? ''}
                onChange={(subKey, subValue) => updateItem(index, subKey, subValue)}
              />
            ))}
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addItem}>
          + Add item
        </Button>
      </fieldset>
    );
  }

  return (
    <div className="text-sm text-gray-400 italic">
      Unsupported field type: {type}
    </div>
  );
}
