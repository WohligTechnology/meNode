/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var frontend = "http://www.auraart.in/";
var passport = require('passport'),
    LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    done(null, id);
});
module.exports = {
    //////////////////////////////
    // LOGIN FUNCTIONS
    loginl: function (req, res) {
        if (req.param("url") && req.param("url") != "") {
            frontend = req.param("url");
        }
        passport.use(new LinkedInStrategy({
                clientID: "75mqwky1q6n3a5",
                clientSecret: "TXVyTU58egM744Gt",
                callbackURL: sails.myurl + "user/callbackl",
                scope: ['r_emailaddress', 'r_basicprofile'],
                state: true
            },
            function (token, tokenSecret, profile, done) {
                profile.token = token;
                profile.provider = "Linkedin";
                User.findorcreate(profile, done);
            }
        ));

        var loginid = req.param("loginid");
        req.session.loginid = loginid;
        passport.authenticate('linkedin')(req, res);
    },
    loginf: function (req, res) {
        if (req.param("url") && req.param("url") != "") {
            frontend = req.param("url");
        }
        passport.use(new FacebookStrategy({
                clientID: "216773165343608",
                clientSecret: "4655e35b15a37d9dd6b9c561c4375464",
                callbackURL: sails.myurl + "user/callbackf"
            },
            function (accessToken, refreshToken, profile, done) {
                profile.accessToken = accessToken;
                profile.refreshToken = refreshToken;
                profile.provider = "Facebook";
                User.findorcreate(profile, done);
            }
        ));

        var loginid = req.param("loginid");
        req.session.loginid = loginid;
        passport.authenticate('facebook', {
            scope: 'email,public_profile,publish_actions'
        })(req, res);
    },
    loging: function (req, res) {
        if (req.param("url") && req.param("url") != "") {
            frontend = req.param("url");
        }
        passport.use(new GoogleStrategy({
                clientID: "92811256779-tf61c8it7m20bn00kef02aanp03rn00h.apps.googleusercontent.com",
                clientSecret: "fTrLtxpAIDGluWJBcRp8bNh9",
                callbackURL: "callbackg"
            },
            function (token, tokenSecret, profile, done) {
                profile.token = token;
                profile.provider = "Google";
                User.findorcreate(profile, done);
            }
        ));

        var loginid = req.param("loginid");
        req.session.loginid = loginid;
        passport.authenticate('google', {
            scope: "openid profile email"
        })(req, res);
    },
    callbackl: passport.authenticate('linkedin', {
        successRedirect: '/user/success',
        failureRedirect: '/user/fail'
    }),
    callbackg: passport.authenticate('google', {
        successRedirect: '/user/success',
        failureRedirect: '/user/fail'
    }),
    callbackf: passport.authenticate('facebook', {
        successRedirect: '/user/success',
        failureRedirect: '/user/fail'
    }),
    success: function (req, res, data) {
        res.view("success");
    },
    fail: function (req, res) {
        sails.sockets.blast("login", {
            loginid: req.session.loginid,
            status: "fail"
        });
        res.view("fail");
    },
    profile: function (req, res) {
        if (req.session.passport) {
            res.json(req.session.passport.user);
        } else {
            res.json({});
        }
    },
    logout: function (req, res) {
        req.session.destroy(function (err) {
            res.send(req.session);
        });
    },
    findorcreate: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.findorcreate(req.body, print);
    },
    save: function (req, res) {
        if (req.body) {
            if (req.body.email && req.body.email != "" && req.body.password && req.body.password != "") {
                var print = function (data) {
                    if (data.value != false) {
                        req.session.passport = {
                            user: data
                        };
                        res.json({
                            value: true
                        });
                    } else {
                        res.json(data);
                    }
                }
                User.save(req.body, print);
            } else {
                callback({
                    value: false,
                    comment: "Please provide parmeters"
                });
                db.close();
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    edit: function (req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                user();
            } else {
                res.json({
                    value: false,
                    comment: "User-id is incorrect"
                });
            }

            function user() {
                var print = function (data) {
                    res.json(data);
                }
                User.edit(req.body, print);
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    delete: function (req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function (data) {
                    res.json(data);
                }
                User.delete(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        User.find(req.body, callback);
    },
    findlimited: function (req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                function callback(data) {
                    res.json(data);
                };
                User.findlimited(req.body, callback);
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    changepassword: function (req, res) {
        if (req.body) {
            if (req.session.passport) {
                req.body._id = req.session.passport.user.id;
                var print = function (data) {
                    res.json(data);
                }
                User.changepassword(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    forgotpassword: function (req, res) {
        if (req.body) {
            if (req.body.email && req.body.email != "") {
                var print = function (data) {
                    res.json(data);
                }
                User.forgotpassword(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findone: function (req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function (data) {
                    res.json(data);
                }
                User.findone(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findAll: function (req, res) {
        if (req.body) {
            function callback(data) {
                res.json(data);
            };
            User.findAll(req.body, callback);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    addJob: function (req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id) && req.body.job && req.body.job != "" && sails.ObjectID.isValid(req.body.job)) {
                var print = function (data) {
                    res.json(data);
                }
                User.addJob(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findProfile: function (req, res) {
        if (req.body) {
            if (req.session.passport) {
                req.body._id = req.session.passport.user.id;
                var print = function (data) {
                    res.json(data);
                }
                User.findProfile(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "User not logged-in"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    login: function (req, res) {
        if (req.body) {
            if (req.body.email && req.body.email != "" && req.body.password && req.body.password != "") {
                var print = function (data) {
                    if (data.value != false) {
                        req.session.passport = {
                            user: data
                        };
                        res.json({
                            value: true
                        });
                    } else {
                        res.json(data);
                    }
                }
                User.login(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    adminlogin: function (req, res) {
        if (req.body) {
            if (req.body.email && req.body.email != "" && req.body.password && req.body.password != "") {
                var print = function (data) {
                    res.json(data);
                }
                User.adminlogin(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    getCompanyProfile: function (req, res) {
        if (req.body) {
            if (req.session.passport) {
                req.body._id = req.session.passport.user.id;
                var print = function (data) {
                    res.json(data);
                }
                User.getCompanyProfile(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "User not logged-in"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findDrop: function (req, res) {
        if (req.body) {
            if (req.body.user && Array.isArray(req.body.user)) {
                var print = function (data) {
                    res.json(data);
                }
                User.findDrop(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
};
