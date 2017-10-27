/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */

import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import './apimanager.html';

Template.apimanager.created = function () {
    Session.set('limit', 5);
    Session.set('textSearch', '');
    subscribtion('apimanager', Session.get('limit'), {});
    Session.set('namaHeader', 'DATA APIMANAGER');
    Session.set('dataDelete', '');
    Session.set('isCreating', false); Session.set('isEditing', false);


    this.autorun(function () {
        subscribtion('apimanager', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.apimanager.onRendered(function () {
    ScrollHandler();
});


Template.apimanager.helpers({
    isLockMenu: function () {
        return isLockMenu();
    },

    sTokenAPI: function () {
        return CryptoJS.AES.encrypt(this._id, sTokenKey).toString();
    },
    sTinggiPopUp: function () {
        return 0.6 * ($(window).height());
    },
    isEditing: function () {
        return Session.get('idEditing') === this._id;
    },
    isCreating: function () {
        return Session.get('isCreating');
    },
    apimanagers: function () {
        var textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        var oFILTERS = {
            aktifYN: 1,
            $or: [
                {namaAPIMANAGER: {$regex: textSearch, $options:'i'}},
                {kodeAPIMANAGER: {$regex: textSearch, $options:'i'}},
                {_id: {$regex: textSearch, $options:'i'}},
            ]
        };

        var oOPTIONS = {
            sort: {createAt: -1},
            limit: Session.get('limit')
        };

        Session.set('oOPTIONS', oOPTIONS);
        Session.set('oFILTERS', oFILTERS);

        return APIMANAGER.find(
            oFILTERS,
            oOPTIONS
        );
    }
});

Template.apimanager.events({
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false); Session.set('isEditing', false);
        Session.set('idEditing', '');

    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        deleteAPIMANAGER();
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        $("#modal_formDeleting").modal('show');
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaAPIMANAGER);
        Session.set('idDeleting', this._id);
        $("#modal_formDeleting").modal('show');
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', true);
    },
    'keyup #namaAPIMANAGER': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertAPIMANAGER(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertAPIMANAGER(tpl);
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
    },
    'keyup #namaEditAPIMANAGER': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updateAPIMANAGER(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updateAPIMANAGER(tpl);
    }

});


insertAPIMANAGER = function (tpl) {

    var namaAPIMANAGER = tpl.$('input[name="namaAPIMANAGER"]').val();

    if (!adaDATA(namaAPIMANAGER)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    APIMANAGER.insert(
        {
            namaAPIMANAGER: namaAPIMANAGER,
            aktifYN: 1,
            createByID: UserID(),
            createBy: UserName(),
            createAt: new Date()
        },
        function (err, id) {
            if (err) {
                FlashMessages.sendWarning('Sorry, Data could not be saved - Please repeat again.');
            } else {
                Session.set('isCreating', false);
                FlashMessages.sendSuccess('Thanks, your data is successfully saved');
            }
        }
    );
};


updateAPIMANAGER = function (tpl) {

    var namaEditAPIMANAGER = tpl.$('input[name="namaEditAPIMANAGER"]').val();

    if (!adaDATA(namaEditAPIMANAGER)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    APIMANAGER.update({_id: Session.get('idEditing')},
        {
            $set: {
                namaAPIMANAGER: namaEditAPIMANAGER,
                updateByID: UserID(),
                updateBy: UserName(),
                updateAt: new Date()
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

deleteAPIMANAGER = function () {

    if (!adaDATA(Session.get('idDeleting'))) {
        FlashMessages.sendWarning('Please select data that you want to remove . . .');
        return;
    }

    APIMANAGER.update({_id: Session.get('idDeleting')},
        {
            $set: {
                aktifYN: 0,
                deleteByID: UserID(),
                deleteBy: UserName(),
                deleteAt: new Date()
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
