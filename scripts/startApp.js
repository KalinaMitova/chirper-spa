const handlers = {};
const util = {};

$(() => {
    util.getPartials = function (page) {
        return{
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            navigation: './templates/common/navigation.hbs',
            page: `./templates/${page}.hbs`,

        }
    };
    util.getUsername = function (ctx) {
        if (auth.isAuthed()) {
            ctx.username = auth.isAuthed().username;
        }
    }

    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', handlers.wellcomeController);

        this.get('#/me', handlers.meController);

        this.get('#/home', handlers.homeController);
        this.post('#/home', handlers.createChirpController);

        this.get('#/register',handlers.registerController);
        this.post('#/register', handlers.registerActionController);

        this.get('#/login', handlers.loginController);
        this.post('#/login', handlers.loginActionController);

        this.get('#/logout', handlers.logoutController);

        this.get('#/delete/:chirpId', handlers.deleteChirpController);

        this.get('#/discover', handlers.discoverController);
        this.get('#/discover/:userId', handlers.profileController);
    });
    app.run();
});