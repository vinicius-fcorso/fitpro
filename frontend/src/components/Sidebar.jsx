import "../styles/sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>FIT</span>
        <strong>PRO</strong>
      </div>

      <nav className="sidebar-nav">
        <a href="/dashboard" className="sidebar-link active">
          <span>⌂</span>
          Dashboard
        </a>

        <a href="/students" className="sidebar-link">
          <span>♙</span>
          Alunos
        </a>

        <a href="/workouts" className="sidebar-link">
          <span>⚡</span>
          Treinos
        </a>

        <a href="/exercises" className="sidebar-link">
          <span>▦</span>
          Exercícios
        </a>

        <a href="/calendar" className="sidebar-link">
          <span>□</span>
          Agenda
        </a>

        <a href="/progress" className="sidebar-link">
          <span>↗</span>
          Progresso
        </a>

        <a href="/payments" className="sidebar-link">
          <span>R$</span>
          Pagamentos
        </a>
      </nav>

      <div className="sidebar-bottom">
        <a href="/settings" className="sidebar-link">
          <span>⚙</span>
          Configurações
        </a>

        <button className="sidebar-logout" type="button">
          <span>↪</span>
          Sair
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;