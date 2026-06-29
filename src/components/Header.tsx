import React from "react";
import { NavLink, Link } from "react-router-dom";
import { ROUTES } from "../routes";
import { useAuth } from "context/AuthContext";

const NAV_LINK_CLASSES = "px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors";
const ACTIVE_CLASSES = "text-blue-600 bg-blue-50";

export const Header = (): JSX.Element => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link className="text-2xl font-bold text-blue-600 hover:text-blue-700" to={ROUTES.HOME}>
          conduit
        </Link>
        <ul className="flex gap-2 items-center list-none">
          <li>
            <NavLink className={NAV_LINK_CLASSES} activeClassName={ACTIVE_CLASSES} exact to={ROUTES.HOME}>
              Home
            </NavLink>
          </li>

          {user ? (
            <>
              <li>
                <NavLink className={NAV_LINK_CLASSES} activeClassName={ACTIVE_CLASSES} to={ROUTES.EDITOR}>
                  Article Editor
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={`${NAV_LINK_CLASSES} flex items-center gap-2`}
                  activeClassName={ACTIVE_CLASSES}
                  to={ROUTES.PROFILE.replace(":username", user.username)}
                >
                  {user.image ? (
                    <img src={user.image} alt={user.username} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  {user.username.toUpperCase()}
                </NavLink>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink className={NAV_LINK_CLASSES} activeClassName={ACTIVE_CLASSES} to={ROUTES.LOGIN}>
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
