/**
* Flexruio Created by YN. Pamungkas Jayuda.
*/

Meteor.publish('member', function (iLimit, oFilter, oOptions) {
    if (this.userId) {
        let oOPTIONS = Object.assign({}, {fields: {profile: 1, username:1}}, oOptions);
        oOPTIONS.limit = iLimit * 2;
        if (iLimit == 0) {
            delete oOPTIONS.limit;
        }
        if (Roles.userIsInRole(this.userId, ['root', 'administrator'])) {
            return Meteor.users.find({aktifYN: 1});
        } else {
            return Meteor.users.find(oFilter, oOPTIONS);
        }
    } else {
        this.ready();
    }
});


Meteor.publish('menuGroup', function () {
    if (this.userId) {
        let menuAuth = MENUAUTH.find({userId: this.userId});
        let groupMENU = menuAuth.map(function (p) {
            return p.groupMENU
        });
        let oFILTERS = {aktifYN: 1, namaMENUGROUP: {$in: groupMENU}};

        if (Roles.userIsInRole(this.userId, ['root', 'administrator'])) {
            return  MENUGROUP.find({aktifYN: 1});
        } else {
            return MENUGROUP.find(oFILTERS);
        }
    } else {
        this.ready();
    }
});



Meteor.publish('messageMember', function (iLimit) {
    if (this.userId) {
        let thisusername = MEMBER.findOne({_id:this.userId}).username;
        let dataMESSAGE = MESSAGEMEMBER.find({username:thisusername, aktifYN:1});
        let idMessage = dataMESSAGE.map(function (p) {
            return p.idMessage
        });
        let oOPTIONS = {
            sort: {createAt: -1},
            limit: iLimit
        };

        if (Roles.userIsInRole(this.userId, ['root', 'administrator'])) {
            return MESSAGEMEMBER.find({aktifYN: 1}, oOPTIONS);
        } else {
            return MESSAGEMEMBER.find({idMessage: {$in: idMessage}, aktifYN: 1}, oOPTIONS);
        }

    } else {
        this.ready();
    }
});


Meteor.publish('message', function (iLimit) {
    if (this.userId) {
        let thisusername = MEMBER.findOne({_id:this.userId}).username;

        let dataMESSAGE = MESSAGEMEMBER.find({username:thisusername, aktifYN: 1});
        let idMessage = dataMESSAGE.map(function (p) {
            return p.idMessage
        });
        let oOPTIONS = {
            sort: {createAt: -1},
            limit: iLimit
        };

        if (Roles.userIsInRole(this.userId, ['root', 'administrator'])) {
            return MESSAGE.find({aktifYN: 1}, oOPTIONS);
        } else {
            return MESSAGE.find({_id: {$in: idMessage}, aktifYN: 1}, oOPTIONS);
        }
    } else {
        this.ready();
    }
});


Meteor.publish('menu', function () {
    if (this.userId) {
        let menuAuth = MENUAUTH.find({userId: this.userId});
        let idMenu = menuAuth.map(function (p) {
            return p.idMENU
        });
        if (Roles.userIsInRole(this.userId, ['root', 'administrator'])) {
            return MENU.find({aktifYN: 1});
        } else {
            return MENU.find({_id: {$in: idMenu}, aktifYN: 1});
        }
    } else {
        this.ready();
    }
});

publishData = function (sNama, sObject, oWhere, oConditions) {
    Meteor.publish(sNama, function (iLimit, oFilter, oOptions) {
        // gabungkan OR
        let atauALL = [{aktifYN: 1}, {aktifYN: "1"}, {aktifYN: 1}];
        if (adaDATA(oWhere["$or"])) {
            atauALL = atauALL.concat(oWhere["$or"]);
        }
        let oFILTER_OR = oFilter["$or"];
        if (adaDATA(oFILTER_OR)) {
            atauALL = atauALL.concat(oFilter["$or"]);
        }

        // gabungkan AND
        let andALL = [];
        if (adaDATA(oWhere["$and"])) {
            andALL = andALL.concat(oWhere["$and"]);
        }
        if (adaDATA(oFilter["$and"])) {
            andALL = andALL.concat(oFilter["$and"]);
        }

        // gabungkan oWhere dan oFilter
        oWhere = Object.assign({}, oWhere, oFilter);
        oWhere["$or"] = atauALL;
        oWhere["$and"] = andALL;

        // gabungkan oConditions
        oConditions = Object.assign({}, oConditions, oOptions);

        if (!adaDATA(oConditions)) {
            oConditions = {
                sort: {createAt: -1},
                limit: iLimit
            };
        }
        oConditions.limit = iLimit * 2;

        if(iLimit == 0) {
        	delete oConditions.limit;
		}

        if (this.userId) {
            let data = sObject.find(oFilter, oConditions);
            return data;
        } else {
            this.ready();
        }
    });
};


/**    publishData(NAME_Publications, OBJECT_Collections, OBJECT_OFilter, OBJECT_oOPTIONS)      **/
publishData("menuAuthku", MENUAUTH, {}, {});
publishData('menuAuth', MENUAUTH, {}, {});
publishData('activitylogs', ACTIVITYLOGS, {}, {});
publishData('profileData', PROFILEDATA, {}, {});
publishData('woTipe', WOTIPE, {}, {});
publishData('woSubTipe', WOSUBTIPE, {}, {});
publishData('woSubTipeDetail', WOSUBTIPEDETAIL, {}, {});
publishData('wo', WO, {}, {});
publishData('apimanager', APIMANAGER, {}, {});
