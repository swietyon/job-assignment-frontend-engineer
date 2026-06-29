export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  LOGOUT: "/logout",
  EDITOR: "/editor/:slug?",
  PROFILE: "/profile/:username",
  ARTICLE: "/articles/:slug",
} as const;