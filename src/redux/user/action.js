export function saveUser(user) {
    return async (dispatch) => {
        return dispatch({
            type: 'SAVE_USER',
            account: user
        });
    };
}

export function logout(){
    return async (dispatch) => {
        return dispatch({
            type: 'LOU_OUT'
        });
    };
}