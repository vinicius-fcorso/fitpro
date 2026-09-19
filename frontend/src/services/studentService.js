import api from "./api";

export async function getStudents(token) {
  const response = await api.get("/students", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

export async function createStudent(token, studentData) {
  const response = await api.post(
    "/students",
    studentData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}

export async function getStudentById(token, studentId) {
  const response = await api.get(
    `/students/${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}