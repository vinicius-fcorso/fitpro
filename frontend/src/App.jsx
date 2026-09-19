import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Students from "./pages/Students";
import StudentProfile from "./pages/StudentProfile";
import CreateWorkout from "./pages/CreateWorkout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/students" element={<Students />} />

        <Route
          path="/students/:id/"
          element={<StudentProfile />}
        />

        <Route
          path="/students/:id/workout/new"
          element={<CreateWorkout />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;