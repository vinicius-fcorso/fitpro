import Sidebar from "../components/Sidebar";
import "../styles/layout.css";

function DashboardLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-content">
        <header className="topbar">
          <div>
            <h1>FitPro</h1>
          </div>

          <div className="topbar-user">
            <div className="user-avatar">
              JS
            </div>

            <div className="user-info">
              <strong>João Silva</strong>
              <span>Personal Trainer</span>
            </div>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;