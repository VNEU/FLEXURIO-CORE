DATATOKEN = new Mongo.Collection('dataToken');
Meteor.startup(function () {
    if (MENU.find().count() === 0) {
        [
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
                "iconMENU": "glyphicon glyphicon-stats",
                aktifYN : 1
            }
        ].forEach(function (dataMenu) {
            MENU.insert(dataMenu);
        });
    }

    if (MENUGROUP.find().count() === 0) {
        [
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
            password: "wicdt21",
            email: 'admin@flexurio.co.id',
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

    let idAdmin = MEMBER.findOne({'emails.address': 'admin@flexurio.co.id'})._id;
    Roles.addUsersToRoles(idAdmin, ['root', 'administrator'], Roles.GLOBAL_GROUP);

    Roles.getUsersInRole(['root', 'administrator']).map(function (user, index, originalCursor) {
        console.log("Check Auth Admin . . . ");

        MENUAUTH.find({userId: user._id}).forEach(function (obj) {
            MENUAUTH.remove({_id: obj._id});
        });
        console.log("Insert Auth Admin . . . ");
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
