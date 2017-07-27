export const LOG_OUT = 'LOG_OUT';
export const SET_USER = 'SET_USER';

export const setUser = (user: User) => ({
    type: SET_USER,
    user,
});

export const logOut = () => ({
    type: LOG_OUT,
});
