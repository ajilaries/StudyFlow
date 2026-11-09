function Sidebar() {
  const menuItems = [
    { icon: "⌂", label: "Dashboard" },
    { icon: "▤", label: "My Tasks" },
    { icon: "▦", label: "Calendar" },
    { icon: "◷", label: "Study Sessions" },
    { icon: "⚙", label: "Settings" }
  ];

  return (
    <aside className="sidebar">

      <div className="logo">
        <span className="logo-icon">S</span>
        <h2>StudyFlow</h2>
      </div>

      <p className="menu-heading">MENU</p>

    <nav>
        {menuItems.map((item,index)=>(
            <div className={`menu-item ${index=== 0 ? "active":""}`}
            key={item.label}>
                <span>{item.icon}</span>
                <p>{item.label}</p>
            </div>
        ))}
    </nav>

      <div className="sidebar-bottom">
        <div className="profile-avatar">AJ</div>
        <div>
          <h4>Student</h4>
          <p>Free Plan</p>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;