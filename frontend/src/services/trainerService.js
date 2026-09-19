import api from "./api";

export async function getTrainerDashboard(token) {
  const response = await api.get("/trainer/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}