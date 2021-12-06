import { LocalStorage } from '@data';

const LoginManager = { userName:null, isChecked:false};
const USERNAME='username'
const IS_CHECKED='isChecked'

LoginManager.init = () => {
    return LocalStorage.multiGet([USERNAME, IS_CHECKED], (error, stores) => {
		stores.map((result, i, store) => {
            // get at each store's key/value so you can work with it
            let key = store[i][0];
            let value = store[i][1];
            if (key == USERNAME) {
                LoginManager.userName = value
            } else if (key == IS_CHECKED) {
                LoginManager.isChecked = JSON.parse(value)
            }
          });
	});
};


LoginManager.saveAccount = (userName) =>{
    LoginManager.userName = userName,
    LocalStorage.set(USERNAME, userName)
}
LoginManager.saveIschecked = (isChecked) =>{
    LoginManager.isChecked = isChecked,
    LocalStorage.set(IS_CHECKED, JSON.stringify(isChecked))
}

LoginManager.getUserName = () => {
    return LoginManager.userName;
};
LoginManager.getIschecked = () => {
    return LoginManager.isChecked;
};

export default LoginManager;