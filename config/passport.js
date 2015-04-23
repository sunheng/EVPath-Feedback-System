var LocalStrategy = require('passport-local').Strategy;
/* TODO: Hash passwords */

var userSet = '';
function getUserKey(username) {
    return 'user:' + username;
}

function transformToUserObj(redisReply) {
    return {
        username: redisReply[0],
        password: redisReply[1]
    };
}

// expose this function to our app using module.exports
module.exports = function(passport, redisClient) {
    // used to serialize the user for the session
    passport.serializeUser(function(userKey, done) {
        done(null, userKey);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        redisClient.hmget(id, ['username', 'password'], function(err, reply) {
            var userObj = transformToUserObj(reply);
            done(null, userObj);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        
        var userKey = getUserKey(username);
        redisClient.hmget(userKey, ['username', 'password'], function(err, reply) {
            if (err) {
                return done(err);
            }
            if (username === reply[0] && password === reply[1]) {
                return done(null, userKey);

            } else {
                return done(null, false, req.flash('loginMessage', 'Invalid Credentials.')); // req.flash is the way to set flashdata using connect-flash
            }
            return done(err);

        });

    }));

    passport.use('local-register', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        process.nextTick(function() {
            
            var userKey = getUserKey(username);
            redisClient.hmget(userKey, ['username', 'password'], function(err, reply) {
                if (err) {
                    return done(err);
                }
                if (reply[0] === null) {
                    redisClient.hmset(userKey, 'username', username, 'password', password);
                    return done(null, userKey);
                }
                return done(null, false, req.flash('registerMessage', 'That account has already been taken.'));
            });
        });

    }));
};