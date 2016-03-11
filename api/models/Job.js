module.exports = {
    save: function (data, callback) {
        if (data.applied && data.applied.length > 0) {
            _.each(data.applied, function (change) {
                change._id = sails.ObjectID(change._id);
            });
        }
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection('job').insert(data, function (err, created) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                            db.close();
                        } else if (created) {
                            callback({
                                value: true,
                                id: data._id
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "Not created"
                            });
                            db.close();
                        }
                    });
                } else {
                    var job = sails.ObjectID(data._id);
                    delete data._id
                    db.collection('job').update({
                        _id: job
                    }, {
                        $set: data
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                            db.close();
                        } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                            callback({
                                value: true
                            });
                            db.close();
                        } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                            callback({
                                value: true,
                                comment: "Data already updated"
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
            }
        });
    },
    saveJob: function (data, callback) {
        if (data.applied && data.applied.length > 0) {
            _.each(data.applied, function (change) {
                change._id = sails.ObjectID(change._id);
            });
        }
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    var user = sails.ObjectID(data.user);
                    delete data.user;
                    db.collection('job').insert(data, function (err, created) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                            db.close();
                        } else if (created) {
                            User.findone({
                                _id: sails.ObjectID(user)
                            }, function (useRespo) {
                                if (useRespo.value != false) {
                                    if (useRespo.company) {
                                        if (useRespo.company.job && useRespo.company.job.length > 0) {
                                            useRespo.company.job.push({
                                                _id: data._id
                                            });
                                            callMe();
                                        } else {
                                            useRespo.company.job = [];
                                            useRespo.company.job.push({
                                                _id: data._id
                                            });
                                            callMe();
                                        }

                                        function callMe() {
                                            User.edit({
                                                _id: sails.ObjectID(useRespo._id),
                                                company: useRespo.company
                                            }, function (saveRespo) {
                                                if (saveRespo.value != false) {
                                                    useRespo.id = useRespo._id;
                                                    delete useRespo._id;
                                                    callback(useRespo);
                                                    db.close();
                                                } else {
                                                    callback({
                                                        value: false,
                                                        comment: "Error"
                                                    });
                                                    db.close();
                                                }
                                            });
                                        }
                                    } else {
                                        callback({
                                            value: false,
                                            comment: "Company not found"
                                        });
                                        db.close();
                                    }
                                } else {
                                    callback({
                                        value: false,
                                        comment: "User not found"
                                    });
                                    db.close();
                                }
                            });
                        } else {
                            callback({
                                value: false,
                                comment: "Not created"
                            });
                            db.close();
                        }
                    });
                }
            }
        });
    },
    findlimited: function (data, callback) {
        var newcallback = 0;
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {

                db.collection("job").count({
                    name: {
                        '$regex': check
                    }
                }, function (err, number) {
                    if (number) {
                        newreturns.total = number;
                        newreturns.totalpages = Math.ceil(number / data.pagesize);
                        callbackfunc1();
                    } else if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "Count of null"
                        });
                        db.close();
                    }
                });

                function callbackfunc1() {
                    db.collection("job").find({
                        name: {
                            '$regex': check
                        }
                    }, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
                        } else if (found && found[0]) {
                            newreturns.data = found;
                            callback(newreturns);
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
            }
        });
    },
    delete: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            var cjob = db.collection('job').remove({
                _id: sails.ObjectID(data._id)
            }, function (err, deleted) {
                if (deleted) {
                    callback({
                        value: true
                    });
                    db.close();
                } else if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                    db.close();
                } else {
                    callback({
                        value: false,
                        comment: "No data found"
                    });
                    db.close();
                }
            });
        });
    },
    findone: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("job").find({
                    "_id": sails.ObjectID(data._id)
                }, {}).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2[0]);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    find: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("job").find({}, {}).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2[0]);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findAllJobs: function (data, callback) {
        var newcallback = 0;
        var newreturns = {};
        newreturns.data = [];
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        var matchobj = {
            designation: data.designation,
            $or: [{
                city: data.loc
            }, {
                state: data.loc
            }]
        };
        if (data.loc == "") {
            delete matchobj["$or"];
        }
        if (data.designation == "") {
            delete matchobj.designation;
        }
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("job").count(matchobj, function (err, number) {
                    if (number) {
                        newreturns.total = number;
                        newreturns.totalpages = Math.ceil(number / data.pagesize);
                        callbackfunc1();
                    } else if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "Count of null"
                        });
                        db.close();
                    }
                });

                function callbackfunc1() {
                    db.collection("job").find(matchobj, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
                        } else if (found && found[0]) {
                            newreturns.data = found;
                            var compData = [];
                            var i = 0;
                            _.each(newreturns.data, function (respo) {
                                console.log(respo);
                                User.findCompanyProfile({ _id: respo._id }, function (compRespo) {
                                    if (compRespo.value != false) {
                                        compData.push(compRespo);
                                        i++;
                                        if (i == newreturns.data.length) {
                                            newreturns.data = compData;
                                            callback(newreturns);
                                            db.close();
                                        }
                                    } else {
                                        i++;
                                        if (i == newreturns.data.length) {
                                            newreturns.data = compData;
                                            callback(newreturns);
                                            db.close();
                                        }
                                    }
                                });
                            });
                        } else {
                            callback({
                                value: false,
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
            }
        });
    },
    findDrop: function (data, callback) {
        if (data.search && data.job) {
            var returns = [];
            var exit = 0;
            var exitup = 1;
            var check = new RegExp(data.search, "i");

            function callback2(exit, exitup, data) {
                if (exit == exitup) {
                    callback(data);
                }
            }
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });

                }
                if (db) {
                    db.collection("job").find({
                        designation: {
                            '$regex': check
                        },
                    }).limit(10).toArray(function (err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
                        } else if (found != null) {
                            exit++;
                            if (data.job.length != 0) {
                                var nedata;
                                nedata = _.remove(found, function (n) {
                                    var flag = false;
                                    _.each(data.job, function (n1) {
                                        if (n1.name == n.name) {
                                            flag = true;
                                        }
                                    })
                                    return flag;
                                });
                            }
                            returns = returns.concat(found);
                            callback2(exit, exitup, returns);
                        } else {
                            callback({
                                value: false,
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            callback({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findCityDrop: function (data, callback) {
        var check = "";
        if (data.search != "") {
            data.search = "^" + data.search;
            check = new RegExp(data.search, "i");
        } else {
            check = "";
        }
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("job").find({
                    $or: [{
                        city: {
                            '$regex': check
                        }
                    }, {
                        state: {
                            '$regex': check
                        }
                    }]
                }, {
                    _id: 1,
                    city: 1,
                    state: 1
                }).limit(10).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findTypeDrop: function (data, callback) {
        var check = "";
        if (data.search != "") {
            check = new RegExp(data.search, "i");
        } else {
            check = "";
        }
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("job").find({
                    designation: {
                        '$regex': check
                    }
                }, {
                    _id: 1,
                    designation: 1
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
};
