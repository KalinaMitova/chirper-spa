let auth = (() => {
    //set a session storage
    function saveSession(user) {
        sessionStorage.setItem('authtoken', user._kmd.authtoken);
        sessionStorage.setItem('username', user.username);
        sessionStorage.setItem('userId', user._id);
        sessionStorage.setItem('subscriptions', user.subscriptions);
    }

    //clean session storage
    function clearStorage() {
      sessionStorage.clear();
    }

    //check if  there is a logged user. If there is  it returns username and auth token
    function isAuthed() {
        return sessionStorage.getItem('authtoken') !== null
            ? {
                username: sessionStorage.getItem("username"),
                userId: sessionStorage.getItem('userId'),
                authtoken: sessionStorage.getItem('authtoken'),
                subscriptions: sessionStorage.getItem('subscriptions')
            }
            : false ;
    }

    // user/login
    function login(username, password) {
        let userData = {
            username,
            password,
        };

        return requester.post('user', 'login', 'basic', userData);
    }

    // user/register
    function register(username, password) {
        let userData = {
            username: username,
            password: password,
            subscriptions: []
        };

        return requester.post('user', '', 'basic', userData);
    }

    // user/logout
    function logout() {
        let logoutData = {
            authtoken: sessionStorage.getItem('authtoken')
        };

        return requester.post('user', '_logout', 'kinvey', logoutData);
    }

    return {
        login,
        register,
        logout,
        saveSession,
        clearStorage,
        isAuthed,
    }
})()