/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./negara.html";

Template.negara.created = function () {
    Session.set('limit', 5);
    Session.set('textSearch', '');
    Session.set('namaHeader', 'DATA NEGARA');
    Session.set('dataDelete', '');
    Session.set('isCreating', false); Session.set('isEditing', false);
    Session.set('isDeleting', false);

    this.autorun(function () {
        subscribtion('negara', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.negara.onRendered(function () {
    ScrollHandler();
});


Template.negara.helpers({
    isLockMenu: function () {
        return isLockMenu();
    },

    namaNEGARA: function () {
        return showData(this.namaNEGARA, this.createByID);
    },
    kodeNEGARA: function () {
        return showData(this.kodeNEGARA, this.createByID);
    },

    isAction: function (sTipe) {
        return isAdminActions(window.location.href, sTipe);
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
    negaras: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        let oFILTERS = {
            $or: [
                {namaNEGARA: {$regex: textSearch, $options: 'i'}},
                {kodeNEGARA: {$regex: textSearch, $options: 'i'}},
                {_id: {$regex: textSearch, $options: 'i'}},
            ],
            aktifYN: 1
        };

        let oOPTIONS = {
            sort: {createAt: -1},
            limit: Session.get('limit')
        };

        Session.set('oOPTIONS', oOPTIONS);
        Session.set('oFILTERS', oFILTERS);

        return NEGARA.find(
            oFILTERS,
            oOPTIONS
        );
    }
});

Template.negara.events({
    'click a.provinsiData': function (e, tpl) {
        e.preventDefault();
        Session.set("namaNEGARA", this.namaNEGARA);
        Session.set("idNEGARA", this.kodeNEGARA);
        Router.go("provinsi");
    },
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false); Session.set('isEditing', false);
        Session.set('idEditing', '');
        Session.set('isDeleting', false);
    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        deleteNEGARA();
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('isDeleting', true);
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaNEGARA);
        Session.set('idDeleting', this._id);
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', true);
    },
    'keyup #namaNEGARA': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertNEGARA(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertNEGARA(tpl);
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
    },
    'keyup #namaEditNEGARA': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updateNEGARA(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updateNEGARA(tpl);
    }

});


insertNEGARA = function (tpl) {


    let namaNEGARA = tpl.$('input[name="namaNEGARA"]').val();
    let kodeNEGARA = tpl.$('input[name="kodeNEGARA"]').val();


    if (!adaDATA(kodeNEGARA) | !adaDATA(namaNEGARA)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    NEGARA.insert(
        {
            namaNEGARA: hideData(namaNEGARA),
            kodeNEGARA: hideData(kodeNEGARA),
            aktifYN: 1,
            createByID: UserID(),
            createBy: UserName(),
            createAt: new Date()
        },
        function (err, id) {
            if (err) {
                FlashMessages.sendWarning('Sorry, Data could not be saved - Please repeat again.' + err);
            } else {
                Session.set('isCreating', false);
                FlashMessages.sendSuccess('Thanks, your data is successfully saved');
            }
        }
    );
};


updateNEGARA = function (tpl) {


    let namaEditNEGARA = tpl.$('input[name="namaEditNEGARA"]').val();
    let kodeEditNEGARA = tpl.$('input[name="kodeEditNEGARA"]').val();


    if (!adaDATA(kodeEditNEGARA) | !adaDATA(namaEditNEGARA)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    NEGARA.update({_id: Session.get('idEditing')},
        {
            $set: {
                namaNEGARA: hideData(namaEditNEGARA),
                kodeNEGARA: hideData(kodeEditNEGARA),
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

deleteNEGARA = function () {

    if (!adaDATA(Session.get('idDeleting'))) {
        FlashMessages.sendWarning('Please select data that you want to remove . . .');
        return;
    }

    NEGARA.update({_id: Session.get('idDeleting')},
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
