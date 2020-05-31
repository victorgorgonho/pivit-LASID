import api from '../../services/api';

import { login, logout } from '../ducks/auth';

export const authFetch = (email, password) => {
    return (dispatch) => {
        api.post('/users/authenticate', {
            email,
            password
        }).then((res) => {
            localStorage.setItem('@lasid/token', res.data.token);
            localStorage.setItem('@lasid/user', JSON.stringify(res.data.user));
        
            console.log(res.data.user);
            dispatch(login());

            //window.location.pathname = '/home';
        }).catch((err) => {
            console.log(err);
            alert('Login inválido, tente novamente!');
            //window.location.pathname = '/';
        }); 
    }
}

export const logoutFetch = (token) => {
    return (dispatch) => {
        api.post('/sessions/logout', {}, {Authorization: token}).then((res) => {
            localStorage.removeItem('@lasid/token');
            dispatch(logout());
        }).catch((err) => {
            console.log(err);
            alert('Falha ao deslogar, tente novamente!');    
        });
    }
}