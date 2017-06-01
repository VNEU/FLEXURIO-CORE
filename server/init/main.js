DATATOKEN = new Mongo.Collection('dataToken');
Meteor.startup(function () {
    console.log("Flexurio - start on server . . . ");

    if (MENU.find().count() === 0) {
        [
            {
                "_id": "YjcMkpQt8NxF9pddYcE",
                "namaMENU": "Dashboard",
                "routerMENU": "/",
                "groupMENU": "HOME",
                "iconMENU": "glyphicon glyphicon-th-large",
                "aktifYN": 1
            },
            {
                "_id": "YjcMkpQt8NxF9pYcE",
                "namaMENU": "Messages",
                "routerMENU": "message",
                "groupMENU": "HOME",
                "iconMENU": "glyphicon glyphicon-envelope",
                "aktifYN": 1
            },
            {
                "namaMENU": "Menu",
                "routerMENU": "menuGroup",
                "groupMENU": "SETTINGS",
                "iconMENU": "glyphicon glyphicon-th-list",
                aktifYN : 1
            },
            {
                "namaMENU": "Members",
                "routerMENU": "member",
                "groupMENU": "SETTINGS",
                "iconMENU": "glyphicon glyphicon-user",
                aktifYN : 1
            },
            {
                "_id": "kaQdHiHmbbJkrW749",
                "namaMENU": "Tipe WO",
                "routerMENU": "woTipe",
                "groupMENU": "WORK ORDER",
                "iconMENU": "glyphicon glyphicon-list",
                aktifYN : 1
            },
            {
                "_id": "kaQdHiHmbbJkrdW749",
                "namaMENU": "WO",
                "routerMENU": "wo",
                "groupMENU": "WORK ORDER",
                "iconMENU": "glyphicon glyphicon-list",
                aktifYN : 1
            }
        ].forEach(function (dataMenu) {
            MENU.insert(dataMenu);
        });
    }

    if (MENUGROUP.find().count() === 0) {
        [
            {
                "_id": "D8zEEzJxrZi8YFnhj",
                "namaMENUGROUP": "HOME",
                "iconMENUGROUP": "glyphicon glyphicon-home",
                "locationsMENUGROUP": "1. Top Locations",
                "aktifYN": 1
            },
            {
                "namaMENUGROUP": "SETTINGS",
                "iconMENUGROUP": "glyphicon glyphicon-wrench",
                "locationsMENUGROUP": "2. Middle Locations",
                aktifYN : 1
            },
            {
                "namaMENUGROUP": "WORK ORDER",
                "iconMENUGROUP": "glyphicon glyphicon-blackboard",
                "locationsMENUGROUP": "2. Middle Locations",
                aktifYN : 1
            }
        ].forEach(function (dataMenuGroup) {
            MENUGROUP.insert(dataMenuGroup);
        });
    }

    if (MEMBER.find().count() === 0) {
        var seedUserId = Accounts.createUser({
            password: "flx.indo",
            email: 'admin@flexurio.com',
            username: 'admin@flexurio.com',
            profile: {
                name: 'administrator'
            }
        });
    }

    if (DATATOKEN.find().count() === 0) {
        [
            {
                "sTokenKey": "QWjnk034K#JSND239NSD0&99mn_bKJort78s86fg0sd765fwjh4knsd*&jknerkwjf328",
                "aktifYN": true
            }
        ].forEach(function (dataToken) {
            DATATOKEN.insert(dataToken);
        });
    }

    var idAdmin = MEMBER.findOne({'emails.address': 'admin@flexurio.com'})._id;
    Roles.addUsersToRoles(idAdmin, ['root', 'administrator'], Roles.GLOBAL_GROUP);

    Roles.getUsersInRole(['root', 'administrator']).map(function (user, index, originalCursor) {
        console.log("Flexurio - Check Auth Admin . . . ");

        MENUAUTH.find({userId: user._id}).forEach(function (obj) {
            MENUAUTH.remove({_id: obj._id});
        });
        MENU.find({aktifYN: 1}).forEach(function (obj) {
            MENUAUTH.insert(
                {
                    userId: user._id,
                    idMENU: obj._id,
                    namaMENU: obj.namaMENU,
                    groupMENU: obj.groupMENU,
                    routerMENU: obj.routerMENU,
                    authTipe: "ADD",
                    aktifYN : 1
                }
            );

            MENUAUTH.insert(
                {
                    userId: user._id,
                    idMENU: obj._id,
                    namaMENU: obj.namaMENU,
                    groupMENU: obj.groupMENU,
                    routerMENU: obj.routerMENU,
                    authTipe: "EDIT",
                    aktifYN : 1
                }
            );

            MENUAUTH.insert(
                {
                    userId: user._id,
                    idMENU: obj._id,
                    namaMENU: obj.namaMENU,
                    groupMENU: obj.groupMENU,
                    routerMENU: obj.routerMENU,
                    authTipe: "DELETE",
                    aktifYN : 1
                }
            );

            MENUAUTH.insert(
                {
                    userId: user._id,
                    idMENU: obj._id,
                    namaMENU: obj.namaMENU,
                    groupMENU: obj.groupMENU,
                    routerMENU: obj.routerMENU,
                    authTipe: "CONFIRM",
                    aktifYN : 1
                }
            );

            MENUAUTH.insert(
                {
                    userId: user._id,
                    idMENU: obj._id,
                    namaMENU: obj.namaMENU,
                    groupMENU: obj.groupMENU,
                    routerMENU: obj.routerMENU,
                    authTipe: "PRINT",
                    aktifYN : 1
                }
            );

            MENUAUTH.insert(
                {
                    userId: user._id,
                    idMENU: obj._id,
                    namaMENU: obj.namaMENU,
                    groupMENU: obj.groupMENU,
                    routerMENU: obj.routerMENU,
                    authTipe: "DOWNLOAD",
                    aktifYN : 1
                }
            );


        });
    });
});
