let chirperService = (() => {

    function getAllChirps(subscriptions) {
        //chirps?query={"author":{"$in": [subs]}}&sort={"_kmd.ect": 1}
        return requester.get('appdata', `chirps`, 'kinvey');
    }

    function getChirpsByUsername(username) {
        return requester.get('appdata', `chirps?query={"author":"${username}"}&sort={"_kmd.ect": 1}`, 'kinvey');
    }

    function  countChirps(username) {
        return requester.get('appdata', `chirps?query={"author":"${username}"}`, 'kinvey');
    }
    
    function countFollowing (username) {
        //GET https://baas.kinvey.com/user/app_key/?query={"username":"username"}
        return requester.get('user', `?query={"username":"${username}"}`, 'kinvey');
    }
    
    function countFollowers (username) {
        return requester.get('user', `?query={"subscriptions":"${username}"}`, 'kinvey');
    }
    
    
    function createChirp(chirpData) {
        return requester.post('appdata', 'chirps', 'kinvey', chirpData);
    }

    function deleteChirp(chirpId) {
        return requester.del('appdata', `chirps/${chirpId}`, 'kinvey')
    }

    function getUserById(userId) {
        return requester.get('user', userId, 'kinvey');
    }

    function getUserByUsername(username) {
        return requester.get('user', `?query={"username":"${username}"}`, 'kinvey');
    }

    function getAllUsers() {
        return requester.get('user', '', 'kinvey');
    }

    function updateUser(userId, userSubs) {
        return requester.get('user', userId, 'kinvey', userSubs);
    }

    return {
        getAllChirps,
        getChirpsByUsername,
        countChirps,
        countFollowing,
        countFollowers,
        createChirp,
        getAllUsers,
        getUserById,
        getUserByUsername,
        deleteChirp,
        updateUser}
})()