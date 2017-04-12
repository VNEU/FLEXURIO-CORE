/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Session} from 'meteor/session';

Template.profileData.created = function () {
    Session.set('limit', 5);
    Session.set('textSearch', '');
    Session.set('namaHeader', 'PROFILE DATA');
    Session.set('dataDelete', '');
    Session.set('isDeleting', false);

    this.autorun(function () {
        subscribtion('profileData', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.profileData.onRendered(function () {
    ScrollHandler();
});


Template.profileData.helpers({
    isEditing: function () {
        return Session.get('idEditing') === this._id;
    },
    isDeleting: function () {
        return Session.get('isDeleting');
    },
    profileDatas: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        let oOPTIONS = {
            sort: {createAt: -1},
            limit: Session.get('limit')
        };

        let oFILTERS = {
            $or: [
                {namaPROFILEDATA: {$regex: textSearch, $options: 'i'}},
                {kodePROFILEDATA: {$regex: textSearch, $options: 'i'}},
                {_id: {$regex: textSearch, $options: 'i'}},
            ]
        };

        Session.set('oFILTERS', oFILTERS);
        Session.set('oOPTIONS', oOPTIONS);

        return PROFILEDATA.find(
            oFILTERS,
            oOPTIONS
        );
    }
});

Template.profileData.events({
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', '');
        Session.set('isDeleting', false);
    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        PROFILEDATA.remove(Session.get('idDeleting'));
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('isDeleting', true);
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaPROFILEDATA);
        Session.set('idDeleting', this._id);
    },

    'keyup #namaPROFILEDATA': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertPROFILEDATA(tpl);
        }
    },
    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
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


    let namaEditPROFILEDATA = tpl.$('input[name="namaEditPROFILEDATA"]').val();
    let kodeEditPROFILEDATA = tpl.$('input[name="kodeEditPROFILEDATA"]').val();


    if (!adaDATA(kodeEditPROFILEDATA) | !adaDATA(namaEditPROFILEDATA)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    PROFILEDATA.update({_id: Session.get('idEditing')},
        {
            $set: {
                namaPROFILEDATA: namaEditPROFILEDATA,
                kodePROFILEDATA: kodeEditPROFILEDATA
            }
        },
        function (err, id) {
            if (err) {
                FlashMessages.sendWarning('Sorry, Data could not be saved - Please repeat again.');
            } else {
                Session.set('idEditing', '');
                FlashMessages.sendSuccess('Thanks, your data is successfully saved');
            }
        }
    );
};
