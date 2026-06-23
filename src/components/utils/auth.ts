export type UserRole = "student" | "teacher";

// Проверяет, вошёл ли пользователь в систему
export function isAuthenticated(): boolean {
  return localStorage.getItem("token") !== null;
}

// Возвращает роль пользователя ("student" / "teacher") или null, если её нет
export function getUserRole(): UserRole | null {
  return localStorage.getItem("role") as UserRole | null;
}

// ВРЕМЕННАЯ заглушка вместо настоящего backend.
// Когда появится API — замени тело этой функции на реальный запрос (fetch/axios),
// а роль бери из ответа сервера, а не придумывай её тут.
// Возвращает роль при успехе, или null, если логин/пароль не подошли.
export function login(username: string, password: string): UserRole | null {
  if (!username || !password) {
    return null;
  }

  const role: UserRole = username.toLowerCase().includes("teacher")
    ? "teacher"
    : "student";

  localStorage.setItem("token", "demo-token"); // тут будет настоящий токен с сервера
  localStorage.setItem("role", role);

  return role;
}

// Выход из системы
export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}