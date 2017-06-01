/**
 * Created by ThinkMac on 12/6/15.
 */
import {Session} from 'meteor/session';
import {moment} from 'meteor/momentjs:moment';
import './header.html';
import {Template} from 'meteor/templating';


Template.header.created = function () {
    Blaze._allowJavascriptUrls();
    Session.set('limit', 50);
    Session.set('oFILTERS', {});
    Session.set('oOPTIONS', {});
    Session.set('showMenuDept', false);
    subscribtion('memberku', {}, {}, 0);
    subscribtion('menu', {}, {}, 0);
    subscribtion('menuAuthku', {}, {}, 0);
    subscribtion('menuGroup', {}, {}, 0);
};
Template.header.helpers({
    showIcon: function () {
        var sIcon = "";

        if (getRoute(window.location.href) == "dash") {
            sIcon = "hidden-md hidden-lg";
        }
        return sIcon;
    },
    isDisconnect: function () {
        return !Meteor.status().connected;
    },
    quotes: function () {
        return moment().format("YYYY-MM-DD hh:mm:ss");
    },
    lokasiFotoKaryawan: function () {
        return pictProfile(UserID());
    },
    namaApp: function () {
        return sAPPName;
    },
    sHeaderBackground: function () {
        return sHeaderBackground;
    }
});


Template.header.events({
    'click a.gohome': function (e) {
      e.preventDefault();
      Router.go('/');
    },
    'click a.menuDept': function (e, tpl) {
        e.preventDefault();
        Session.set('showMenuDept', true);
    },
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('showMenuDept', false);
    },
    'click a.setMenuDept': function (e, tpl) {
        e.preventDefault();
        Session.set("menuDept", e.target.id);
        Session.set('showMenuDept', false);
    },
    'click .app': function (e, tpl) {
        e.preventDefault();
        Session.set('showMenuDept', false);
    },
});


Template.headerListview.helpers({
    namaHeader: function () {
        return Session.get("namaHeader");
    },
});

Template.formDeleting.helpers({
    dataDelete: function () {
        return Session.get("dataDelete");
    },
});


globalHotkeys = new Hotkeys();

globalHotkeys.add({
    combo: ['command+shift', 'ctrl+shift'],
    description: 'ADD DATA',
    callback: function () {
        Session.set('isCreating', true);
    }
});
globalHotkeys.add({
    combo: ['esc'],
    description: 'CANCEL DATA',
    callback: function () {
        Session.set('isCreating', false);
        Session.set('isEditing', false);
    }
});
