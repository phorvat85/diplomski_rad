// src/auth/roles.ts
export function toBaseRole(role: unknown): string | null {
  if (!role) return null;

  // String like "ROLE_ADMIN" or "ADMIN"
  if (typeof role === 'string') {
    return role.startsWith('ROLE_') ? role.slice(5) : role;
  }

  // Object like { name: "ROLE_ADMIN" } or { authority: "ROLE_ADMIN" }
  if (typeof role === 'object' && role !== null) {
    // @ts-ignore
    const name = role.name ?? role.authority ?? role.role ?? null;
    if (!name) return null;
    return typeof name === 'string' && name.startsWith('ROLE_') ? name.slice(5) : name;
  }

  return null;
}

export function hasAnyRole(userRole: unknown, allowed: string[]): boolean {
  const base = toBaseRole(userRole);
  if (!base) return false;
  const norm = base.toUpperCase();
  return allowed.map(r => r.toUpperCase()).includes(norm);
}