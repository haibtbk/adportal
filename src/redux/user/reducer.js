const initialState = {}
export default userReducer = (state = initialState, action) => {
    switch (action?.type) {
        case "SAVE_USER":
            return {
                ...state,
                account: Object.assign({},state.account,action.account)
            }
            case "SAVE_USER":
            return {
                ...state,
                account: action.account
            }
        default:
            return state;
    }
}