import axios from "axios";

const BASE_URL = "http://localhost:8080/api/examination";

export const saveExamination = async (description, conclusion, time, userId, examinationTypeId) => {
  try {
    const response = await axios.post(`${BASE_URL}/create/`, description, conclusion, time, userId, examinationTypeId);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateExamination = async (id, formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/edit/${id}`, formData);
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