import React from "react";
import { NavLink, Link } from "react-router-dom";
import { ROUTES } from "../routes";

interface NavItem {
  label: string;
  path: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: ROUTES.HOME, exact: true },
  { label: "Profile", path: ROUTES.PROFILE },
  { label: "Article Editor", path: ROUTES.EDITOR },
  { label: "Login", path: ROUTES.LOGIN },
];

const NAV_LINK_CLASSES = "px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors";
const ACTIVE_CLASSES = "text-blue-600 bg-blue-50";

export const Header = (): JSX.Element => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link className="text-2xl font-bold text-blue-600 hover:text-blue-700" to={ROUTES.HOME}>
          conduit
        </Link>
        <ul className="flex gap-2 items-center list-none">
          {NAV_ITEMS.map(item => (
            <li key={item.path}>
              <NavLink className={NAV_LINK_CLASSES} activeClassName={ACTIVE_CLASSES} exact={item.exact} to={item.path}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
