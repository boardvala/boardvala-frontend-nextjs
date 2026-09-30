import api from "./api";

export async function submitSurvey(data) {
  const res = await api.post("/survey", data);
  return res.data;
}

export async function getSurveyStats() {
  const res = await api.get("/survey/stats");
  return res.data;
}