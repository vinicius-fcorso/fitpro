import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/create-workout.css"
import { createWorkout } from "../services/workoutService";

function CreateWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workoutName, setWorkoutName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [exercises, setExercises] = useState([
    {
      exerciseName: "",
      sets: 3,
      reps: 10,
      weight: "",
      restSeconds: 60,
      notes: "",
    },
  ]);

  function addExercise() {
    setExercises([
      ...exercises,
      {
        exerciseName: "",
        sets: 3,
        reps: 10,
        weight: "",
        restSeconds: 60,
        notes: "",
      },
    ]);
  }

  function removeExercise(index) {
    setExercises(
      exercises.filter((_, exerciseIndex) => exerciseIndex !== index)
    );
  }

  function updateExercise(index, field, value) {
    const updatedExercises = [...exercises];

    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };

    setExercises(updatedExercises);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    
    try {
        setSaving(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Usuário não autenticado.");
            return;
        }

        const workoutData = {
            name: workoutName,
            description,
            studentId: Number(id),
            exercises: exercises.map((exercise, index) => ({
                exerciseName: exercise.exerciseName,
                sets: Number(exercise.sets),
                reps: Number(exercise.reps),
                weight:
                exercise.weight === ""
                ? null
                : Number(exercise.weight),
                restSeconds: Number(exercise.restSeconds),
                order: index + 1,
                notes: exercise.notes,
            })),
        };

        await createWorkout(token, workoutData);

        navigate(`/students/${id}`);
    } 
    catch (error) {
        console.error("Erro ao criar treino:", error);

        setError(
            error.response?.data?.message ||
            "Não foi possível criar o treino."
        );
    } 
    finally {
        setSaving(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="create-workout-page">
        <button
          type="button"
          className="create-workout-back"
          onClick={() => navigate(`/students/${id}`)}
        >
          ← Voltar para aluno
        </button>

        <div className="create-workout-header">
          <div>
            <span>PLANEJAMENTO</span>
            <h2>Novo treino</h2>
            <p>
              Monte o treino e adicione os exercícios do aluno.
            </p>
          </div>
        </div>

        {error && (
            <div 
                style={{
                    marginBottom: "18px",
                    padding: "12px",
                    border: "1px solid #512c2c",
                    borderRadius: "7px",
                    background: "#1c1515",
                    color: "#ff8585",
                    fontSize: "12px",
                }}
            >
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          <section className="create-workout-section">
            <div className="create-workout-section-header">
              <div>
                <span>INFORMAÇÕES</span>
                <h3>Dados do treino</h3>
              </div>
            </div>

            <div className="create-workout-form-grid">
              <div className="create-workout-field">
                <label>Nome do treino</label>

                <input
                  type="text"
                  value={workoutName}
                  onChange={(event) =>
                    setWorkoutName(event.target.value)
                  }
                  placeholder="Ex: Treino A — Peito e Tríceps"
                  required
                />
              </div>

              <div className="create-workout-field">
                <label>Descrição</label>

                <input
                  type="text"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Ex: Foco em hipertrofia"
                />
              </div>
            </div>
          </section>

          <section className="create-workout-section">
            <div className="create-workout-section-header">
              <div>
                <span>EXERCÍCIOS</span>
                <h3>Composição do treino</h3>
              </div>

              <button
                type="button"
                className="create-workout-add-button"
                onClick={addExercise}
              >
                + Adicionar exercício
              </button>
            </div>

            <div className="create-workout-exercises">
              {exercises.map((exercise, index) => (
                <div
                  className="create-workout-exercise"
                  key={index}
                >
                  <div className="create-workout-exercise-header">
                    <strong>
                      Exercício {index + 1}
                    </strong>

                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                      >
                        Remover
                      </button>
                    )}
                  </div>

                  <div className="create-workout-exercise-grid">
                    <div className="create-workout-field exercise-name">
                      <label>Exercício</label>

                      <input
                        type="text"
                        value={exercise.exerciseName}
                        onChange={(event) =>
                          updateExercise(
                            index,
                            "exerciseName",
                            event.target.value
                          )
                        }
                        placeholder="Ex: Supino reto"
                        required
                      />
                    </div>

                    <div className="create-workout-field">
                      <label>Séries</label>

                      <input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(event) =>
                          updateExercise(
                            index,
                            "sets",
                            event.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="create-workout-field">
                      <label>Repetições</label>

                      <input
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(event) =>
                          updateExercise(
                            index,
                            "reps",
                            event.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="create-workout-field">
                      <label>Carga (kg)</label>

                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercise.weight}
                        onChange={(event) =>
                          updateExercise(
                            index,
                            "weight",
                            event.target.value
                          )
                        }
                        placeholder="0"
                      />
                    </div>

                    <div className="create-workout-field">
                      <label>Descanso (seg)</label>

                      <input
                        type="number"
                        min="0"
                        value={exercise.restSeconds}
                        onChange={(event) =>
                          updateExercise(
                            index,
                            "restSeconds",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div className="create-workout-field exercise-notes">
                      <label>Observações</label>

                      <input
                        type="text"
                        value={exercise.notes}
                        onChange={(event) =>
                          updateExercise(
                            index,
                            "notes",
                            event.target.value
                          )
                        }
                        placeholder="Ex: Executar com controle"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="create-workout-actions">
            <button
              type="button"
              className="create-workout-cancel"
              onClick={() => navigate(`/students/${id}`)}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="create-workout-save"
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar Treino"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default CreateWorkout;