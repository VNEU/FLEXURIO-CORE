/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */

import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./member.html";

Template.member.created = function () {
    Session.set('limit', 50); Session.set('oFILTERS', {}); Session.set('oOPTIONS', {});
    Session.set('textSearch', '');
    Session.set('namaHeader', 'DATA MEMBER');
    Session.set('dataDelete', '');
    Session.set('isCreating', false); Session.set('isEditing', false);
    Session.set('isDeleting', false);
    SetFOTO(200, 300, 'updateFotoBackground', pictProfileBackground(""), "");

    this.autorun(function () {
        subscribtion('member', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.member.onRendered(function () {
    ScrollHandler();
});

Template.member.helpers({
    isLockMenu: function () {
        return isLockMenu();
    },

    pictProfile: function () {
        return pictProfile(this._id);
    },
    pictProfileBackground: function () {
        return pictProfileBackground(this._id);
    },
    sAvatar: function () {
        return sAvatar;
    },
    emailUsers: function () {
        let emailUser = this.emails;
        if (adaDATA(emailUser)) {
            return this.emails[0].address;
        } else if (adaDATA(this.services)) {
            return this.services.google.email;
        }
    },
    isEditing: function () {
        return Session.get('idEditing') === this._id;
    },
    isDeleting: function () {
        return Session.get('isDeleting');
    },
    isCreating: function () {
        return Session.get('isCreating');
    },
    members: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        let oOPTIONS = {
            sort: {_id: -1},
            limit: Session.get('limit')
        };

        let oFILTERS = {
            $or: [
                {_id: {$regex: textSearch, $options: 'i'}},
                {'profile.name': {$regex: textSearch, $options: 'i'}},
            ]
        };

        Session.set('oOPTIONS', oOPTIONS);
        Session.set('oFILTERS', oFILTERS);

        return MEMBER.find(
            oFILTERS,
            oOPTIONS
        );
    }
});

Template.member.events({
    'click a.authRSA': function (e, tpl) {
        e.preventDefault();
        crypt = new JSEncrypt({default_key_size: 2048});
        crypt.getKey();
        Meteor.call('updateUserRSA', this._id, crypt.getPrivateKey(), crypt.getPublicKey(), function (err) {
            if (err) {
                FlashMessages.sendWarning('Sorry, Data could not be saved - Please repeat again.' + err);
            } else {
                FlashMessages.sendSuccess('Thanks, your data is successfully saved');
            }
        });

    },

    'click a.ubahProfile': function (e, tpl) {
        e.preventDefault();
        SetFOTO(400, 500, 'updateFotoBackground', pictProfileBackground(this._id), this._id);
        $('#editYourAvatarModal').modal();
    },
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false); Session.set('isEditing', false);
        Session.set('idEditing', '');
        Session.set('isDeleting', false);
    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        Meteor.call('deleteUser', Session.get("idDeleting"));
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('isDeleting', true);
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.profile.name);
        Session.set('idDeleting', this._id);
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', true);
    },
    'keyup #namaMEMBER': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertMEMBER(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertMEMBER(tpl);
    },
    'click a.authMember': function (e, tpl) {
        e.preventDefault();
        Session.set('idMember', this._id);
        Session.set('namaMember', this.profile.name);
        Router.go("menuAuth");
    },
    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
        Session.set('namaMember', this.profile.name);
        Session.set('emailEditing', this.emails[0].address);
    },
    'keyup #namaEditMEMBER': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updateMEMBER(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updateMEMBER(tpl);
    }

});


insertMEMBER = function (tpl) {

    let textFirstName = tpl.$('input[name=textFirstName]').val();
    let textLastName = tpl.$('input[name=textLastName]').val();
    let textEmail = tpl.$('input[name=textEmail]').val();
    let textPassword = tpl.$('input[name=textPassword]').val();
    let textPasswordRetype = tpl.$('input[name=textPasswordRetype]').val();

    if (textPassword != textPasswordRetype) {
        FlashMessages.sendWarning('Sorry, Please retype your password corectlly !');
        return;
    }

    if (!adaDATA(textFirstName) | !adaDATA(textLastName) | !adaDATA(textEmail)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    Meteor.call('createUserNew', textFirstName + ' ' + textLastName, textEmail, textPassword, function (err) {
        if (err == "GAGAL") {
            FlashMessages.sendWarning('Sorry, Data could not be saved - Please repeat again.');
        } else {
            Session.set('isCreating', false);
            FlashMessages.sendSuccess('Thanks, your data is successfully saved');
        }
    });

    insertLogs("CREATE ACCOUNT " + textFirstName + ' ' + textLastName, " " + username() + " create new user account.");

};

updateMEMBER = function (tpl) {

    let emailNew = tpl.$('input[name="emailNew"]').val();
    let newPassword = tpl.$('input[name="newPassword"]').val();
    let retypePassword = tpl.$('input[name="retypePassword"]').val();


    if (!adaDATA(emailNew) & (!adaDATA(newPassword) | !adaDATA(retypePassword))) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    if (adaDATA(newPassword) | adaDATA(retypePassword)) {
        if (newPassword !== retypePassword) {
            FlashMessages.sendWarning('Please check data change password . . .');
            return;
        }
    }


    Meteor.call('updateUserData', Session.get("idEditing"), emailNew, newPassword, function (err) {
        if (err == "GAGAL") {
            FlashMessages.sendWarning('Sorry, Data could not be saved - Please repeat again.');
        } else {
            Session.set('isCreating', false);
            FlashMessages.sendSuccess('Thanks, your data is successfully saved');
        }
    });

    Session.set('idEditing', "");
    insertLogs("UPDATE DATA MEMBER ", " " + username() + " change data email or password user " + Session.get("namaMember").toUpperCase(),);

};
