const ADMIN_FALLBACK = "/admin";
const ADMIN_PATH_PATTERN = /^\/admin(?:[/?#]|$)/;

export function safeAdminRedirect(value) {
  if (typeof value !== "string") {
    return ADMIN_FALLBACK;
  }

  const redirect = value.trim();
  if (redirect.startsWith("//")) {
    return ADMIN_FALLBACK;
  }

  return ADMIN_PATH_PATTERN.test(redirect) ? redirect : ADMIN_FALLBACK;
}
