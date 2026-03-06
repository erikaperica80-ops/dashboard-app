export interface User {
  id: string;
  email: string;
  tenant: string;
  role?: string;
}

export interface FieldSchema {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'array';
  placeholder?: string;
  required?: boolean;
  fields?: FieldSchema[]; // for array type: sub-fields per item
}

export interface SectionSchema {
  id: string;
  label: string;
  fields: FieldSchema[];
}

export interface TemplateSchema {
  sections: SectionSchema[];
}

export interface TenantConfig {
  tenantId: string;
  name: string;
  schema: TemplateSchema;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContentValue = string | number | boolean | Record<string, any>[] | ContentData;

export interface ContentData {
  [key: string]: ContentValue;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type ViewportSize = 'mobile' | 'tablet' | 'desktop';
