
handlers.registerController =  function () {
    util.getUsername(this);
    this.loadPartials(util.getPartials('register/register'))
        .then(function () {
        this.partial('./templates/common/main.hbs');
    })
};

handlers.registerActionController = function (context) {

    let username = context.params.username;
    let password = context.params.password;
    let repeatPass = context.params.repeatPass;

    if(username.length === 0){
        notifier.showError('Error: Enter a username');
        return;
    }

    if (username.length < 5) {
        notifier.showError('Error: A username should be at least 5 characters long');
        return;
    }

    if(password.length === 0){
        notifier.showError('Error: Enter a password');
        return;
    }

    if (repeatPass.length === 0) {
        notifier.showError('Error: Please repeat your password');
        return;
    }
    if (repeatPass !== password) {
        notifier.showError('Error: The passwords don`t match');
        return;
    }


    auth.register(username, password)
        .then(function (user) {
            auth.saveSession(user);
            context.username = username;
            notifier.showInfo('User registration successful.');
            context.redirect('#/home');
        })
        .catch(notifier.handleError)
    ;
}

handlers.loginController =  function () {
    util.getUsername(this);
    this.loadPartials(util.getPartials('login/login'))
        .then(function () {
        this.partial('./templates/common/main.hbs');
    })
};

handlers.loginActionController = function (context) {

    let username = context.params.username;
    let password = context.params.password;

    if(username.length === 0){
        notifier.showError('Error: Enter a username');
        return;
    }

    if (username.length < 5) {
        notifier.showError('Error: A username should be at least 5 characters long');
        return;
    }

    if(password.length === 0){
        notifier.showError('Error: Enter a password');
        return;
    }

    auth.login(username, password)
        .then(function (user) {
            auth.saveSession(user);
            notifier.showInfo('Login successful.');
            context.redirect('#/home');
        })
        .catch(notifier.handleError);
}

handlers.logoutController =  function (ctx) {
    auth.logout()
        .then(() => {
            sessionStorage.clear();
            notifier.showInfo('Logout successful.')
            this.redirect('#');
        })
        .catch(notifier.handleError);
};
