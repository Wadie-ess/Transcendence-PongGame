import axios from 'axios'
export const api = axios.create({
        baseURL: `${process.env.REACT_APP_API_ENDPOINT}`,
        timeout: 10000,
        withCredentials:false,
        headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/x-www-form-urlencoded",
              },
});