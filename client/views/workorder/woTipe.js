/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./woTipe.html";

Template.woTipe.created = function () {
    Session.set('limit', 50);
    Session.set('oFILTERS', {});
    Session.set('oOPTIONS', {});
    Session.set('textSearch', '');
    Session.set('namaHeader', 'TIPE WORK ORDER');
    Session.set('dataDelete', '');
    Session.set('isCreating', false);
    Session.set('isEditing', false);
    Session.set('isDeleting', false);

    this.autorun(function () {
        subscribtion('woTipe', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.woTipe.onRendered(function () {
    ScrollHandler();
});


Template.woTipe.helpers({
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
    woTipes: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }


        let oFILTERS = {
            $or: [
                {namaWOTIPE: {$regex: textSearch, $options: 'i'}},
                {kodeWOTIPE: {$regex: textSearch, $options: 'i'}},
                {_id: {$regex: textSearch, $options: 'i'}},
            ],
            aktifYN: 1
        }

        let oOPTIONS = {
            sort: {createAt: -1},
            limit: Session.get('limit')
        }

        return WOTIPE.find(
            oFILTERS,
            oOPTIONS
        );
    }
});

Template.woTipe.events({
    'click a.report': function (e, tpl) {
        e.preventDefault();
        let sReportName = "ALL DATA TIPE WORK ORDER";
        let sReportNumber = "FLX/2016/0001";
        let sReportFootNote = "Total Tipe workorder = 23";
        let sCollections = "woSubTipeDetail";
        let sBackUrl = "woTipe";
        let cCollectionsInitial = WOSUBTIPEDETAIL;
        let aReportFilter = {aktifYN: 1};
        let aReportOptions = {
            fields: {
                namaWOSUBTIPE: 1,
                namaWOSUBTIPEDETAIL: 1,
                aktifYN: 1
            }
        };
        let oReportFieldDisplay = [
            {"NAMA": "SUB TIPE", "fields": "namaWOSUBTIPE"},
            {"NAMA": "SUB TIPE DETAIL", "fields": "namaWOSUBTIPEDETAIL"},
            {"NAMA": "AKTIF", "fields": "aktifYN"}
        ];

        setREPORT(sReportName, sReportNumber, sReportFootNote, sCollections, sBackUrl, cCollectionsInitial, aReportFilter, aReportOptions, oReportFieldDisplay);

    },

    'click a.subTipeData': function (e, tpl) {
        e.preventDefault();
        Session.set('kodeWOTIPE', this._id);
        Session.set('namaWOTIPE', this.namaWOTIPE);
        Router.go("woSubTipe");
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
        deleteWOTIPE();
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('isDeleting', true);
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaWOTIPE);
        Session.set('idDeleting', this._id);
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', true);
    },
    'keyup #namaWOTIPE': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertWOTIPE(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertWOTIPE(tpl);
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
    },
    'keyup #namaEditWOTIPE': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updateWOTIPE(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updateWOTIPE(tpl);
    }

});


insertWOTIPE = function (tpl) {

    let namaWOTIPE = tpl.$('input[name="namaWOTIPE"]').val();

    if (!adaDATA(namaWOTIPE)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    WOTIPE.insert(
        {
            namaWOTIPE: namaWOTIPE,
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


updateWOTIPE = function (tpl) {
    let namaEditWOTIPE = tpl.$('input[name="namaEditWOTIPE"]').val();

    if (!adaDATA(namaEditWOTIPE)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    WOTIPE.update({_id: Session.get('idEditing')},
        {
            $set: {
                namaWOTIPE: namaEditWOTIPE
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

deleteWOTIPE = function () {

    if (!adaDATA(Session.get('idDeleting'))) {
        FlashMessages.sendWarning('Please select data that you want to remove . . .');
        return;
    }

    WOTIPE.update({_id: Session.get('idDeleting')},
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
