/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Session} from "meteor/session";

Template.menuGroup.created = function () {
    Session.set('limit', 50); Session.set('oFILTERS', {}); Session.set('oOPTIONS', {});
    Session.set('textSearch', '');
    Session.set('namaHeader', 'DATA MENU GROUP');
    Session.set('dataDelete', '');
    Session.set('isCreating', false); Session.set('isEditing', false);


    this.autorun(function () {
        subscribtion('menuGroup', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.menuGroup.onRendered(function () {
    ScrollHandler();
});


Template.menuGroup.helpers({
    isLockMenu: function () {
        return isLockMenu();
    },

    isEditing: function () {
        return Session.get('idEditing') === this._id;
    },
    isCreating: function () {
        return Session.get('isCreating');
    },
    menuGroups: function () {
        var textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        var oFILTERS = {
            $or: [
                {namaMENUGROUP: {$regex: textSearch, $options: 'i'}},
                {iconMENUGROUP: {$regex: textSearch, $options: 'i'}},
                {_id: {$regex: textSearch, $options: 'i'}},
            ],
            aktifYN: 1
        };

        var oOPTIONS = {
            sort: {locationsMENU: 1},
            limit: Session.get('limit')
        };

        Session.set('oOPTIONS', oOPTIONS);
        Session.set('oFILTERS', oFILTERS);

        return MENUGROUP.find(
            oFILTERS,
            oOPTIONS
        );
    }
});

Template.menuGroup.events({

    'click a.detailData': function (e, tpl) {
        e.preventDefault();
        Session.set('groupMENU', this.namaMENUGROUP);
        Router.go("menu");
    },

    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false); Session.set('isEditing', false);
        Session.set('idEditing', '');

    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        deleteMENUGROUP();
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        $("#modal_formDeleting").modal('hide');
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaMENUGROUP);
        Session.set('idDeleting', this._id);
        $("#modal_formDeleting").modal('show');
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', true);
    },
    'keyup #namaMENUGROUP': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertMENUGROUP(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertMENUGROUP(tpl);
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
    },
    'keyup #namaEditMENUGROUP': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updateMENUGROUP(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updateMENUGROUP(tpl);
    }

});


insertMENUGROUP = function (tpl) {

    var namaMENUGROUP = tpl.$('input[name="namaMENUGROUP"]').val();
    var iconMENUGROUP = tpl.$('input[name="iconMENUGROUP"]').val();
    var locationsMENUGROUP = SelectedTerpilih('groupLocations');


    if (!adaDATA(iconMENUGROUP) | !adaDATA(namaMENUGROUP)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    MENUGROUP.insert(
        {
            namaMENUGROUP: namaMENUGROUP.toUpperCase(),
            iconMENUGROUP: iconMENUGROUP,
            locationsMENUGROUP: locationsMENUGROUP,
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


updateMENUGROUP = function (tpl) {


    var namaEditMENUGROUP = tpl.$('input[name="namaEditMENUGROUP"]').val();
    var iconEditMENUGROUP = tpl.$('input[name="iconEditMENUGROUP"]').val();
    var locationsMENUGROUP = SelectedTerpilih('groupLocationsEDIT');


    if (!adaDATA(iconEditMENUGROUP) | !adaDATA(namaEditMENUGROUP)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    MENUGROUP.update({_id: Session.get('idEditing')},
        {
            $set: {
                namaMENUGROUP: namaEditMENUGROUP.toUpperCase(),
                iconMENUGROUP: iconEditMENUGROUP,
                locationsMENUGROUP: locationsMENUGROUP,
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

deleteMENUGROUP = function () {

    if (!adaDATA(Session.get('idDeleting'))) {
        FlashMessages.sendWarning('Please select data that you want to remove . . .');
        return;
    }

    MENUGROUP.update({_id: Session.get('idDeleting')},
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
