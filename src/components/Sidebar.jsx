import { NavLink } from "react-router-dom";

const Sidebar = ({ title, links }) => (
  <aside className="h-full rounded-3xl bg-white p-6 shadow-card">
    <div className="mb-6">
      <p className="text-sm uppercase tracking-wide text-gray-400"></p>
      <h2 className="text-2xl font-semibold text-secondary">{title}</h2>
    </div>

    <nav className="space-y-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            [
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
              isActive
                ? "bg-accent/40 text-secondary"
                : "text-gray-600 hover:bg-accent/20"
            ].join(" ")
          }
        >
          {link.icon && (
            <span className="text-lg text-secondary">{link.icon}</span>
          )}
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
