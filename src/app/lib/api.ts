import type { ContentData, TenantConfig, User } from '../types';

const BASE = '/api';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// Auth
export function login(email: string, password: string, tenant: string) {
  return request<User>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, tenant }),
  });
}

export function logout() {
  return request<void>('/auth/logout', { method: 'POST' });
}

export function getMe() {
  return request<User>('/auth/me');
}

// Tenant config / schema
export function getTenantConfig(tenant: string) {
  return request<TenantConfig>(`/tenant/config?tenant=${encodeURIComponent(tenant)}`);
}

// Content
export function getContent(tenant: string) {
  return request<ContentData>(`/tenant/content?tenant=${encodeURIComponent(tenant)}`);
}

export function putContent(tenant: string, data: ContentData) {
  return request<ContentData>(`/tenant/content?tenant=${encodeURIComponent(tenant)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
