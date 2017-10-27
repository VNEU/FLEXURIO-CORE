/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {ReactiveVar} from 'meteor/reactive-var';
import "./message.html";

var toMessage = new ReactiveVar([]);


Template.message.created = function () {
    Session.set('limit', 50);
    Session.set('oFILTERS', {});
    Session.set('oOPTIONS', {});
    Session.set('textSearch', '');
    Session.set('namaHeader', 'DATA MESSAGE');
    Session.set('dataDelete', '');
    Session.set('isCreating', false);
    Session.set('isEditing', false);

    Session.set('oFILTERSMembers', {});
    Session.set('oFILTERS', {});
    Session.set('oOPTIONS', {});
    Session.set('flxauto_message_status', true);
    Session.set('flxauto_message_data', MENU.findOne());

    this.autorun(function () {
        subscribtion('member', {}, Session.get('oOPTIONS_toMessage'), 0);
        Meteor.subscribe('message', Session.get('limit'));
        Meteor.subscribe('messageMember', Session.get('limit'));
    });
};

Template.message.onRendered(function () {
    ScrollHandler();
});


Template.message.helpers({
    isiMessage: function () {
        var converter = new Showdown.converter();
        var isi = converter.makeHtml(this.text);
        return isi;
    },

    penerima: function () {
        return toMessage.get();
    },
    datasearchBox: function () {
        return Session.get('toMessage');
    },
    objectCARI: function () {
        return TIMELINES.findOne();
    },
    isLockMenu: function () {
        return isLockMenu();
    },
    sHeaderBackground: function () {
        return sHeaderBackground;
    },
    sTinggiPopUp: function () {
        return 0.8 * ($(window).height());
    },
    isCreating: function () {
        return Session.get('isCreating');
    },
    messagesMember: function () {
        return MESSAGEMEMBER.find({idMessage: this._id});
    },
    messages: function () {
        var textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        var dataMESSAGE = MESSAGEMEMBER.find({username:EmailUser(), aktifYN: 1});
        var idMessage = dataMESSAGE.map(function (p) {
            return p.idMessage
        });

        var oFILTERS = {
            _id: {$in: idMessage},
            aktifYN: 1,
            $or: [
                {subject: {$regex: textSearch, $options: 'i'}},
                {text: {$regex: textSearch, $options: 'i'}}
            ]
        };

        var oOPTIONS = {
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
    'keyup input#toMessage': function (e, tpl) {
        flxautocomplete.autocomplete({
            name: 'toMessage',
            element: 'input#toMessage',
            collection: MEMBER,
            field: ['profile.name', 'username'],
            fields: {profile: 1, username: 1},
            limit: 0,
            sort: {'profile.name': 1},
            filter: {}
        });
    },

    'change input#toMessage': function (e, tpl) {
        var dataPilih = tpl.$('input[name="toMessage"]').val();
        if (dataPilih.length > 10) {
            var allmember = toMessage.get();
            dataMember = MEMBER.findOne({username: dataPilih});
            if (adaDATA(dataMember)) {
                allmember.push({username: dataMember.username});
                toMessage.set(allmember);
                document.getElementById("toMessage").value = "";
            } else {
                FlashMessages.sendError('Emails not valid !');
            }
        }
    },

    'click a.hapusTerima': function (e, tpl) {
        var penerimaAll = toMessage.get();
        penerimaAll = ArrayRemove(penerimaAll, 'username', e.currentTarget.id);
        toMessage.set(penerimaAll);
    },
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false);
        Session.set('isEditing', false);
        Session.set('idEditing', '');

    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        deleteMESSAGE();
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        $("#modal_formDeleting").modal('hide');
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' "' + this.subject + '" From "' + this.createBy + '" ');
        Session.set('idDeleting', this._id);
        $("#modal_formDeleting").modal('show');
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        toMessage.set([]);
        Scroll2Top();
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
        flxcomments(e, tpl, MESSAGE);
    }

});


insertMESSAGE = function (tpl) {
    var subjectMESSAGE = tpl.$('input[name="subjectMESSAGE"]').val();
    var textMESSAGE = tpl.$('textarea[name="textMESSAGE"]').val();
    var dataTo = toMessage.get();

    if (dataTo < 1) {
        FlashMessages.sendWarning('Hello ' + UserName() + ', please input person at "TO", use ENTER to add them. ');
        return;
    }
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
                FlashMessages.sendWarning('Sorry, Data could not be saved - Please repeat again, ' + err.toString());
            } else {

                var aPenerima = {};
                aPenerima.idMessage = id;
                aPenerima.aktifYN = 1;
                aPenerima.createByID = UserID();
                aPenerima.createBy = UserName();
                aPenerima.createAt = new Date()
                aPenerima.username = Meteor.user().username;
                MESSAGEMEMBER.insert(aPenerima);

                for (var i = 0; i < dataTo.length; i++) {
                    aPenerima = dataTo[i];
                    aPenerima.idMessage = id;
                    aPenerima.aktifYN = 1;
                    aPenerima.createByID = UserID();
                    aPenerima.createBy = UserName();
                    aPenerima.createAt = new Date()

                    MESSAGEMEMBER.insert(aPenerima);

                }
                Meteor.subscribe('message', Session.get('limit'));
                Meteor.subscribe('messageMember', Session.get('limit'));

                FlashMessages.sendSuccess('Thanks, your data is successfully saved');
                Session.set('isCreating', null);
            }
        }
    );
};


updateMESSAGE = function (tpl) {


    var fromEditMESSAGE = tpl.$('input[name="fromEditMESSAGE"]').val();

    var toEditMESSAGE = tpl.$('input[name="toEditMESSAGE"]').val();

    var ccEditMESSAGE = tpl.$('input[name="ccEditMESSAGE"]').val();

    var subjectEditMESSAGE = tpl.$('input[name="subjectEditMESSAGE"]').val();

    var textEditMESSAGE = tpl.$('input[name="textEditMESSAGE"]').val();


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

    var dataMESSAGE = MESSAGEMEMBER.find({username:Meteor.user().username, idMessage:Session.get('idDeleting')});
    dataMESSAGE.map(function (p) {
        MESSAGEMEMBER.update({_id: p._id},
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
                    Meteor.subscribe('message', Session.get('limit'));
                    Meteor.subscribe('messageMember', Session.get('limit'));
                }
            }
        );
    });

    Session.set('idEditing', '');


};



