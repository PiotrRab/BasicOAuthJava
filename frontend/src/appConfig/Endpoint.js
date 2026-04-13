import axios from "axios";
import appConfig from "./appConfig";

const axiosInstance = axios.create({
    baseURL: appConfig.apiUrl,
    withCredentials: true
});

// Interceptor do obsługi błędu 401 i odświeżania tokena
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Jeśli błąd to 401 i nie jest to prośba o logowanie ani o sam refresh
        if (error.response?.status === 401 && !originalRequest._retry && 
            !originalRequest.url.includes('/auth/login') && 
            !originalRequest.url.includes('/auth/refresh')) {
            
            originalRequest._retry = true;

            try {
                // Próba odświeżenia accessTokena za pomocą refreshTokena (przesyłanego w ciastku)
                await axiosInstance.post('/auth/refresh');
                
                // Po udanym refreshu ponawiamy oryginalne zapytanie
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Jeśli refresh się nie udał (np. refreshToken wygasł), wylogowujemy i przekierowujemy do login
                console.error("Session expired, redirecting to login...");
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const GET = (url, id, data, callback) => {
    const finalUrl = !id ? url : `${url}/${id}`;
    axiosInstance.get(finalUrl, { params: data || {} })
        .then(response => {
            if (callback) callback(response.data);
        })
        .catch(err => console.error("GET error:", err));
}

export const POST = (url, data, callback) => {
    axiosInstance.post(url, data)
        .then(response => {
            if (callback) callback(response.data);
        })
        .catch(err => console.error("POST error:", err));
}

export const PUT = (url, id, data, callback) => {
    const finalUrl = !id ? url : `${url}/${id}`;
    axiosInstance.put(finalUrl, data)
        .then(response => {
            if (callback) callback(response.data);
        })
        .catch(err => console.error("PUT error:", err));
}

export const DELETE = (url, id, callback) => {
    axiosInstance.delete(`${url}/${id}`)
        .then(response => {
            if (callback) callback(response.data);
        })
        .catch(err => console.error("DELETE error:", err));
}
