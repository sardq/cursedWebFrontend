import axios from "axios";

const BASE_URL = "http://localhost:8080/api/ticket";


export const answerTicket = async (id, formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/answer/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTicket = async (id) => {
  try {
    const response = await axios.post(`${BASE_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};