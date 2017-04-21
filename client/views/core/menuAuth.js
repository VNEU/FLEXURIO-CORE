/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Session} from "meteor/session";

Template.menuAuth.created = function () {
    Session.set('limit', 500);
    Session.set('textSearch', '');
    Session.set('namaHeader', 'AUTHENTICATION MENU');
    Session.set('dataDelete', '');
    Session.set('isCreating', false); Session.set('isEditing', false);
    Session.set('isDeleting', false);

    updateIdMenu();

    if (!adaDATA(Session.get('idMember'))) {
        Router.go("member");
    }

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
        return warnaMENU("idMenuDOWNLOAD", this._id);
    },
    PrintDiPilih: function () {
        return warnaMENU("idMenuPRINT", this._id);
    },
    ConfirmDiPilih: function () {
        return warnaMENU("idMenuCONFIRM", this._id);
    },
    AddDiPilih: function () {
        return warnaMENU("idMenuADD", this._id);
    },
    EditDiPilih: function () {
        return warnaMENU("idMenuEDIT", this._id);
    },
    DeleteDiPilih: function () {
        return warnaMENU("idMenuDELETE", this._id);
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
    isDeleting: function () {
        return Session.get('isDeleting');
    },
    isCreating: function () {
        return Session.get('isCreating');
    },
    menuAuths: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        let oFILTERS = {
            $or: [
                {namaMENU: {$regex: textSearch, $options: 'i'}},
                {groupMENU: {$regex: textSearch, $options: 'i'}},
                {authTipe: {$regex: textSearch, $options: 'i'}},
            ],
            userId: Session.get('idMember')
        };

        let oOPTIONS = {
            sort: {
                groupMENU: -1,
                namaMENU: -1
            },
            limit: Session.get('limit')
        };

        Session.set('oOPTIONS', oOPTIONS);
        Session.set('oFILTERS', oFILTERS);

        return MENUAUTH.find(
            oFILTERS,
            oOPTIONS
        );
    }
});

Template.menuAuth.events({
    'keyup #searchBox': function (e, tpl) {
        e.preventDefault();
        let textSearch = tpl.$('input[name="searchBox"]').val();
        Session.set('textSearch', textSearch);
    },
    'click a.allAuth': function (e, tpl) {
        e.preventDefault();
        centangMENU(e, "idMenuADD", true);
        centangMENU(e, "idMenuEDIT", true);
        centangMENU(e, "idMenuDELETE", true);
        centangMENU(e, "idMenuDOWNLOAD", true);
        centangMENU(e, "idMenuPRINT", true);
        centangMENU(e, "idMenuCONFIRM", true);
    },
    'click a.downloadAuth': function (e, tpl) {
        e.preventDefault();
        centangMENU(e, "idMenuDOWNLOAD", false);
    },
    'click a.printAuth': function (e, tpl) {
        e.preventDefault();
        centangMENU(e, "idMenuPRINT", false);
    },
    'click a.confirmAuth': function (e, tpl) {
        e.preventDefault();
        centangMENU(e, "idMenuCONFIRM", false);
    },
    'click a.addAuth': function (e, tpl) {
        e.preventDefault();
        centangMENU(e, "idMenuADD", false);
    },
    'click a.editAuth': function (e, tpl) {
        e.preventDefault();
        centangMENU(e, "idMenuEDIT", false);
    },
    'click a.deleteAuth': function (e, tpl) {
        e.preventDefault();
        centangMENU(e, "idMenuDELETE", false);
    },

    'click a.back': function (e, tpl) {
        e.preventDefault();
        Router.go("member");
    },

    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false); Session.set('isEditing', false);
        Session.set('isDeleting', false);
        Session.set("idMenu", []);
    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        MENUAUTH.remove(Session.get('idDeleting'));
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('isDeleting', true);
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaMENU);
        Session.set('idDeleting', this._id);
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        updateIdMenu();
        Session.set('isCreating', true);
        Session.set('idUser', this._id);
    },
    'keyup #namaMENUAUTH': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertMENUAUTH(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertMENUAUTH(tpl, "ADD");
        insertMENUAUTH(tpl, "EDIT");
        insertMENUAUTH(tpl, "DELETE");
        insertMENUAUTH(tpl, "PRINT");
        insertMENUAUTH(tpl, "CONFIRM");
        insertMENUAUTH(tpl, "DOWNLOAD");
        Session.set('isCreating', false);
        updateIdMenu();
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        updateIdMenu();
        Session.set('isCreating', true);
    }
});

warnaMENU = function (sSession, id) {
    let idMenu = Session.get(sSession);
    if (idMenu.indexOf(id) > -1) {
        return "green";
    } else {
        return "gray";
    }
};
centangMENU = function (e, sSession, isALL) {
    let idPilih = e.currentTarget.name;
    let idMenu = Session.get(sSession);
    if (idMenu.indexOf(idPilih) > -1) {
        if (!isALL) {
            idMenu.splice(idMenu.indexOf(idPilih), 1);
        }
    } else {
        idMenu.push(idPilih);
    }
    Session.set(sSession, idMenu);
};

insertMENUAUTH = function (tpl, authTIPE) {
    let arrayList = Session.get("idMenu" + authTIPE);

    MENUAUTH.find({userId: Session.get('idMember'), authTipe: authTIPE}).forEach(function (obj) {
        MENUAUTH.remove({_id: obj._id});
    });

    for (let i = 0; i < arrayList.length; i++) {
        let menuArray = MENU.findOne({_id: arrayList[i]});
        let namaMENU = "";
        let groupMENU = "";
        let routerMENU = "";
        if (adaDATA(menuArray)) {
            namaMENU = menuArray.namaMENU;
            groupMENU = menuArray.groupMENU;
            routerMENU = menuArray.routerMENU;
        } else {
            return;
        }

        MENUAUTH.insert(
            {
                userId: Session.get('idMember'),
                idMENU: arrayList[i],
                namaMENU: namaMENU,
                groupMENU: groupMENU,
                routerMENU: routerMENU,
                authTipe: authTIPE
            }
        );

        insertLogs("AUTH MEMBER", UserName() + " update AUTH " + authTIPE + " to " + Session.get("namaMember").toUpperCase() + " MENU : " + namaMENU + "");

    }
};

updateIdMenu = function () {
    let menuADD = [];
    let menuEDIT = [];
    let menuDELETE = [];
    let menuPRINT = [];
    let menuCONFIRM = [];
    let menuDOWNLOAD = [];

    let DataAkses = MENUAUTH.find({userId: Session.get('idMember')});

    DataAkses.forEach(function (obj) {
        if (obj.authTipe == "ADD") {
            menuADD.push(obj.idMENU);
        }
        if (obj.authTipe == "EDIT") {
            menuEDIT.push(obj.idMENU);
        }
        if (obj.authTipe == "DELETE") {
            menuDELETE.push(obj.idMENU);
        }
        if (obj.authTipe == "PRINT") {
            menuPRINT.push(obj.idMENU);
        }
        if (obj.authTipe == "CONFIRM") {
            menuCONFIRM.push(obj.idMENU);
        }
        if (obj.authTipe == "DOWNLOAD") {
            menuDOWNLOAD.push(obj.idMENU);
        }
    });

    Session.set("idMenuADD", menuADD);
    Session.set("idMenuEDIT", menuEDIT);
    Session.set("idMenuDELETE", menuDELETE);
    Session.set("idMenuDOWNLOAD", menuDOWNLOAD);
    Session.set("idMenuPRINT", menuPRINT);
    Session.set("idMenuCONFIRM", menuCONFIRM);
};
