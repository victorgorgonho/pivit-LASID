import { createAction, createReducer } from '@reduxjs/toolkit';

const INITIAL_STATE = {
    isLogged: false
}

export const login = createAction('LOGIN');
export const logout = createAction('LOGOUT');

export default createReducer(INITIAL_STATE, {
    [login.type]: (state, action) => ({...state, isLogged: true}),
    [logout.type]: (state, action) => ({...state, isLogged: false})
});