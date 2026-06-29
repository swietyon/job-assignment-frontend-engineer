import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Article from "./components/Article";
import ArticleList from "./components/ArticleList";
import Editor from "./components/Editor";
import LoginRegister from "./pages/LoginRegister";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import { ROUTES } from "./routes";

interface RouteConfig {
  path: string;
  component: React.ComponentType<unknown>;
  exact?: boolean;
}

const APP_ROUTES: RouteConfig[] = [
  { path: ROUTES.LOGIN, component: LoginRegister, exact: true },
  { path: ROUTES.LOGOUT, component: Logout, exact: true },
  { path: ROUTES.EDITOR, component: Editor, exact: true },
  { path: ROUTES.PROFILE, component: Profile, exact: true },
  { path: ROUTES.ARTICLE, component: Article, exact: true },
  { path: ROUTES.HOME, component: ArticleList, exact: true },
];

function App(): JSX.Element {
  return (
    <Router>
      <Header />

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