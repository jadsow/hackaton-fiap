import axios from "axios";

// Crie a instância do Axios com a URL base do seu backend
// Altere a porta se a sua API rodar em uma diferente
const api = axios.create({
  baseURL: "http://localhost:3000", // <-- MUDE AQUI SE NECESSÁRIO
});

// Isso é MÁGICA! Esse "interceptor" é executado ANTES de cada requisição.
// Ele vai pegar o token que salvamos no navegador e injetá-lo no cabeçalho.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
