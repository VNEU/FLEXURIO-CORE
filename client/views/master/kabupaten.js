/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./kabupaten.html";

Template.kabupaten.created = function () {
    if (!adaDATA(Session.get("idPROVINSI"))) {
        Router.go("provinsi");
    }
    Session.set('limit', 50); Session.set('oFILTERS', {}); Session.set('oOPTIONS', {});
    Session.set('textSearch', '');
    Session.set('namaHeader', 'DATA KABUPATEN');
    Session.set('dataDelete', '');
    Session.set('isCreating', false);
    Session.set('isEditing', false);
    Session.set('isDeleting', false);

    this.autorun(function () {
        subscribtion('kabupaten', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.kabupaten.onRendered(function () {
    ScrollHandler();
});


Template.kabupaten.helpers({
    isEditing: function () {
        return Session.get('idEditing') === this._id;
    },
    isDeleting: function () {
        return Session.get('isDeleting');
    },
    isCreating: function () {
        return Session.get('isCreating');
    },
    kabupatens: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        let oFILTERS = {
            $or: [
                {namaKABUPATEN: {$regex: textSearch, $options: 'i'}},
                {kodeKABUPATEN: {$regex: textSearch, $options: 'i'}},
                {_id: {$regex: textSearch, $options: 'i'}},
            ],
            kodePROVINSI: Session.get("idPROVINSI"),
            aktifYN: 1

        };

        let oOPTIONS = {
            sort: {createAt: -1},
            limit: Session.get('limit')
        };

        Session.set('oOPTIONS', oOPTIONS);
        Session.set('oFILTERS', oFILTERS);

        return KABUPATEN.find(
            oFILTERS,
            oOPTIONS
        );
    }
});

Template.kabupaten.events({
    'click a.kecamatanData': function (e, tpl) {
        e.preventDefault();
        Session.set("idKABUPATEN", this.kodeKABUPATEN);
        Session.set("namaKABUPATEN", this.namaKABUPATEN);
        Router.go("kecamatan");
    },
    'click a.back': function (e, tpl) {
        e.preventDefault();
        Session.set("idPROVINSI", "");
        Session.set("namaPROVINSI", "");
        Router.go("negara");
    },

    'click a.back': function (e, tpl) {
        Session.set("idPROVINSI", "");
        Session.set("namaPROVINSI", "");
        Router.go("provinsi");
    },
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false);
        Session.set('isEditing', false);
        Session.set('idEditing', '');
        Session.set('isDeleting', false);
    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        deleteKABUPATEN();
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('isDeleting', true);
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaKABUPATEN);
        Session.set('idDeleting', this._id);
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', true);
    },
    'keyup #namaKABUPATEN': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertKABUPATEN(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertKABUPATEN(tpl);
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
    },
    'keyup #namaEditKABUPATEN': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updateKABUPATEN(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updateKABUPATEN(tpl);
    }

});


insertKABUPATEN = function (tpl) {


    let namaKABUPATEN = tpl.$('input[name="namaKABUPATEN"]').val();
    let kodeKABUPATEN = tpl.$('input[name="kodeKABUPATEN"]').val();


    if (!adaDATA(kodeKABUPATEN) | !adaDATA(namaKABUPATEN)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    KABUPATEN.insert(
        {
            namaKABUPATEN: namaKABUPATEN,
            kodeKABUPATEN: kodeKABUPATEN,
            idPROVINSI: Session.get("idPROVINSI"),
            namaPROVINSI: Session.get("namaPROVINSI"),
            aktifYN: 1,
            createByID: userid(),
            createBy: username(),
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


updateKABUPATEN = function (tpl) {


    let namaEditKABUPATEN = tpl.$('input[name="namaEditKABUPATEN"]').val();
    let kodeEditKABUPATEN = tpl.$('input[name="kodeEditKABUPATEN"]').val();


    if (!adaDATA(kodeEditKABUPATEN) | !adaDATA(namaEditKABUPATEN)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    KABUPATEN.update({_id: Session.get('idEditing')},
        {
            $set: {
                namaKABUPATEN: namaEditKABUPATEN,
                kodeKABUPATEN: kodeEditKABUPATEN,
                updateByID: userid(),
                updateBy: username(),
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

deleteKABUPATEN = function () {

    if (!adaDATA(Session.get('idDeleting'))) {
        FlashMessages.sendWarning('Please select data that you want to remove . . .');
        return;
    }

    KABUPATEN.update({_id: Session.get('idDeleting')},
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
