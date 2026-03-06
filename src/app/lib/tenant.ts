/**
 * Resolve tenant from URL query param `?tenant=X`.
 * Returns null if not present.
 */
export function getTenant(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('tenant');
}

/**
 * Build a URL preserving the current tenant query param.
 */
export function withTenant(path: string, tenant: string | null): string {
  if (!tenant) return path;
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}tenant=${encodeURIComponent(tenant)}`;
}
