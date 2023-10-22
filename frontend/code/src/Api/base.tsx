import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_ENDPOINT}`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
    'Content-Type': 'application/json',
  },
});

let refreshAttempted = false;

const errorHandler = async (error:any) => {

  if (error.response.status === 401) {
    if (!refreshAttempted ) {
      try {
        refreshAttempted = true;
        await api.get("auth/refresh");
        return api.request(error.config);
      } catch (refreshError) {
      }
    } else {
      refreshAttempted = false
    }
  }
  
  return Promise.reject({ ...error });
};

api.interceptors.response.use(
  
  (response) => response,
  (error) => errorHandler(error)
);

export default api;
