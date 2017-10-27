/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import './profileData.html';

Template.profileData.created = function () {
    Session.set('limit', 100);
    Session.set('textSearch', '');
    Session.set('namaHeader', 'PROFILE DATA');
    Session.set('dataDelete', '');

    Session.set('idEditingPass', false);

};

Template.profileData.rendered = function () {
    ScrollHandler();
};

Template.profileData.helpers({
    isEditingPASS: function () {
        return Session.get('idEditingPass') === this._id;
    },
    name: function () {
        return UserName();
    },
    emails: function () {
        return Meteor.users.findOne({_id:UserID()}).emails[0].address;
    },
});

Template.profileData.events({
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditingPass', '');

    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        PROFILEDATA.remove(Session.get('idDeleting'));
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        $("#modal_formDeleting").modal('hide');
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaPROFILEDATA);
        Session.set('idDeleting', this._id);
        $("#modal_formDeleting").modal('show');
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditingPass', this._id);
    },
    'keyup #namaEditPROFILEDATA': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updatePROFILEDATA(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updatePROFILEDATA(tpl);
    }

});


updatePROFILEDATA = function (tpl) {
    var password = tpl.$('input[name="password"]').val();
    var retype = tpl.$('input[name="retype"]').val();

    if(password != retype) {
        FlashMessages.sendWarning('The specified password is not correct');
        return;
    } else {
        Meteor.call('updatePassUser', UserID(), password);
        Router.go("/");
    }
};
