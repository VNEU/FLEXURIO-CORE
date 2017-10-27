/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Session} from "meteor/session";

Template.menuAuth.created = function () {
    if (!adaDATA(Session.get('idMember'))) {
        Router.go("member");
    }

    Session.set('limit', 500);
    Session.set('textSearch', '');
    Session.set('namaHeader', 'AUTH USER : ' + Session.get('namaMember').toUpperCase());
    subscribtion('memberku', {}, {}, 0);
    subscribtion('menu', {}, {}, 0);
    subscribtion('menuAuthku', {}, {}, 0);
    subscribtion('menuGroup', {}, {}, 0);


    this.autorun(function () {
        subscribtion('menuAuth', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.member.onRendered(function () {
    ScrollHandler();
});


Template.menuAuth.helpers({
    isLockMenu: function () {
        return isLockMenu();
    },

    sTinggiPopUp: function () {
        return 0.6 * ($(window).height());
    },
    sGeneralFont: function () {
        return sGeneralFont;
    },
    DownloadDiPilih: function () {
        return warnaMENU("DOWNLOAD", this._id);
    },
    PrintDiPilih: function () {
        return warnaMENU("PRINT", this._id);
    },
    ConfirmDiPilih: function () {
        return warnaMENU("CONFIRM", this._id);
    },
    AddDiPilih: function () {
        return warnaMENU("ADD", this._id);
    },
    EditDiPilih: function () {
        return warnaMENU("EDIT", this._id);
    },
    DeleteDiPilih: function () {
        return warnaMENU("DELETE", this._id);
    },

    sideMenuGroup: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        let dataMenu = MENU.find({namaMENU: {$regex: textSearch, $options: 'i'}});
        let idGroupMenu = dataMenu.map(function (p) {
            return p.groupMENU
        });

        return MENUGROUP.find({namaMENUGROUP: {$in: idGroupMenu}}, {sort: {locationsMENUGROUP: 1}});
    },
    sideMenu: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }
        return MENU.find(
            {
                groupMENU: this.namaMENUGROUP,
                namaMENU: {$regex: textSearch, $options: 'i'}
            }
        );
    },
    isCreating: function () {
        return Session.get('isCreating');
    },
});

Template.menuAuth.events({
    'keyup #searchBox': function (e, tpl) {
        e.preventDefault();
        let textSearch = tpl.$('input[name="searchBox"]').val();
        Session.set('textSearch', textSearch);
    },
    'click a.allAuth': function (e, tpl) {
        e.preventDefault();
        insertMENUAUTH("ADD", this._id);
        insertMENUAUTH("EDIT", this._id);
        insertMENUAUTH("DELETE", this._id);
        insertMENUAUTH("DOWNLOAD", this._id);
        insertMENUAUTH("PRINT", this._id);
        insertMENUAUTH("CONFIRM", this._id);
    },
    'click a.downloadAuth': function (e, tpl) {
        e.preventDefault();
        insertMENUAUTH("DOWNLOAD", this._id);
    },
    'click a.printAuth': function (e, tpl) {
        e.preventDefault();
        insertMENUAUTH("PRINT", this._id);
    },
    'click a.confirmAuth': function (e, tpl) {
        e.preventDefault();
        insertMENUAUTH("CONFIRM", this._id);
    },
    'click a.addAuth': function (e, tpl) {
        e.preventDefault();
        insertMENUAUTH("ADD", this._id);
    },
    'click a.editAuth': function (e, tpl) {
        e.preventDefault();
        insertMENUAUTH("EDIT", this._id);
    },
    'click a.deleteAuth': function (e, tpl) {
        e.preventDefault();
        insertMENUAUTH("DELETE", this._id);
    },

});

warnaMENU = function (authTipe, idMenu) {
    var dataAUTH = MENUAUTH.find({userId: Session.get('idMember'), idMENU: idMenu, authTipe: authTipe}).fetch();
    if (adaDATA(dataAUTH)) {
        return "green";
    } else {
        return "gray";
    }
};

insertMENUAUTH = function (authTipe, idMenu) {
    var menuArray = MENU.findOne({_id: idMenu});
    var dataAUTH = MENUAUTH.find({userId: Session.get('idMember'), idMENU: idMenu, authTipe: authTipe});
    if (adaDATA(dataAUTH.fetch())) {
        dataAUTH.forEach(function (obj) {
            MENUAUTH.remove({_id: obj._id});
        });
        insertLogs("AUTH MEMBER", UserName() + " REMOVE Authentication type `" + authTipe + "` to " + Session.get("namaMember").toUpperCase() + " MENU : " + menuArray.namaMENU + "");
    } else {
        MENUAUTH.insert(
            {
                userId: Session.get('idMember'),
                idMENU: idMenu,
                namaMENU: menuArray.namaMENU,
                groupMENU: menuArray.groupMENU,
                routerMENU: menuArray.routerMENU,
                authTipe: authTipe
            }
        );
        insertLogs("AUTH MEMBER", UserName() + " ALLOW Authentication type `" + authTipe + "` to " + Session.get("namaMember").toUpperCase() + " MENU : " + menuArray.namaMENU + "");
    }

};