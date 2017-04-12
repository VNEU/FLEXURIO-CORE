/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./kelurahan.html";

Template.kelurahan.created = function () {
    if (!adaDATA(Session.get("idKECAMATAN"))) {
        Router.go("kecamatan");
    }

	Session.set('limit', 50); Session.set('oFILTERS', {}); Session.set('oOPTIONS', {});
	Session.set('textSearch', '');
	Session.set('namaHeader', 'DATA KELURAHAN');
	Session.set('dataDelete', '');
	Session.set('isCreating', false); Session.set('isEditing', false);
	Session.set('isDeleting', false);


    this.autorun(function () {
        subscribtion('kelurahan', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.kelurahan.onRendered(function () {
    ScrollHandler();
});

Template.kelurahan.helpers({
	isEditing: function () {
		return Session.get('idEditing') === this._id;
	},
	isDeleting: function () {
		return Session.get('isDeleting');
	},
	isCreating: function () {
		return Session.get('isCreating');
	},
	kelurahans: function () {
		let textSearch = '';
		if (adaDATA(Session.get('textSearch'))) {
			textSearch = Session.get('textSearch').replace('#', '').trim();
		}

		let oFILTERS = {
            $or: [
                {namaKELURAHAN: {$regex: textSearch, $options:'i'}},
                {kodeKELURAHAN: {$regex: textSearch, $options:'i'}},
                {_id: {$regex: textSearch, $options:'i'}},
            ],
            kodeKECAMATAN: Session.get("idKECAMATAN"),
            aktifYN: 1
        };

		let oOPTIONS = {
            sort: {createAt: -1},
            limit: Session.get('limit')
        };

		Session.set('oOPTIONS', oOPTIONS);
        Session.set('oFILTERS', oFILTERS);

		return KELURAHAN.find(
			oFILTERS,
			oOPTIONS
		);
	}
});

Template.kelurahan.events({
	'click a.back': function (e, tpl) {
		e.preventDefault();
		Session.set("idKECAMATAN", "");
		Session.set("namaKECAMATAN", "");
		Router.go("kecamatan");
	},

	'click a.cancel': function (e, tpl) {
		e.preventDefault();
		Session.set('isCreating', false); Session.set('isEditing', false);
		Session.set('idEditing', '');
		Session.set('isDeleting', false);
	},

	'click a.deleteDataOK': function (e, tpl) {
		e.preventDefault();
		deleteKELURAHAN();
		FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
		Session.set('isDeleting', false);
	},
	'click a.deleteData': function (e, tpl) {
		e.preventDefault();
		Session.set('isDeleting', true);
		Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaKELURAHAN);
		Session.set('idDeleting', this._id);
	},

	'click a.create': function (e, tpl) {
		e.preventDefault();
		Session.set('isCreating', true);
	},
	'keyup #namaKELURAHAN': function (e, tpl) {
		e.preventDefault();
		if (e.keyCode == 13) {
			insertKELURAHAN(tpl);
		}
	},
	'click a.save': function (e, tpl) {
		e.preventDefault();
		insertKELURAHAN(tpl);
	},

	'click a.editData': function (e, tpl) {
		e.preventDefault();
		Session.set('idEditing', this._id);
	},
	'keyup #namaEditKELURAHAN': function (e, tpl) {
		e.preventDefault();
		if (e.keyCode == 13) {
			updateKELURAHAN(tpl);
		}
	},
	'click a.saveEDIT': function (e, tpl) {
		e.preventDefault();
		updateKELURAHAN(tpl);
	}

});


insertKELURAHAN = function (tpl) {


	let namaKELURAHAN = tpl.$('input[name="namaKELURAHAN"]').val();
	let kodeKELURAHAN = tpl.$('input[name="kodeKELURAHAN"]').val();


	if (!adaDATA(kodeKELURAHAN) | !adaDATA(namaKELURAHAN)) {
		FlashMessages.sendWarning('Please complete all of the data to be . . .');
		return;
	}

	KELURAHAN.insert(
		{
			namaKELURAHAN: namaKELURAHAN,
			kodeKELURAHAN: kodeKELURAHAN,
			idKECAMATAN: Session.get("idKECAMATAN"),
			namaKECAMATAN: Session.get("namaKECAMATAN"),
			aktifYN: 1,
         createByID: userid(),
         createBy:username(),
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


updateKELURAHAN = function (tpl) {


	let namaEditKELURAHAN = tpl.$('input[name="namaEditKELURAHAN"]').val();
	let kodeEditKELURAHAN = tpl.$('input[name="kodeEditKELURAHAN"]').val();


	if (!adaDATA(kodeEditKELURAHAN) | !adaDATA(namaEditKELURAHAN)) {
		FlashMessages.sendWarning('Please complete all of the data to be . . .');
		return;
	}

	KELURAHAN.update({_id: Session.get('idEditing')},
		{
			$set: {
				namaKELURAHAN: namaEditKELURAHAN,
				kodeKELURAHAN: kodeEditKELURAHAN,
				updateByID: userid(),
				updateBy:username(),
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
deleteKELURAHAN = function () {

	if (!adaDATA(Session.get('idDeleting'))) {
		FlashMessages.sendWarning('Please select data that you want to remove . . .');
		return;
	}

	KELURAHAN.update({_id: Session.get('idDeleting')},
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
