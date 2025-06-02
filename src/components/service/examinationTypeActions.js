import axios from "axios";

const BASE_URL = "http://localhost:8080/api/examinationType";

export const saveExaminationType = async (examinationType) => {
  try {
    const response = await axios.post(`${BASE_URL}/create/`, examinationType);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchExaminationTypes = async (userId = 0, page = 0) => {
  try {
    const response = await axios.get(`${BASE_URL}?userId=${userId}&page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExaminationType = async (id, examinationType) => {
  try {
    const response = await axios.post(`${BASE_URL}/edit/${id}`, examinationType);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteExaminationType = async (id) => {
  try {
    const response = await axios.post(`${BASE_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};