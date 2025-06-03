import axios from "axios";

const BASE_URL = "http://localhost:8080/api/parametres";

export const saveParameters = async (name) => {
  try {
    const response = await axios.post(`${BASE_URL}/create/`, name);
    console.log(response);
    console.log(name);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateParameters = async (id, formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/edit/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteParameters = async (id) => {
  try {
    const response = await axios.post(`${BASE_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};