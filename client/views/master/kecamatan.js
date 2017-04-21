/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import './kecamatan.html';

Template.kecamatan.created = function () {
    if (!adaDATA(Session.get("idKABUPATEN"))) {
        Router.go("kabupaten");
    }

    Session.set('limit', 50); Session.set('oFILTERS', {}); Session.set('oOPTIONS', {});
    Session.set('textSearch', '');
    Session.set('namaHeader', 'DATA KECAMATAN');
    Session.set('dataDelete', '');
    Session.set('isCreating', false); Session.set('isEditing', false);
    Session.set('isDeleting', false);

    this.autorun(function () {
        subscribtion('kecamatan', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.kecamatan.onRendered(function () {
    ScrollHandler();
});


Template.kecamatan.helpers({
    isEditing: function () {
        return Session.get('idEditing') === this._id;
    },
    isDeleting: function () {
        return Session.get('isDeleting');
    },
    isCreating: function () {
        return Session.get('isCreating');
    },
    kecamatans: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        let oFILTERS = {
            $or: [
                {namaKECAMATAN: {$regex: textSearch, $options: 'i'}},
                {kodeKECAMATAN: {$regex: textSearch, $options: 'i'}},
                {_id: {$regex: textSearch, $options: 'i'}},
            ],
            kodeKABUPATEN: Session.get("idKABUPATEN"),
            aktifYN: 1
        };

        let oOPTIONS = {
            sort: {createAt: -1},
            limit: Session.get('limit')
        };

        Session.set('oFILTERS', oFILTERS);
        Session.set('oOPTIONS', oOPTIONS);

        return KECAMATAN.find(
            oFILTERS,
            oOPTIONS
        );
    }
});

Template.kecamatan.events({
    'click a.kelurahanData': function (e, tpl) {
        e.preventDefault();
        Session.set("idKECAMATAN", this.kodeKECAMATAN);
        Session.set("namaKECAMATAN", this.namaKECAMATAN);
        Router.go("kelurahan");
    },
    'click a.back': function (e, tpl) {
        e.preventDefault();
        Session.set("idKABUPATEN", "");
        Session.set("namaKABUPATEN", "");
        Router.go("kabupaten");
    },

    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false); Session.set('isEditing', false);
        Session.set('idEditing', '');
        Session.set('isDeleting', false);
    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        deleteKECAMATAN();
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('isDeleting', true);
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaKECAMATAN);
        Session.set('idDeleting', this._id);
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', true);
    },
    'keyup #namaKECAMATAN': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertKECAMATAN(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertKECAMATAN(tpl);
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
    },
    'keyup #namaEditKECAMATAN': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updateKECAMATAN(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updateKECAMATAN(tpl);
    }

});


insertKECAMATAN = function (tpl) {


    let namaKECAMATAN = tpl.$('input[name="namaKECAMATAN"]').val();
    let kodeKECAMATAN = tpl.$('input[name="kodeKECAMATAN"]').val();


    if (!adaDATA(kodeKECAMATAN) | !adaDATA(namaKECAMATAN)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    KECAMATAN.insert(
        {
            namaKECAMATAN: namaKECAMATAN,
            kodeKECAMATAN: kodeKECAMATAN,
            idKABUPATEN: Session.get("idKABUPATEN"),
            namaKABUPATEN: Session.get("namaKABUPATEN"),
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


updateKECAMATAN = function (tpl) {


    let namaEditKECAMATAN = tpl.$('input[name="namaEditKECAMATAN"]').val();
    let kodeEditKECAMATAN = tpl.$('input[name="kodeEditKECAMATAN"]').val();


    if (!adaDATA(kodeEditKECAMATAN) | !adaDATA(namaEditKECAMATAN)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    KECAMATAN.update({_id: Session.get('idEditing')},
        {
            $set: {
                namaKECAMATAN: namaEditKECAMATAN,
                kodeKECAMATAN: kodeEditKECAMATAN,
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

deleteKECAMATAN = function () {

    if (!adaDATA(Session.get('idDeleting'))) {
        FlashMessages.sendWarning('Please select data that you want to remove . . .');
        return;
    }

    KECAMATAN.update({_id: Session.get('idDeleting')},
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
