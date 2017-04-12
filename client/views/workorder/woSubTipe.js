/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./woSubTipe.html";

Template.woSubTipe.created = function () {
    Session.set('limit', 50); Session.set('oFILTERS', {}); Session.set('oOPTIONS', {});
    Session.set('textSearch', '');
    Session.set('namaHeader', 'SUB TIPE WORK ORDER');
    Session.set('dataDelete', '');
    Session.set('isCreating', false); Session.set('isEditing', false);
    Session.set('isDeleting', false);

    this.autorun(function () {
        subscribtion('woSubTipe', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.woSubTipe.onRendered(function () {
    ScrollHandler();
});


Template.woSubTipe.helpers({
    isLockMenu: function () {
        return isLockMenu();
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
    woSubTipes: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        let oFILTERS = {
            $or: [
                {namaWOSUBTIPE: {$regex: textSearch, $options: 'i'}},
                {kodeWOSUBTIPE: {$regex: textSearch, $options: 'i'}},
                {_id: {$regex: textSearch, $options: 'i'}},
            ],
            kodeWOTIPE: Session.get('kodeWOTIPE'),
            aktifYN: 1
        };

        let oOPTIONS = {
            sort: {createAt: -1},
            limit: Session.get('limit')
        };


        Session.set('oFILTERS', oFILTERS);
        Session.set('oOPTIONS', oOPTIONS);


        return WOSUBTIPE.find(
            oFILTERS,
            oOPTIONS
        );
    }
});

Template.woSubTipe.events({
    'click a.back': function (e, tpl) {
        e.preventDefault();
        Session.set('kodeWOTIPE', "");
        Session.set('namaWOTIPE', "");
        Router.go("woTipe");
    },

    'click a.subTipeDetailData': function (e, tpl) {
        e.preventDefault();
        Session.set('kodeWOSUBTIPE', this._id);
        Session.set('namaWOSUBTIPE', this.namaWOSUBTIPE);
        Router.go("woSubTipeDetail");
    },

    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false); Session.set('isEditing', false);
        Session.set('idEditing', '');
        Session.set('isDeleting', false);
    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        deleteWOSUBTIPE();
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('isDeleting', true);
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaWOSUBTIPE);
        Session.set('idDeleting', this._id);
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', true);
    },
    'keyup #namaWOSUBTIPE': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertWOSUBTIPE(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertWOSUBTIPE(tpl);
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
    },
    'keyup #namaEditWOSUBTIPE': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updateWOSUBTIPE(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updateWOSUBTIPE(tpl);
    }

});


insertWOSUBTIPE = function (tpl) {

    let namaWOSUBTIPE = tpl.$('input[name="namaWOSUBTIPE"]').val();

    if (!adaDATA(namaWOSUBTIPE)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    WOSUBTIPE.insert(
        {
            kodeWOTIPE: Session.get('kodeWOTIPE'),
            namaWOTIPE: Session.get('namaWOTIPE'),
            namaWOSUBTIPE: namaWOSUBTIPE,
            aktifYN: 1
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


updateWOSUBTIPE = function (tpl) {

    let namaEditWOSUBTIPE = tpl.$('input[name="namaEditWOSUBTIPE"]').val();

    if (!adaDATA(namaEditWOSUBTIPE)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    WOSUBTIPE.update({_id: Session.get('idEditing')},
        {
            $set: {
                namaWOSUBTIPE: namaEditWOSUBTIPE
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

deleteWOSUBTIPE = function () {

    if (!adaDATA(Session.get('idDeleting'))) {
        FlashMessages.sendWarning('Please select data that you want to remove . . .');
        return;
    }

    WOSUBTIPE.update({_id: Session.get('idDeleting')},
        {
            $set: {
                aktifYN: 0,
                deleteByID: userid(),
                deleteBy: username(),
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
