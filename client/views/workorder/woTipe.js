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
    woTipes: function () {
        var textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }


        var oFILTERS = {
            $or: [
                {namaWOTIPE: {$regex: textSearch, $options: 'i'}},
                {kodeWOTIPE: {$regex: textSearch, $options: 'i'}},
                {_id: {$regex: textSearch, $options: 'i'}},
            ],
            aktifYN: 1
        }

        var oOPTIONS = {
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
    'click a.subTipeData': function (e, tpl) {
        e.preventDefault();
        Session.set('kodeWOTIPE', this._id);
        Session.set('namaWOTIPE', this.namaWOTIPE);
        Router.go("woSubTipe");
    },
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', null);

    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        deleteWOTIPE();
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        $("#modal_formDeleting").modal('hide');
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaWOTIPE);
        Session.set('idDeleting', this._id);
        $("#modal_formDeleting").modal('show');
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        $("#modal_woTipe").modal('show')
    },
    'keyup #namaWOTIPE': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            if (adaDATA(Session.get('idEditing'))) {
                updateWOTIPE(tpl);
            } else {
                insertWOTIPE(tpl);
            }
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        if (adaDATA(Session.get('idEditing'))) {
            updateWOTIPE(tpl);
        } else {
            insertWOTIPE(tpl);
        }
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
        document.getElementById('namaWOTIPE').value = this.namaWOTIPE;
        $("#modal_woTipe").modal('show')
    }
});


insertWOTIPE = function (tpl) {

    var namaWOTIPE = tpl.$('input[name="namaWOTIPE"]').val();

    if (!adaDATA(namaWOTIPE)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    WOTIPE.insert(
        {
            namaWOTIPE: namaWOTIPE,
            aktifYN: 1,
            createByID: UserID(),
            createBy: UserName(),
            createAt: new Date()
        },
        function (err, id) {
            if (err) {
                FlashMessages.sendWarning('Sorry, Data could not be saved - Please repeat again.');
            } else {
                $("#modal_woTipe").modal('hide');
                FlashMessages.sendSuccess('Thanks, your data is successfully saved');
            }
        }
    );
};


updateWOTIPE = function (tpl) {
    var namaWOTIPE = tpl.$('input[name="namaWOTIPE"]').val();

    if (!adaDATA(namaWOTIPE)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    WOTIPE.update({_id: Session.get('idEditing')},
        {
            $set: {
                namaWOTIPE: namaWOTIPE,
                updateByID: UserID(),
                updateBy: UserName(),
                updateAt: new Date()
            }
        },
        function (err, id) {
            if (err) {
                FlashMessages.sendWarning('Sorry, Data could not be saved - Please repeat again.');
            } else {
                $("#modal_woTipe").modal('hide');
                Session.set('idEditing', null);
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
