import api from "./api";

export async function createWorkout(token, workoutData) {
  const response = await api.post(
    "/workouts",
    workoutData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getStudentWorkouts(token, studentId) {
  const response = await api.get(
    `/workouts?studentId=${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}