import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { getStudentById } from "../services/studentService";
import { getStudentWorkouts } from "../services/workoutService";
import "../styles/student-profile.css";

function getInitials(name) {
  if (!name) return "?";

  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
  async function loadStudent() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }

      const [studentData, workoutData] = await Promise.all([
        getStudentById(token, id),
        getStudentWorkouts(token, id),
      ]);

      setStudent(studentData.student);
      setWorkouts(workoutData.workouts || []);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);

      setError(
        error.response?.data?.message ||
          "Não foi possível carregar o perfil do aluno."
      );
    } finally {
      setLoading(false);
    }
  }

  loadStudent();
}, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="student-profile-loading">
          Carregando perfil...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="student-profile-error">
          <h2>Não foi possível carregar o aluno</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/students")}
          >
            ← Voltar para alunos
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return null;
  }

  const name = student.user?.name || "Aluno";
  const email = student.user?.email || "Sem e-mail";

  return (
    <DashboardLayout>
      <div className="student-profile-page">

        <button
          className="student-profile-back"
          type="button"
          onClick={() => navigate("/students")}
        >
          ← Voltar para alunos
        </button>

        <section className="student-profile-header">

          <div className="student-profile-identity">

            <div className="student-profile-avatar">
              {getInitials(name)}
            </div>

            <div>
              <span className="student-profile-eyebrow">
                PERFIL DO ALUNO
              </span>

              <h2>{name}</h2>

              <p>{email}</p>
            </div>

          </div>

          <span className="student-profile-status">
            <i />
            Ativo
          </span>

        </section>

        <section className="student-profile-section">

          <div className="student-profile-section-header">
            <div>
              <span>INFORMAÇÕES</span>
              <h3>Dados físicos</h3>
            </div>
          </div>

          <div className="student-profile-stats">

            <div className="student-profile-stat">
              <span>ALTURA</span>

              <strong>
                {student.height
                  ? `${student.height} cm`
                  : "--"}
              </strong>
            </div>

            <div className="student-profile-stat">
              <span>PESO</span>

              <strong>
                {student.weight
                  ? `${student.weight} kg`
                  : "--"}
              </strong>
            </div>

            <div className="student-profile-stat">
              <span>OBJETIVO</span>

              <strong>
                {student.goal || "Não informado"}
              </strong>
            </div>

            <div className="student-profile-stat">
              <span>NASCIMENTO</span>

              <strong>
                {student.birthDate
                  ? new Date(
                      student.birthDate
                    ).toLocaleDateString("pt-BR")
                  : "--"}
              </strong>
            </div>

          </div>

        </section>

        <section className="student-profile-section">

          <div className="student-profile-section-header">

            <div>
              <span>ACOMPANHAMENTO</span>
              <h3>Treinos</h3>
            </div>

            <button
              type="button"
              className="student-profile-primary-button"
              onClick={() => navigate(`/students/${student.id}/workout/new`)}
            >
              + Criar treino
            </button>

          </div>

          {workouts.length === 0 ? (
            <div className="student-profile-empty">
                <div className="student-profile-empty-icon">
                    ⚡
                </div>

                <h3>Nenhum treino cadastrado</h3>

                <p>
                    Crie o primeiro treino para este aluno.
                </p>
            </div>
          ) : (
            <div className="student-profile-workouts">
                {workouts.map((workout) => (
                    <div
                        className="student-profile-workout"
                        key={workout.id}
                    >     
                    <div>
                        <span className="student-profile-workout-label">
                            TREINO
                        </span>

                        <h4>{workout.name}</h4>

                        {workout.description && (
                            <p>{workout.description}</p>
                        )}
                    </div>

                    <div className="student-profile-workout-meta">
                        <strong>
                            {workout.exercises?.length || 0}
                        </strong>

                        <span>exercícios</span>
                    </div>
                </div>
            ))}
        </div>
        )}

        </section>

      </div>
    </DashboardLayout>
  );
}

export default StudentProfile;