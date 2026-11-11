
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/" },
  { name: "My Tasks", path: "/tasks" },
  { name: "Calendar", path: "/calendar" },
  { name: "Settings", path: "/settings" }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>StudyFlow</h2>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
