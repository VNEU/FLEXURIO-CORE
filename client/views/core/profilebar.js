/**
 * Created by MacBookPro on 6/18/15.
 * By Pamungkas Jayuda
 * yulius.jayuda@gmail.com / +628119003077
 */

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./profilebar.html";


Template.profilebar.helpers({
	username: function () {
		return UserName()
	},
	foto: function () {
		return pictProfile(UserID());
	},
	quotes: function () {
		let dKaryawan = MEMBER.findOne({_id: Meteor.userId()});
		if (dKaryawan) {
			return dKaryawan.quotes;
		} else {
			return "Orang sukses adalah orang yang bisa mensukseskan orang lain"
		}
	},
	sGeneralFont: function () {
		return sGeneralFont;
	},
	pictBackground: function () {
		return pictProfileBackground(UserID());
	},

});


Template.profilebar.events({
	'click a.linkLogout': function (e, tpl) {
		Meteor.logout(function () {
			Meteor.call('resetKunci');
			Router.go("/");
		});
	},
	"submit form.form-quotes": function (e, tpl) {
		e.preventDefault();
		let textQuotes = tpl.$('input[name="quotes"]').val();
		let dKaryawan = MEMBER.findOne({_id: Meteor.userId()});
		let idKaryawan = "";
		if (dKaryawan) {
			idKaryawan = dKaryawan._id;
		} else {
			FlashMessages.sendError("Mohon Hub IT, untuk Konfirmasi DATA KARYAWAN Anda tidak VALID !")
		}
		MEMBER.update(idKaryawan, {
			$set: {
				quotes: textQuotes
			}
		});

	}
});
