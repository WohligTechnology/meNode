/**
 * JobController
 *
 * @description :: Server-side logic for managing jobs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    job();
                } else {
                    res.json({
                        value: false,
                        comment: "Job-id is incorrect"
                    });
                }
            } else {
                job();
            }

            function job() {
                var print = function (data) {
                    res.json(data);
                }
                Job.save(req.body, print);
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
                Job.delete(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Job-id is incorrect"
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
        if (req.body) {
            var print = function (data) {
                res.json(data);
            }
            Job.find(req.body, print);
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
                Job.findone(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Job-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findlimited: function (req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                function callback(data) {
                    res.json(data);
                };
                Job.findlimited(req.body, callback);
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
    findDrop: function (req, res) {
        if (req.body) {
            if (req.body.job && Array.isArray(req.body.job)) {
                var print = function (data) {
                    res.json(data);
                }
                Job.findDrop(req.body, print);
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
    findCityDrop: function (req, res) {
        if (req.body) {
            var print = function (data) {
                res.json(data);
            }
            Job.findCityDrop(req.body, print);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findTypeDrop: function (req, res) {
        if (req.body) {
            var print = function (data) {
                res.json(data);
            }
            Job.findTypeDrop(req.body, print);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findAllJobs: function (req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                function callback(data) {
                    res.json(data);
                };
                Job.findAllJobs(req.body, callback);
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
    }
};
