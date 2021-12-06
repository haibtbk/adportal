import { AccessTokenManager } from '@data'
import { RouterName } from '@navigation';
import { logout as _logout } from '@redux/user/action';
const logout = (navigation, dispatch) => {
    AccessTokenManager.clear()
    dispatch(_logout())
    navigation.reset({
        index: 0,
        routes: [{ name: RouterName.login }],
    })
}

export default {
    logout
}