import axios from "axios";

const BASE_URL = "http://localhost:8080/api/examination";

export const saveExamination = async (examination) => {
  try {
    const response = await axios.post(`${BASE_URL}/create/`, examination);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchExaminations = async (userId = 0, page = 0) => {
  try {
    const response = await axios.get(`${BASE_URL}?userId=${userId}&page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExamination = async (id, examination) => {
  try {
    const response = await axios.post(`${BASE_URL}/edit/${id}`, examination);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteExamination = async (id) => {
  try {
    const response = await axios.post(`${BASE_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchStatistics = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${BASE_URL}/examinationStat`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};