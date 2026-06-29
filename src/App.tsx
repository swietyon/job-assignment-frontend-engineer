import React from "react";
import { HashRouter as Router, Switch, Route, NavLink, Link } from "react-router-dom";

import Article from "./components/Article";
import ArticleList from "./components/ArticleList";
import Editor from "./components/Editor";
import LoginRegister from "./pages/LoginRegister";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  LOGOUT: "/logout",
  EDITOR: "/editor/:slug?",
  PROFILE: "/profile/:username",
  ARTICLE: "/:slug",
} as const;

interface NavItem {
  label: string;
  path: string;
  exact?: boolean;
}

interface RouteConfig {
  path: string;
  component: React.ComponentType<unknown>;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: ROUTES.HOME, exact: true },
  // { label: "Sign in", path: ROUTES.LOGIN },
  // { label: "Sign out", path: ROUTES.LOGOUT },
  { label: "Profile", path: ROUTES.PROFILE },
  { label: "Article Editor", path: ROUTES.EDITOR },
];

const APP_ROUTES: RouteConfig[] = [
  { path: ROUTES.LOGIN, component: LoginRegister, exact: true },
  { path: ROUTES.LOGOUT, component: Logout, exact: true },
  { path: ROUTES.EDITOR, component: Editor, exact: true },
  { path: ROUTES.PROFILE, component: Profile, exact: true },
  { path: ROUTES.ARTICLE, component: Article, exact: true },
  { path: ROUTES.HOME, component: ArticleList, exact: true },
];

const NAV_LINK_CLASSES = "px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors";
const ACTIVE_CLASSES = "text-blue-600 bg-blue-50";

function App(): JSX.Element {
  return (
    <Router>
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link className="text-2xl font-bold text-blue-600 hover:text-blue-700" to={ROUTES.HOME}>
            conduit
          </Link>
          <ul className="flex gap-2 items-center list-none">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  className={NAV_LINK_CLASSES}
                  activeClassName={ACTIVE_CLASSES}
                  exact={item.exact}
                  to={item.path}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md p-6">
          <Switch>
            {APP_ROUTES.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                exact={route.exact}
                component={route.component}
              />
            ))}
          </Switch>
        </div>
      </main>
    </Router>
  );
}

export default App;