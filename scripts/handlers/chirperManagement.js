handlers.createChirpController = function (ctx) {
    //author, text
    util.getUsername(ctx);
    let text = ctx.params.text;

    if (text.length === 0 || text.length > 150) {
        notifier.showError('Error: A chirp text should be between 1 and 150 symbols.');
        return;
    }

    let chirpData = {
        author: ctx.username,
        text: text
    }

    chirperService.createChirp(chirpData)
        .then(() => {
            notifier.showInfo('Chirp published.');
            ctx.redirect('#/me')
        }).catch(notifier.handleError)
}

handlers.deleteChirpController = function (ctx) {
    let chirpId = ctx.params.chirpId.substring(1);

    chirperService.deleteChirp(chirpId)
        .then(() => {
            notifier.showInfo('Chirp deleted.');
            ctx.redirect('#/me')
        })
}

handlers.discoverController = function (ctx) {
    util.getUsername(this);

    let content = util.getPartials('discover/discover');
    content.user = './templates/discover/user.hbs';

    chirperService.getAllUsers()
        .then(users => {
            users.forEach(u =>
                chirperService.countFollowers(u.username)
                    .then(followers => {
                        ctx.followersCount = followers.length;
                    }))
            ctx.users = users.filter(u => u.username !== ctx.username);
            console.log(ctx.users);
            this.loadPartials(content)
                .then(function () {
                    this.partial('./templates/common/main.hbs')
                })
        }).catch(notifier.handleError);
};

handlers.profileController = function (ctx) {
    util.getUsername(ctx);
    let userId = ctx.params.userId.substring(1);

    let content = util.getPartials('profile');
    content.chirp = './templates/home/chirp.hbs';

    chirperService.getUserById(userId).then(user => {
        ctx.user = user;
        Promise.all([chirperService.getChirpsByUsername(user.username),
            chirperService.countChirps(user.username),
            chirperService.countFollowers(user.username),
            chirperService.countFollowing(user.username)
        ]).then(([chirps, chirpsCount, followers, following]) => {
            let followingCount;
            if (!following.subscriptions) {
                followingCount = 0;
            } else {
                followingCount = following.subscriptions.length;
            }

            chirps.forEach(c => {
                c.time = calcTime(c._kmd.ect)
            });
            ctx.chirps = chirps;
            ctx.chirpsCount = chirpsCount.length;
            ctx.followers = followers.length;
            ctx.following = followingCount;
            ctx.loadPartials(content).then(function () {
                this.partial('./templates/common/main.hbs')
                    .then(attachEvent(ctx))
            })
        })
    }).catch(notifier.handleError)
};


function attachEvent(ctx) {
    let followButton = $("btnFollow");
    let subs = auth.isAuthed().subscriptions !== 'undefined'  ?  JSON.parse(auth.isAuthed().subscriptions) : [];

    followButton.click((ev) => {
        let userId = ctx.params.userId;
        if (followButton.text() == 'Follow') {
            followButton.text('Unfollow');
            chirperService.getUserById(userId)
                .then(user =>{
                    "use strict";
                    subs.push(user.username)
                })

            chirperService.updateUser(subs);

        } else {
            followButton.text('Follow')
        }
        return false;
    })
}

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

