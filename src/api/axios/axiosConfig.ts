import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.21:3003/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("No autorizado. Redirigiendo a login.");
      // Redirige si estás usando React Router
      window.location.href = "/login";
    } else if (status === 500) {
      alert("Error interno del servidor. Intenta más tarde.");
    } else {
      console.error("Error desconocido:", error);
    }

    return Promise.reject(error);
  }
);

export default api;
