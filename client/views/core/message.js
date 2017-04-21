/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./message.html";

Template.message.created = function () {
    Session.set('limit', 50); Session.set('oFILTERS', {}); Session.set('oOPTIONS', {});
    Session.set('textSearch', '');
    Session.set('namaHeader', 'DATA MESSAGE');
    Session.set('dataDelete', '');
    Session.set('isCreating', false); Session.set('isEditing', false);
    Session.set('isDeleting', false);
    Session.set('oFILTERSMembers', {});
    Session.set('oFILTERS', {});
    Session.set('oOPTIONS', {});


    $('.form-control').on('focus blur', function (e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');


    this.autorun(function () {
        subscribtion('message', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
        subscribtion('messageMember', Session.get('oFILTERSMembers'), {}, 0);
    });
};

Template.message.onRendered(function () {
    ScrollHandler();
});


Template.message.helpers({
    isLockMenu: function () {
        return isLockMenu();
    },
    sHeaderBackground: function () {
        return sHeaderBackground;
    },
    sTinggiPopUp: function () {
        return 0.8 * ($(window).height());
    },
    isDeleting: function () {
        return Session.get('isDeleting');
    },
    isCreating: function () {
        return Session.get('isCreating');
    },
    messagesMember: function () {
        let oFILTERSMembers = {idMESSAGE: this._id};
        Session.set('oFILTERSMembers', oFILTERSMembers);
        return MESSAGEMEMBER.find(oFILTERSMembers);
    },
    messages: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        let oFILTERS = {
            aktifYN: 1,
            $or: [
                {subject: {$regex: textSearch, $options: 'i'}},
                {text: {$regex: textSearch, $options: 'i'}},
                {_id: {$regex: textSearch, $options: 'i'}},
            ]
        };

        let oOPTIONS = {
            sort: {createAt: -1},
            limit: Session.get('limit')
        };


        Session.set('oOPTIONS', oOPTIONS);
        Session.set('oFILTERS', oFILTERS);

        return MESSAGE.find(
            oFILTERS,
            oOPTIONS
        );
    }
});

Template.message.events({
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false); Session.set('isEditing', false);
        Session.set('idEditing', '');
        Session.set('isDeleting', false);
    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        deleteMESSAGE();
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('isDeleting', true);
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaMESSAGE);
        Session.set('idDeleting', this._id);
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', true);
    },
    'keyup #namaMESSAGE': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertMESSAGE(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertMESSAGE(tpl);
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
    },
    'keyup #namaEditMESSAGE': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updateMESSAGE(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updateMESSAGE(tpl);
    },
    'submit form.form-comments': function (e, tpl) {
        e.preventDefault();
        let textComments = tpl.$('input[name="comments' + this._id + '"]').val();
        if (textComments.length) {
            addComments(this._id, textComments, MESSAGE);
        }
        e.target.reset();
    }


});


insertMESSAGE = function (tpl) {
    let subjectMESSAGE = tpl.$('input[name="subjectMESSAGE"]').val();
    let textMESSAGE = tpl.$('textarea[name="textMESSAGE"]').val();

    if (!adaDATA(subjectMESSAGE) | !adaDATA(textMESSAGE)) {
        FlashMessages.sendWarning('Please add subject or Messages text');
        return;
    }

    MESSAGE.insert(
        {
            subject: subjectMESSAGE,
            text: textMESSAGE,
            aktifYN: 1,
            createByID: UserID(),
            createBy: UserName(),
            createAt: new Date()
        },
        function (err, id) {
            if (err) {
                FlashMessages.sendWarning('Sorry, Data could not be saved - Please repeat again.');
            } else {
                let nameSession = 'autocomplate_session_' + 'to';
                let dataSelected = Session.get(nameSession);

                dataSelected.forEach(
                    function (obj) {
                        obj["idMESSAGE"] = id;
                        MESSAGEMEMBER.insert(obj);
                    });
                Session.set('isCreating', false);
                FlashMessages.sendSuccess('Thanks, your data is successfully saved');
            }
        }
    );
};


updateMESSAGE = function (tpl) {


    let fromEditMESSAGE = tpl.$('input[name="fromEditMESSAGE"]').val();

    let toEditMESSAGE = tpl.$('input[name="toEditMESSAGE"]').val();

    let ccEditMESSAGE = tpl.$('input[name="ccEditMESSAGE"]').val();

    let subjectEditMESSAGE = tpl.$('input[name="subjectEditMESSAGE"]').val();

    let textEditMESSAGE = tpl.$('input[name="textEditMESSAGE"]').val();


    if (!adaDATA(fromEditMESSAGE) | !adaDATA(toEditMESSAGE) | !adaDATA(ccEditMESSAGE) | !adaDATA(subjectEditMESSAGE) | !adaDATA(textEditMESSAGE)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    MESSAGE.update({_id: Session.get('idEditing')},
        {
            $set: {

                from: hideData(fromEditMESSAGE),

                to: hideData(toEditMESSAGE),

                cc: hideData(ccEditMESSAGE),

                subject: hideData(subjectEditMESSAGE),

                text: hideData(textEditMESSAGE),

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

deleteMESSAGE = function () {

    if (!adaDATA(Session.get('idDeleting'))) {
        FlashMessages.sendWarning('Please select data that you want to remove . . .');
        return;
    }

    MESSAGE.update({_id: Session.get('idDeleting')},
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



