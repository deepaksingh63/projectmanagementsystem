import { Bell, FolderKanban, LayoutDashboard, ListTodo, LogOut, Menu, Moon, Sun, UserCircle2, Users } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import useTheme from "../../hooks/useTheme.js";

const AppShell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const links = useMemo(() => {
    const common = [
      { label: "Tasks", path: "/tasks", icon: <ListTodo size={18} /> },
      { label: "Profile", path: "/profile", icon: <UserCircle2 size={18} /> },
    ];

    if (user?.role === "admin") {
      return [
        { label: "Dashboard", path: "/admin-dashboard", icon: <LayoutDashboard size={18} /> },
        { label: "Projects", path: "/projects", icon: <FolderKanban size={18} /> },
        { label: "Users", path: "/profile", icon: <Users size={18} /> },
        ...common,
      ];
    }

    return [{ label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> }, ...common];
  }, [user?.role]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="brand">
          <div className="brand__mark">EP</div>
          <div>
            <h1>Ethara Project Hub</h1>
            <p>Assessment-ready workspace</p>
          </div>
        </div>

        <nav className="sidebar__nav">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="user-panel">
            <img
              src={user?.avatar || "https://ui-avatars.com/api/?background=0F766E&color=fff&name=Project+Hub"}
              alt={user?.name}
            />
            <div>
              <strong>{user?.name}</strong>
              <p>{user?.role}</p>
            </div>
          </div>
          <button type="button" className="ghost-button sidebar__logout" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="content-area">
        <header className="topbar">
          <div className="topbar__left">
            <button type="button" className="icon-button mobile-only" onClick={() => setIsOpen((prev) => !prev)}>
              <Menu size={20} />
            </button>
            <div>
              <p className="eyebrow">Workspace</p>
              <h2>{location.pathname.replace("/", "").replace("-", " ") || "dashboard"}</h2>
            </div>
          </div>

          <div className="topbar__actions">
            <button type="button" className="icon-button" onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button type="button" className="icon-button">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
