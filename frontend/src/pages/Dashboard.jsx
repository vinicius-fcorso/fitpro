import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getTrainerDashboard } from "../services/trainerService";
import "../styles/dashboard.css";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Usuário não autenticado.");
          return;
        }

        const data = await getTrainerDashboard(token);

        setDashboard(data.dashboard);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);

        setError(
          error.response?.data?.message ||
          "Não foi possível carregar o dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="dashboard-loading">
          Carregando dashboard...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="dashboard-error">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  const { statistics, recentStudents, recentWorkouts } = dashboard;

  return (
    <DashboardLayout>
      <section className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            VISÃO GERAL
          </span>

          <h2>
            Bom dia, João 👋
          </h2>

          <p>
            Aqui está um resumo da sua operação hoje.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon">👥</span>
            <span className="stat-label">ALUNOS</span>
          </div>

          <strong>{statistics.totalStudents}</strong>

          <span className="stat-description">
            alunos cadastrados
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon">⚡</span>
            <span className="stat-label">TREINOS</span>
          </div>

          <strong>{statistics.totalWorkouts}</strong>

          <span className="stat-description">
            treinos cadastrados
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon">✓</span>
            <span className="stat-label">ATIVOS</span>
          </div>

          <strong>{statistics.activeStudents}</strong>

          <span className="stat-description">
            alunos ativos
          </span>
        </div>

        <div className="stat-card highlight">
          <div className="stat-card-top">
            <span className="stat-icon">📈</span>
            <span className="stat-label">EVOLUÇÃO</span>
          </div>

          <strong>--</strong>

          <span className="stat-description">
            dados em breve
          </span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Alunos recentes</h3>
              <span>
                Últimos alunos cadastrados
              </span>
            </div>

            <a href="/students">
              Ver todos
            </a>
          </div>

          <div className="student-list">
            {recentStudents.length === 0 ? (
              <p className="empty-state">
                Nenhum aluno cadastrado.
              </p>
            ) : (
              recentStudents.map((student) => (
                <div
                  className="student-item"
                  key={student.id}
                >
                  <div className="student-avatar">
                    {student.user.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="student-info">
                    <strong>
                      {student.user.name}
                    </strong>

                    <span>
                      {student.goal || "Objetivo não informado"}
                    </span>
                  </div>

                  <span className="student-status">
                    Ativo
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Treinos recentes</h3>
              <span>
                Últimos treinos cadastrados
              </span>
            </div>

            <a href="/workouts">
              Ver todos
            </a>
          </div>

          <div className="workout-list">
            {recentWorkouts.length === 0 ? (
              <p className="empty-state">
                Nenhum treino cadastrado.
              </p>
            ) : (
              recentWorkouts.map((workout) => (
                <div
                  className="workout-item"
                  key={workout.id}
                >
                  <div className="workout-icon">
                    ⚡
                  </div>

                  <div>
                    <strong>
                      {workout.name}
                    </strong>

                    <span>
                      {workout.student.user.name}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;