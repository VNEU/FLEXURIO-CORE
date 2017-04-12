/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./provinsi.html";

Template.provinsi.created = function () {

    if (!adaDATA(Session.get("idNEGARA"))) {
        Router.go("negara");
    }

    Session.set('limit', 50); Session.set('oFILTERS', {}); Session.set('oOPTIONS', {});
    Session.set('textSearch', '');
    Session.set('namaHeader', 'DATA PROVINSI');
    Session.set('dataDelete', '');
    Session.set('isCreating', false); Session.set('isEditing', false);
    Session.set('isDeleting', false);

    this.autorun(function () {
        subscribtion('provinsi', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.provinsi.onRendered(function () {
    ScrollHandler();
});


Template.provinsi.helpers({
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
    provinsis: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        let oFILTERS = {
            $or: [
                {namaPROVINSI: {$regex: textSearch, $options: 'i'}},
                {kodePROVINSI: {$regex: textSearch, $options: 'i'}},
                {_id: {$regex: textSearch, $options: 'i'}},
            ],
            kodeNEGARA: Session.get("idNEGARA"),
            aktifYN: 1
        };

        let oOPTIONS = {
            sort: {kodePROVINSI: 1},
            limit: Session.get('limit')
        };

        Session.set('oFILTERS', oFILTERS);
        Session.set('oOPTIONS', oOPTIONS);

        return PROVINSI.find(
            oFILTERS, oOPTIONS
        );
    }
});

Template.provinsi.events({
    'click a.kabupatenData': function (e, tpl) {
        e.preventDefault();
        Session.set("idPROVINSI", this.kodePROVINSI);
        Session.set("namaPROVINSI", this.namaPROVINSI);
        Router.go("kabupaten");
    },
    'click a.back': function (e, tpl) {
        e.preventDefault();
        Session.set("idNEGARA", "");
        Session.set("namaNEGARA", "");
        Router.go("negara");
    },
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false); Session.set('isEditing', false);
        Session.set('idEditing', '');
        Session.set('isDeleting', false);
    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        PROVINSI.remove(Session.get('idDeleting'));
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('isDeleting', true);
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaPROVINSI);
        Session.set('idDeleting', this._id);
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', true);
    },
    'keyup #namaPROVINSI': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertPROVINSI(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertPROVINSI(tpl);
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
    },
    'keyup #namaEditPROVINSI': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updatePROVINSI(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updatePROVINSI(tpl);
    }

});


insertPROVINSI = function (tpl) {


    let namaPROVINSI = tpl.$('input[name="namaPROVINSI"]').val();
    let kodePROVINSI = tpl.$('input[name="kodePROVINSI"]').val();


    if (!adaDATA(kodePROVINSI) | !adaDATA(namaPROVINSI)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    PROVINSI.insert(
        {
            namaPROVINSI: namaPROVINSI,
            kodePROVINSI: kodePROVINSI,
            idNEGARA: Session.get("idNEGARA"),
            namaNEGARA: Session.get("namaNEGARA"),
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


updatePROVINSI = function (tpl) {


    let namaEditPROVINSI = tpl.$('input[name="namaEditPROVINSI"]').val();
    let kodeEditPROVINSI = tpl.$('input[name="kodeEditPROVINSI"]').val();


    if (!adaDATA(kodeEditPROVINSI) | !adaDATA(namaEditPROVINSI)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    PROVINSI.update({_id: Session.get('idEditing')},
        {
            $set: {
                namaPROVINSI: namaEditPROVINSI,
                kodePROVINSI: kodeEditPROVINSI,
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

deletePROVINSI = function () {

    if (!adaDATA(Session.get('idDeleting'))) {
        FlashMessages.sendWarning('Please select data that you want to remove . . .');
        return;
    }

    PROVINSI.update({_id: Session.get('idDeleting')},
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
