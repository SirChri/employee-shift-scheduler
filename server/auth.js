var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
const { models } = require('./sequelize');

passport.use(new LocalStrategy(function verify(username, password, cb) {
    models.user.findOne({ where: { name: username } }).then((user) => {

        if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return cb(err); }

            let match = crypto.timingSafeEqual(Buffer.from(user.password, "hex"), hashedPassword);

            if (!match) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, user);
        });
    });
}));


passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.name });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

var router = express.Router();

router.post('/session', passport.authenticate('local', {}),
    function (req, res) {
        if (req.user)
            res.status(200).json(req.session.passport)
        else
            res.status(401)
    });

router.delete('/session', function (req, res) {
    if (!req.user)
        return res.status(500).json({
            message: "no session"
        });

    req.logout(function (err) {
        if (err) {
            return res.status(500).json({
                message: err
            });
        }

        res.status(200).json({
            success: true
        });
    });
});

router.get('/session', function (req, res) {
    if (req.user)
        return res.status(200).json(req.user);
    else
        return res.status(500).json({
            message: "no session"
        });
});

module.exports = router;