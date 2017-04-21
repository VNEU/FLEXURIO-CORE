/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./todo.html";

Template.todo.created = function () {
    Session.set('limit', 50); Session.set('oFILTERS', {}); Session.set('oOPTIONS', {});
    Session.set('namaHeader', 'DATA TODO');
    Session.set('dataDelete', '');
    Session.set('isCreating', false); Session.set('isEditing', false);
    Session.set('isDeleting', false);

    this.autorun(function () {
        subscribtion('todo', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.todo.onRendered(function () {
    ScrollHandler();
});

Template.todo.helpers({
    isAdmin: function () {
        return isRoleAdmin(UserID());
    },
    isGoTo: function () {
        return !this.readYN;
    },
    members: function () {
        return MEMBER.find({}, {sort: {'profile.name': 1}})
    },

    isAction: function (sTipe) {
        return isAdminActions(window.location.href, sTipe);
    },
    sTinggiPopUp: function () {
        return 0.6 * ($(window).height());
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
    todos: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        let oFILTERS = {
            aktifYN: 1,
            $or: [
                {subjectTODO: {$regex: textSearch, $options: 'i'}},
                {contentTODO: {$regex: textSearch, $options: 'i'}},
                {actionsTODO: {$regex: textSearch, $options: 'i'}},
                {todotoTODO: {$regex: textSearch, $options: 'i'}},
                {todotoidTODO: {$regex: textSearch, $options: 'i'}},
                {_id: {$regex: textSearch, $options: 'i'}}
            ]
        };

        let oOPTIONS = {
            sort: {createAt: -1},
            limit: Session.get('limit')
        };

        return TODO.find(
            oFILTERS,
            oOPTIONS
        );
    }
});

Template.todo.events({
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false); Session.set('isEditing', false);
        Session.set('idEditing', '');
        Session.set('isDeleting', false);
    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        deleteTODO();
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('isDeleting', true);
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaTODO);
        Session.set('idDeleting', this._id);
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', true);
    },
    'keyup #namaTODO': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertTODO(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertTODO(tpl);
    },
    'click a.goTo': function (e, tpl) {
        e.preventDefault();
        TODO.update({_id: this._id}, {$set: {readYN: true, readAt: new Date()}});
        Router.go(this.actions + "/" + this.actionsID);
    },


    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
    },
    'keyup #namaEditTODO': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updateTODO(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updateTODO(tpl);
    },
    'submit form.form-comments': function (e, tpl) {
        e.preventDefault();
        let textComments = tpl.$('input[name="comments' + this._id + '"]').val();
        if (textComments.length) {
            addComments(this._id, textComments, TODO);
        }
        e.target.reset();
    }


});


insertTODO = function (tpl) {


    let subjectTODO = tpl.$('input[name="subjectTODO"]').val();
    let contentTODO = tpl.$('input[name="contentTODO"]').val();
    let actionsTODO = tpl.$('input[name="actionsTODO"]').val();
    let actionsIDTODO = tpl.$('input[name="actionsIDTODO"]').val();
    let todotoidTODO = tpl.$('select[name="todoTo"]').val();
    let todotoTODO = SelectedTerpilih("todoTo");


    if (!adaDATA(subjectTODO) | !adaDATA(contentTODO) | !adaDATA(actionsTODO) | !adaDATA(todotoTODO) | !adaDATA(todotoidTODO)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    addTodo(subjectTODO, contentTODO, actionsTODO, actionsIDTODO, todotoTODO, todotoidTODO);

};


updateTODO = function (tpl) {

    let subjectEditTODO = tpl.$('input[name="subjectEditTODO"]').val();
    let contentEditTODO = tpl.$('input[name="contentEditTODO"]').val();
    let actionsEditTODO = tpl.$('input[name="actionsEditTODO"]').val();
    let actionsIDEditTODO = tpl.$('input[name="actionsIDEditTODO"]').val();

    if (!adaDATA(subjectEditTODO) | !adaDATA(contentEditTODO) | !adaDATA(actionsEditTODO)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    TODO.update({_id: Session.get('idEditing')},
        {
            $set: {
                subject: subjectEditTODO,
                content: contentEditTODO,
                actions: actionsEditTODO,
                actionsID: actionsIDEditTODO,

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

deleteTODO = function () {

    if (!adaDATA(Session.get('idDeleting'))) {
        FlashMessages.sendWarning('Please select data that you want to remove . . .');
        return;
    }

    TODO.update({_id: Session.get('idDeleting')},
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



