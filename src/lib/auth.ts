const ACCESS_TOKEN_KEY = "accessToken";

/** Gets token from sessionStorage (current session) or localStorage (remember me). */
export const getAccessToken = (): string | null =>
  sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
  localStorage.getItem(ACCESS_TOKEN_KEY);
