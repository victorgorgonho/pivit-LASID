import { createAction, createReducer } from '@reduxjs/toolkit';

const INITIAL_STATE = [];

export const forgotPassword = createAction('FORGOT_PASSWORD');
export const resetPassword = createAction('RESET_PASSWORD');

export default createReducer(INITIAL_STATE, {
    [forgotPassword.type]: (state, action) => (console.log('E-mail enviado com sucesso')),
    [resetPassword.type]: (state, action) => (console.log('Senha alterada com sucesso'))
});
