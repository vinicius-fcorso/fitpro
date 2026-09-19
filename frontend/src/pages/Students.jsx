import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getStudents,
  createStudent
} from "../services/studentService";
import "../styles/students.css";

function getInitials(name) {
  if (!name) return "?";

  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [goalFilter, setGoalFilter] = useState("TODOS");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "123456",
    birthDate: "",
    height: "",
    weight: "",
    goal: ""
  });

  async function loadStudents() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }

      const data = await getStudents(token);

      setStudents(data.students || []);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);

      setError(
        error.response?.data?.message ||
          "Não foi possível carregar os alunos."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const goals = useMemo(() => {
    const uniqueGoals = students
      .map((student) => student.goal)
      .filter(Boolean);

    return [...new Set(uniqueGoals)];
  }, [students]);

  const filteredStudents = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return students.filter((student) => {
      const name = student.user?.name?.toLowerCase() || "";
      const email = student.user?.email?.toLowerCase() || "";
      const goal = student.goal?.toLowerCase() || "";

      const matchesSearch =
        !searchTerm ||
        name.includes(searchTerm) ||
        email.includes(searchTerm) ||
        goal.includes(searchTerm);

      const matchesGoal =
        goalFilter === "TODOS" ||
        student.goal === goalFilter;

      return matchesSearch && matchesGoal;
    });
  }, [students, search, goalFilter]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function openModal() {
    setFormError("");

    setForm({
      name: "",
      email: "",
      password: "123456",
      birthDate: "",
      height: "",
      weight: "",
      goal: ""
    });

    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setFormError("");
  }

  async function handleCreateStudent(event) {
    event.preventDefault();

    setFormError("");

    if (!form.name.trim()) {
      setFormError("Informe o nome do aluno.");
      return;
    }

    if (!form.email.trim()) {
      setFormError("Informe o e-mail do aluno.");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const data = await createStudent(token, {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        birthDate: form.birthDate || null,
        height: form.height
          ? Number(form.height)
          : null,
        weight: form.weight
          ? Number(form.weight)
          : null,
        goal: form.goal.trim() || null
      });

      setStudents((current) => [
        data.student,
        ...current
      ]);

      setShowModal(false);

      setForm({
        name: "",
        email: "",
        password: "123456",
        birthDate: "",
        height: "",
        weight: "",
        goal: ""
      });
    } catch (error) {
      console.error("Erro ao criar aluno:", error);

      setFormError(
        error.response?.data?.message ||
          "Não foi possível cadastrar o aluno."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="students-loading">
          Carregando alunos...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="students-error">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="students-page">

        <div className="students-header">
          <div>
            <span className="students-eyebrow">
              GESTÃO DE ALUNOS
            </span>

            <h2>Alunos</h2>

            <p>
              Gerencie seus alunos e acompanhe suas informações.
            </p>
          </div>

          <button
            className="new-student-button"
            type="button"
            onClick={openModal}
          >
            <span>+</span>
            Novo aluno
          </button>
        </div>

        <div className="students-toolbar">

          <div className="students-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou objetivo..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            className="students-filter"
            value={goalFilter}
            onChange={(event) =>
              setGoalFilter(event.target.value)
            }
          >
            <option value="TODOS">
              Todos os objetivos
            </option>

            {goals.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>

        </div>

        <div className="students-summary">
          <span>
            <strong>{filteredStudents.length}</strong>{" "}
            aluno(s) encontrado(s)
          </span>

          {search || goalFilter !== "TODOS" ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setGoalFilter("TODOS");
              }}
            >
              Limpar filtros
            </button>
          ) : null}
        </div>

        {filteredStudents.length === 0 ? (
          <div className="students-empty">
            <div className="students-empty-icon">
              ♙
            </div>

            <h3>Nenhum aluno encontrado</h3>

            <p>
              Tente alterar os filtros ou cadastrar um novo aluno.
            </p>
          </div>
        ) : (
          <div className="students-grid">
            {filteredStudents.map((student) => (
              <div
                className="student-card"
                key={student.id}
              >
                <div className="student-card-header">

                  <div className="student-large-avatar">
                    {getInitials(student.user?.name)}
                  </div>

                  <div className="student-card-name">
                    <h3>
                      {student.user?.name || "Sem nome"}
                    </h3>

                    <span>
                      {student.user?.email || "Sem e-mail"}
                    </span>
                  </div>

                  <button
                    className="student-menu"
                    type="button"
                    title="Mais opções"
                  >
                    ⋮
                  </button>

                </div>

                <div className="student-card-divider" />

                <div className="student-card-info">

                  <div className="student-info-block">
                    <span>OBJETIVO</span>

                    <strong>
                      {student.goal || "Não informado"}
                    </strong>
                  </div>

                  <div className="student-info-block">
                    <span>PESO</span>

                    <strong>
                      {student.weight
                        ? `${student.weight} kg`
                        : "Não informado"}
                    </strong>
                  </div>

                </div>

                <div className="student-card-footer">

                  <span className="student-active">
                    <i />
                    Ativo
                  </span>

                  <button
                    className="view-student-button"
                    type="button"
                    onClick={() => navigate(`/students/${student.id}`)}
                  >
                    Ver perfil
                    <span>→</span>
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {showModal && (
        <div
          className="student-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="student-modal">

            <div className="student-modal-header">
              <div>
                <span>NOVO CADASTRO</span>
                <h2>Novo aluno</h2>
                <p>
                  Cadastre um aluno para começar a acompanhar seus treinos.
                </p>
              </div>

              <button
                type="button"
                className="student-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form
              className="student-form"
              onSubmit={handleCreateStudent}
            >

              <div className="student-form-section">
                <h3>Dados pessoais</h3>

                <div className="student-form-grid">

                  <label>
                    Nome completo
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ex.: João da Silva"
                      autoFocus
                    />
                  </label>

                  <label>
                    E-mail
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="aluno@email.com"
                    />
                  </label>

                  <label>
                    Data de nascimento
                    <input
                      name="birthDate"
                      type="date"
                      value={form.birthDate}
                      onChange={handleChange}
                    />
                  </label>

                  <label>
                    Senha inicial
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </label>

                </div>
              </div>

              <div className="student-form-section">
                <h3>Informações físicas</h3>

                <div className="student-form-grid">

                  <label>
                    Altura (cm)
                    <input
                      name="height"
                      type="number"
                      step="0.1"
                      value={form.height}
                      onChange={handleChange}
                      placeholder="Ex.: 180"
                    />
                  </label>

                  <label>
                    Peso (kg)
                    <input
                      name="weight"
                      type="number"
                      step="0.1"
                      value={form.weight}
                      onChange={handleChange}
                      placeholder="Ex.: 82.5"
                    />
                  </label>

                  <label className="student-form-full">
                    Objetivo
                    <input
                      name="goal"
                      value={form.goal}
                      onChange={handleChange}
                      placeholder="Ex.: Hipertrofia"
                    />
                  </label>

                </div>
              </div>

              {formError && (
                <div className="student-form-error">
                  {formError}
                </div>
              )}

              <div className="student-modal-footer">

                <button
                  type="button"
                  className="student-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="student-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Cadastrando..."
                    : "Cadastrar aluno"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default Students;