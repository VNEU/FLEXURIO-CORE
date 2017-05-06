/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Session} from 'meteor/session';

Template.activitylogs.created = function () {
    Session.set('limit', 50); Session.set('oFILTERS', {}); Session.set('oOPTIONS', {});
    Session.set('textSearch', '');
    Session.set('namaHeader', 'ACTIVITY LOGS');
    Session.set('dataDelete', '');
    Session.set('isDeleting', false);

    this.autorun(function () {
        subscribtion('activitylogs', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.activitylogs.onRendered(function () {
    ScrollHandler();
});

Template.activitylogs.helpers({
    isLockMenu: function () {
        return isLockMenu();
    },

    isDeleting: function () {
        return Session.get('isDeleting');
    },
    activitylogss: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }
        let oFILTERS = {
            $or: [
                {namaACTIVITYLOGS: {$regex: textSearch, $options:'i'}},
                {kodeACTIVITYLOGS: {$regex: textSearch, $options:'i'}},
                {_id: {$regex: textSearch, $options:'i'}},
            ]
        };

        let oOPTIONS = {
            sort: {createAt: -1},
            limit: Session.get('limit')
        };

        Session.set('oOPTIONS', oOPTIONS);
        Session.set('oFILTERS', oFILTERS);

        return ACTIVITYLOGS.find(
            oFILTERS
        );
    }
});

Template.activitylogs.events({
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false); Session.set('isEditing', false);
        Session.set('isDeleting', false);
    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        ACTIVITYLOGS.remove(Session.get('idDeleting'));
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('isDeleting', true);
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaACTIVITYLOGS);
        Session.set('idDeleting', this._id);
    }
});