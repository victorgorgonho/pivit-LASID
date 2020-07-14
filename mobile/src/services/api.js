import { create } from 'apisauce';

//Connect to backend
const api = create({ 
    baseURL: 'http://192.168.1.106:3333',
});

api.addResponseTransform(response => {
    if(!response.ok) throw response;
});

export default api;

// 10.204.230.156 Eduroam
// 192.168.15.50 Casa JP