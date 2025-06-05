import {jwtDecode} from "jwt-decode";

export const getCurrentUserFromToken = () => {
  const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (e) {
    console.error("Ошибка при декодировании токена:", e);
    return null;
  }
};