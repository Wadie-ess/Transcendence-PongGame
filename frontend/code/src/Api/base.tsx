import axios from 'axios'
export const api = axios.create({
        baseURL: `${process.env.REACT_APP_API_ENDPOINT}`,
        timeout: 10000,
        withCredentials:true,
        headers: {
                "Cache-Control": "no-cache",
                'Content-Type': 'application/json',
                
              },
});