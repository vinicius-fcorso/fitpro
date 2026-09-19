import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { getWorkoutById } from "../services/workoutService";
import "../styles/workout-details.css";

function WorkoutDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWorkout() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Usuário não autenticado.");
          return;
        }

        const data = await getWorkoutById(token, id);

        setWorkout(data.workout);
      } catch (error) {
        console.error("Erro ao carregar treino:", error);

        setError(
          error.response?.data?.message ||
            "Não foi possível carregar o treino."
        );
      } finally {
        setLoading(false);
      }
    }

    loadWorkout();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="workout-details-loading">
          Carregando treino...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="workout-details-error">
          <h2>Não foi possível carregar o treino</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!workout) {
    return null;
  }

  const studentName =
    workout.student?.user?.name || "Aluno";

  return (
    <DashboardLayout>
      <div className="workout-details-page">

        <button
          type="button"
          className="workout-details-back"
          onClick={() =>
            navigate(`/students/${workout.studentId}`)
          }
        >
          ← Voltar para o aluno
        </button>

        <section className="workout-details-header">

          <div>
            <span className="workout-details-eyebrow">
              TREINO DO ALUNO
            </span>

            <h2>{workout.name}</h2>

            {workout.description && (
              <p>{workout.description}</p>
            )}

            <span className="workout-details-student">
              Aluno: <strong>{studentName}</strong>
            </span>
          </div>

          <div className="workout-details-count">
            <strong>
              {workout.exercises?.length || 0}
            </strong>

            <span>exercícios</span>
          </div>

        </section>

        <section className="workout-details-section">

          <div className="workout-details-section-header">
            <div>
              <span>EXECUÇÃO</span>
              <h3>Exercícios</h3>
            </div>
          </div>

          {workout.exercises?.length === 0 ? (
            <div className="workout-details-empty">
              <h3>Nenhum exercício cadastrado</h3>

              <p>
                Este treino ainda não possui exercícios.
              </p>
            </div>
          ) : (
            <div className="workout-exercises-list">

              {workout.exercises.map((exercise, index) => (
                <div
                  className="workout-exercise-card"
                  key={exercise.id}
                >

                  <div className="workout-exercise-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="workout-exercise-main">

                    <div className="workout-exercise-title">
                      <h4>
                        {exercise.exerciseName}
                      </h4>

                      {exercise.notes && (
                        <p>{exercise.notes}</p>
                      )}
                    </div>

                    <div className="workout-exercise-data">

                      <div>
                        <span>SÉRIES</span>
                        <strong>{exercise.sets}</strong>
                      </div>

                      <div>
                        <span>REPS</span>
                        <strong>{exercise.reps}</strong>
                      </div>

                      <div>
                        <span>CARGA</span>
                        <strong>
                          {exercise.weight !== null &&
                          exercise.weight !== undefined
                            ? `${exercise.weight} kg`
                            : "--"}
                        </strong>
                      </div>

                      <div>
                        <span>DESCANSO</span>
                        <strong>
                          {exercise.restSeconds}s
                        </strong>
                      </div>

                    </div>

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

export default WorkoutDetails;