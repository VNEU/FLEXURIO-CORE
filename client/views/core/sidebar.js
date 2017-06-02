/**
 * Created by ThinkMac on 12/9/15.
 */

import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import './sidebar.html';


Template.sidebar.created = function () {
    Blaze._allowJavascriptUrls();

    var menuAuth = MENUAUTH.find({userId: UserID()});
    var idMenu = menuAuth.map(function (p) {
        return p.idMENU
    });

    var oFILTERMENU = {_id: {$in: idMenu}, groupMENU: this.namaMENUGROUP, aktifYN: 1};

    menuAuth = MENUAUTH.find({userId: UserID()});
    var groupMENU = menuAuth.map(function (p) {
        return p.groupMENU
    });

    var oFILTERS = {aktifYN: 1, namaMENUGROUP: {$in: groupMENU}};
    if (adaDATA(Session.get("menuDept"))) {
        oFILTERS.namaMENUGROUP = Session.get("menuDept");
    } else {
        oFILTERS.namaMENUGROUP = "";
    }

    subscribtion('menu', oFILTERMENU, {}, 0);
    subscribtion('menuGroup', oFILTERS, {sort: {locationsMENUGROUP: 1}}, 0);
};

Template.sidebar.onRendered(function () {
    ScrollHandler();
});

Template.sidebar.events({
    'click input.lockMenu': function (e, tpl) {
        MEMBER.update(UserID(), {$set: {'profile.lockMenu': e.target.checked}});
        Session.set("lockMenu", e.target.checked);
    }
});

Template.sidebar.helpers({
    animasiSide: function () {
        if (Session.get("lockMenu")) {
            return "animasiSampingKanan";
        } else {
            return "";
        }
        ;
    },
    warnaLock: function () {
        if (Session.get("lockMenu")) {
            return "#0E487A";
        } else {
            return "#C1C7CC";
        }
        ;
    },
    isLockMenu: function () {
        if(!adaDATA(Session.get("lockMenu"))) {
            var dataLock = Meteor.user();
            if (adaDATA(dataLock)) {
                Session.set("lockMenu", dataLock.profile.lockMenu);
            } else {
                Session.set("lockMenu", false);
            }
        }

        if (Session.get("lockMenu")) {
            return "checked";
        } else {
            return "";
        }
        ;
    },
    showIcon: function () {
        var sIcon = "";
        if (Session.get("lockMenu")) {
            sIcon = "sidebar-md-show";
        }
        return sIcon;
    },
    isAuthAdmin: function () {
        return isAdmin(this._id);
    },
    sGeneralFont: function () {
        return sGeneralFont;
    },
    sideMenuGroup: function () {
        return MENUGROUP.find({}, {sort: {locationsMENUGROUP: 1}});
    },
    sideMenu: function () {
        return MENU.find({groupMENU: this.namaMENUGROUP, aktifYN: 1});
    },
    noBadge: function () {
      if(adaDATA(Session.get(this.routerMENU))) {
          FlashMessages.sendInfo('Hello ' + UserName() + ', you have new data ' + this.namaMENU );
      }
      return Session.get(this.routerMENU);
    }
});
