import api from '../../services/api';

import { login, logout, register } from '../ducks/auth';
import { forgotPassword, resetPassword } from '../ducks/users';

export const authFetch = (email, password) => {
    return (dispatch) => {
        api.post('/users/authenticate', {
            email,
            password
        }).then((res) => {
            dispatch(login());
            localStorage.setItem('@lasid/token', res.data.token);
            localStorage.setItem('@lasid/user', JSON.stringify(res.data.user));
            
            console.log(res.data.user);
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
            dispatch(logout());
            localStorage.removeItem('@lasid/token');
            localStorage.removeItem('@lasid/user');
        }).catch((err) => {
            console.log(err);
            alert('Falha ao deslogar, tente novamente!');    
        });
    }
}

export const registerFetch = (user) => {
    return (dispatch) => {
        api.post('/users/register', user).then((res) => {
            dispatch(register(res.data.user));
            window.location.pathname = '/';
        }).catch((err) => {
            console.log(err);
            alert('Falha ao registrar, tente novamente!');    
        });
    }
}

export const forgotPasswordFetch = (email) => {
    return (dispatch) => {
        api.post('/users/forgot_password', {
            email
        }).then((res) => {
            dispatch(forgotPassword(email));
            localStorage.setItem('@lasid/email', email);
            window.location.pathname = '/reset';
        }).catch((err) => {
            console.log(err);
            alert('Falha ao mudar senha, tente novamente!');    
        });
    }
}

export const resetPasswordFetch = (email, token, password) => {
    return (dispatch) => {
        api.post('/users/reset_password', {
            email,
            token,
            password
        }).then((res) => {
            dispatch(resetPassword(email));
            localStorage.removeItem('@lasid/email');
            window.location.pathname = '/';
        }).catch((err) => {
            console.log(err);
            alert('Falha ao mudar senha, tente novamente!');    
        });
    }
}