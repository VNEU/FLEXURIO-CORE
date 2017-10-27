/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./woSubTipeDetail.html";

Template.woSubTipeDetail.created = function () {
	Session.set('limit', 50); Session.set('oFILTERS', {}); Session.set('oOPTIONS', {});
	Session.set('textSearch', '');
	Session.set('namaHeader', 'DETAIL SUB TIPE WORK ORDER');
	Session.set('dataDelete', '');
	Session.set('isCreating', false); Session.set('isEditing', false);


    this.autorun(function () {
        subscribtion('woSubTipeDetail', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.woSubTipeDetail.onRendered(function () {
    ScrollHandler();
});


Template.woSubTipeDetail.helpers({
    isLockMenu: function () {
        return isLockMenu();
    },
	isEditing: function () {
		return Session.get('idEditing') === this._id;
	},
	isCreating: function () {
		return Session.get('isCreating');
	},
	woSubTipeDetails: function () {
		let textSearch = '';
		if (adaDATA(Session.get('textSearch'))) {
			textSearch = Session.get('textSearch').replace('#', '').trim();
		}

		let oFILTERS = {
            $or: [
                {namaWOSUBTIPEDETAIL: {$regex: textSearch, $options:'i'}},
                {kodeWOSUBTIPEDETAIL: {$regex: textSearch, $options:'i'}},
                {_id: {$regex: textSearch, $options:'i'}},
            ],
            kodeWOSUBTIPE: Session.get('kodeWOSUBTIPE'),
            aktifYN: 1
        }

        var oOPTIONS = {
            sort: {createAt: -1},
            limit: Session.get('limit')
        }

        Session.set('oFILTERS', oFILTERS);
        Session.set('oOPTIONS', oOPTIONS);

		return WOSUBTIPEDETAIL.find(
			oFILTERS,
			oOPTIONS
		);
	}
});

Template.woSubTipeDetail.events({
	'click a.back': function (e, tpl) {
		e.preventDefault();
		Session.set('kodeWOSUBTIPE', "");
		Session.set('namaWOSUBTIPE', "");
		Router.go("woSubTipe");
	},
	'click a.cancel': function (e, tpl) {
		e.preventDefault();
		Session.set('isCreating', false); Session.set('isEditing', false);
		Session.set('idEditing', '');

	},

	'click a.deleteDataOK': function (e, tpl) {
		e.preventDefault();
		deleteWOSUBTIPEDETAIL();
		FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        $("#modal_formDeleting").modal('hide');
	},
	'click a.deleteData': function (e, tpl) {
		e.preventDefault();
		Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaWOSUBTIPEDETAIL);
		Session.set('idDeleting', this._id);
        $("#modal_formDeleting").modal('show');
	},

	'click a.create': function (e, tpl) {
		e.preventDefault();
		Session.set('isCreating', true);
	},
	'keyup #namaWOSUBTIPEDETAIL': function (e, tpl) {
		e.preventDefault();
		if (e.keyCode == 13) {
			insertWOSUBTIPEDETAIL(tpl);
		}
	},
	'click a.save': function (e, tpl) {
		e.preventDefault();
		insertWOSUBTIPEDETAIL(tpl);
	},

	'click a.editData': function (e, tpl) {
		e.preventDefault();
		Session.set('idEditing', this._id);
	},
	'keyup #namaEditWOSUBTIPEDETAIL': function (e, tpl) {
		e.preventDefault();
		if (e.keyCode == 13) {
			updateWOSUBTIPEDETAIL(tpl);
		}
	},
	'click a.saveEDIT': function (e, tpl) {
		e.preventDefault();
		updateWOSUBTIPEDETAIL(tpl);
	}

});


insertWOSUBTIPEDETAIL = function (tpl) {

	let namaWOSUBTIPEDETAIL = tpl.$('input[name="namaWOSUBTIPEDETAIL"]').val();

	if (!adaDATA(namaWOSUBTIPEDETAIL)) {
		FlashMessages.sendWarning('Please complete all of the data to be . . .');
		return;
	}

	WOSUBTIPEDETAIL.insert(
		{
			kodeWOSUBTIPE: Session.get('kodeWOSUBTIPE'),
			namaWOSUBTIPE: Session.get('namaWOSUBTIPE'),
			namaWOSUBTIPEDETAIL: namaWOSUBTIPEDETAIL,
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


updateWOSUBTIPEDETAIL = function (tpl) {

	let namaEditWOSUBTIPEDETAIL = tpl.$('input[name="namaEditWOSUBTIPEDETAIL"]').val();

	if (!adaDATA(namaEditWOSUBTIPEDETAIL)) {
		FlashMessages.sendWarning('Please complete all of the data to be . . .');
		return;
	}

	WOSUBTIPEDETAIL.update({_id: Session.get('idEditing')},
		{
			$set: {
				namaWOSUBTIPEDETAIL: namaEditWOSUBTIPEDETAIL,
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

deleteWOSUBTIPEDETAIL = function () {

	if (!adaDATA(Session.get('idDeleting'))) {
		FlashMessages.sendWarning('Please select data that you want to remove . . .');
		return;
	}

	WOSUBTIPEDETAIL.update({_id: Session.get('idDeleting')},
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
