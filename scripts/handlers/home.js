handlers.homeController = function (ctx) {
    util.getUsername(ctx);
    let subs = auth.isAuthed().subscriptions !== 'undefined'  ?  JSON.parse(auth.isAuthed().subscriptions) : [];

    Promise.all([chirperService.getAllChirps(subs),
        chirperService.countChirps(ctx.username),
        chirperService.countFollowers(ctx.username),
        chirperService.countFollowing(ctx.username),
    ]).then(([chirps, chirpsCount, followers, following]) => {
        let followingCount
        if(!following.subscriptions){
            followingCount = 0;
        }else{
            followingCount = following.subscriptions.length;
        }

        chirps.forEach(c => {
            c.time = calcTime(c._kmd.ect);
            chirperService.getUserByUsername(c.author)
                .then(users =>{
                    c.authorId = users[0]._acl.creator;
                    console.log(c.authorId);
                })
        });
        ctx.chirps = chirps;
        console.log(chirps);
        ctx.chirpsCount = chirpsCount.length;
        ctx.followers = followers.length;
        ctx.following = followingCount;
        let content = util.getPartials('home/home');
        content.chirp = './templates/home/chirp.hbs'
        ctx.loadPartials(content).then(function () {
            this.partial('./templates/common/main.hbs');
        })

    }).catch(notifier.handleError)
};

handlers.meController = function (ctx) {
    util.getUsername(ctx);

    Promise.all([chirperService.getChirpsByUsername(ctx.username),
        chirperService.countChirps(ctx.username),
        chirperService.countFollowers(ctx.username),
        chirperService.countFollowing(ctx.username),
    ]).then(([chirps, chirpsCount, followers, following]) => {
        let followingCount
        if(!following.subscriptions){
            followingCount = 0;
        }else{
            followingCount = following.subscriptions.length;
        }

        chirps.forEach(c => {
            c.time = calcTime(c._kmd.ect),
            c.isAuthor = true
        });
        ctx.chirps = chirps;
        ctx.chirpsCount = chirpsCount.length;
        ctx.followers = followers.length;
        ctx.following = followingCount;
        let content = util.getPartials('home/home');
        content.chirp = './templates/home/chirp.hbs'
        ctx.loadPartials(content).then(function () {
            this.partial('./templates/common/main.hbs');
        })

    }).catch(notifier.handleError)
};

handlers.wellcomeController = function (ctx) {
    util.getUsername(this);
    let content = util.getPartials('home/welcome');
    content.login = './templates/login/login.hbs';
    ctx.loadPartials(content).then(function () {
        this.partial('./templates/common/main.hbs');
    })

};

function calcTime(dateIsoFormat) {
    let diff = new Date - (new Date(dateIsoFormat));
    diff = Math.floor(diff / 60000);
    if (diff < 1) return 'less than a minute';
    if (diff < 60) return diff + ' minute' + pluralize(diff);
    diff = Math.floor(diff / 60);
    if (diff < 24) return diff + ' hour' + pluralize(diff);
    diff = Math.floor(diff / 24);
    if (diff < 30) return diff + ' day' + pluralize(diff);
    diff = Math.floor(diff / 30);
    if (diff < 12) return diff + ' month' + pluralize(diff);
    diff = Math.floor(diff / 12);
    return diff + ' year' + pluralize(diff);
    function pluralize(value) {
        if (value !== 1) return 's';
        else return '';
    }
}

