import axios from "axios";

const BASE_URL = "http://localhost:8080/api/examinationType";

export const saveExaminationType = async (name) => {
  try {
    const response = await axios.post(`${BASE_URL}/create/`, name);
    console.log(response);
    console.log(name);
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