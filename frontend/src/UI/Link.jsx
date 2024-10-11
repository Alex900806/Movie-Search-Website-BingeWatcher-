import { NavLink } from "react-router-dom";

export default function Link({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "text-purple-400 font-semibold underline decoration-2 underline-offset-8"
          : "hover:text-purple-400"
      }
    >
      {children}
    </NavLink>
  );
}
