import { configureStore } from '@reduxjs/toolkit';

import auth from './ducks/auth';
import userLogin from './ducks/userLogin';
import users from './ducks/users';


export default configureStore({
    reducer: {
        auth,
        userLogin,
        users
    }
});
