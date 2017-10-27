/**
* Generated from flexurio tools
* Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
*/


import {Session} from "meteor/session";

Template.menu.created = function () {
	Session.set('limit', 5);
	Session.set('textSearch', '');
	Session.set('namaHeader', 'DATA MENU ');
	Session.set('dataDelete', '');
	Session.set('isCreating', false); Session.set('isEditing', false);

};

Template.menu.onRendered(function () {
    ScrollHandler();
});


Template.menu.helpers({
	isLockMenu:function () {
        return isLockMenu();
	},

	isEditing: function () {
		return Session.get('idEditing') === this._id;
	},
	isCreating: function () {
		return Session.get('isCreating');
	},
	menus: function () {
		let textSearch = '';

		let menuGroups = Session.get('groupMENU');
		if (adaDATA(Session.get('textSearch'))) {
			textSearch = Session.get('textSearch').replace('#', '').trim();
		}
		return MENU.find(
			{
				$or: [
					{namaMENU: {$regex: textSearch, $options:'i'}},
					{_id: {$regex: textSearch, $options:'i'}},
				],
				groupMENU: menuGroups,
				aktifYN: 1
			},
			{
				sort: {createAt: -1},
				limit: Session.get('limit')
			}
		);
	}
});

Template.menu.events({
	'click a.back': function (e, tpl) {
		e.preventDefault();
		Router.go("menuGroup");
	},

	'click a.cancel': function (e, tpl) {
		e.preventDefault();
		Session.set('isCreating', false); Session.set('isEditing', false);
		Session.set('idEditing', '');

	},

	'click a.deleteDataOK': function (e, tpl) {
		e.preventDefault();
		deleteMENU();
		FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        $("#modal_formDeleting").modal('hide');
	},
	'click a.deleteData': function (e, tpl) {
		e.preventDefault();
		Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaMENU);
		Session.set('idDeleting', this._id);
        $("#modal_formDeleting").modal('show');
	},

	'click a.create': function (e, tpl) {
		e.preventDefault();
        Scroll2Top();
		Session.set('isCreating', true);
	},
	'keyup #namaMENU': function (e, tpl) {
		e.preventDefault();
		if (e.keyCode == 13) {
			insertMENU(tpl);
		}
	},
	'click a.save': function (e, tpl) {
		e.preventDefault();
		insertMENU(tpl);
	},

	'click a.editData': function (e, tpl) {
		e.preventDefault();
		Session.set('idEditing', this._id);
	},
	'keyup #namaEditMENU': function (e, tpl) {
		e.preventDefault();
		if (e.keyCode == 13) {
			updateMENU(tpl);
		}
	},
	'click a.saveEDIT': function (e, tpl) {
		e.preventDefault();
		updateMENU(tpl);
	}

});


insertMENU = function (tpl) {


	let namaMENU = tpl.$('input[name="namaMENU"]').val();
	let routerMENU = tpl.$('input[name="routerMENU"]').val();
	let groupMENU = Session.get('groupMENU');
	let iconMENU = tpl.$('input[name="iconMENU"]').val();


	if (!adaDATA(groupMENU) | !adaDATA(namaMENU)) {
		FlashMessages.sendWarning('Please complete all of the data to be . . .');
		return;
	}

	MENU.insert(
		{
			namaMENU: namaMENU,
			routerMENU: routerMENU,
			groupMENU: groupMENU,
			iconMENU: iconMENU,
			aktifYN: 1,
         createByID: UserID(),
         createBy:UserName(),
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


updateMENU = function (tpl) {


	let namaEditMENU = tpl.$('input[name="namaEditMENU"]').val();
	let routerEditMENU = tpl.$('input[name="routerEditMENU"]').val();
	let iconEditMENU = tpl.$('input[name="iconEditMENU"]').val();
	let groupEditMENU = Session.get('groupMENU');


	if (!adaDATA(groupEditMENU) | !adaDATA(namaEditMENU)) {
		FlashMessages.sendWarning('Please complete all of the data to be . . .');
		return;
	}

	MENU.update({_id: Session.get('idEditing')},
	{
		$set: {
			routerMENU: routerEditMENU,
			namaMENU: namaEditMENU,
			groupMENU: groupEditMENU,
			iconMENU: iconEditMENU,
			updateByID: UserID(),
			updateBy:UserName(),
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

deleteMENU = function () {

	if (!adaDATA(Session.get('idDeleting'))) {
		FlashMessages.sendWarning('Please select data that you want to remove . . .');
		return;
	}

	MENU.update({_id: Session.get('idDeleting')},
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
