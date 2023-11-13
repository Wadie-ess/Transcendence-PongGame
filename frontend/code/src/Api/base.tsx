import axios from "axios";
// import { useNavigate } from 'react-router-dom';
// import { useUserStore } from "../Stores/stores";
// const useNavigateCustom = () => {
//   const navigate = useNavigate();
//   return navigate;
// };
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_ENDPOINT}`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  },
});

  let refreshAttempted = 0;
  
  const errorHandler = async (error: any) => {
  
    if (error?.response?.status === 401) {
      if (refreshAttempted <= 2) {
        try {
          refreshAttempted++;
          await api.get("auth/refresh");
          return api.request(error.config);
        } catch (refreshError) {}
      } else {
        refreshAttempted--;
      }
    }
    return Promise.reject(error);
  };
  api.interceptors.response.use(
    (response) => response,
    (error) => errorHandler(error)
  );
  
  export default api;
