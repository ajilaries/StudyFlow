
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">
        <Header />

        <Outlet />
      </main>

    </div>
  );
}

export default MainLayout;
