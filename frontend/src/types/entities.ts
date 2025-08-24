export type Id = number | string;

export type RoleEntity = { id: Id; name: string };

export type UserRow = {
id: Id;
username: string;
email?: string;
role: string | RoleEntity;
enabled: boolean;
accountNonExpired: boolean;
credentialsNonExpired: boolean;
accountNonLocked: boolean;
failedLoginAttempts?: number;
};

export type TaskRow = {
  id: Id;
  title: string;
  description?: string;
  estimation?: string;
  assignee?: { id: Id; username: string } | null;
  taskKey?: string; // <-- optional, for details modal display
};

export const roleText = (r: any) => (typeof r === 'string' ? r : r?.name ?? '');