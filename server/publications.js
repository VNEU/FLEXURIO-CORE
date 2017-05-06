/**
* Flexruio Created by YN. Pamungkas Jayuda.
*/

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

        return MESSAGEMEMBER.find({idMessage: {$in: idMessage}, aktifYN: 1}, oOPTIONS);
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

        return MESSAGE.find({_id: {$in: idMessage}, aktifYN: 1}, oOPTIONS);
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
publishData("memberku", Meteor.users, {}, {});
publishData("menuAuthku", MENUAUTH, {}, {});
publishData("member", Meteor.users, {}, {profile:1});
publishData('menu', MENU, {}, {});
publishData('menuGroup', MENUGROUP, {}, {});
publishData('menuAuth', MENUAUTH, {}, {});
publishData('todo', TODO, {}, {});
publishData('activitylogs', ACTIVITYLOGS, {}, {});
publishData('profileData', PROFILEDATA, {}, {});
publishData('negara', NEGARA, {}, {});
publishData('provinsi', PROVINSI, {}, {});
publishData('kabupaten', KABUPATEN, {}, {});
publishData('kecamatan', KECAMATAN, {}, {});
publishData('kelurahan', KELURAHAN, {}, {});
publishData('woTipe', WOTIPE, {}, {});
publishData('woSubTipe', WOSUBTIPE, {}, {});
publishData('woSubTipeDetail', WOSUBTIPEDETAIL, {}, {});
publishData('wo', WO, {}, {});
publishData('apimanager', APIMANAGER, {}, {});
publishData('calendar', CALENDARS, {}, {});
