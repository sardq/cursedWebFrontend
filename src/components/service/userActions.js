import axios from "axios";

const BASE_URL = "http://localhost:8080/api/user";

export const updateParameters = async (id, examinationType) => {
  try {
    const response = await axios.post(`${BASE_URL}/edit/${id}`, examinationType);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.post(`${BASE_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};