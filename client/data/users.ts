export type StoredUser = { id: string; name: string; email: string; password: string };

const LS_USERS_DB = "rangista_users";

export function listAllUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(LS_USERS_DB);
    const db = raw ? (JSON.parse(raw) as Record<string, StoredUser>) : {};
    return Object.values(db);
  } catch {
    return [];
  }
}
