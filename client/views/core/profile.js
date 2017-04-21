/**
 * Created by MacBookPro on 6/3/15.
 * By Pamungkas Jayuda
 * yulius.jayuda@gmail.com / +628119003077
 */

Template.profile.created = function () {
    subscribtion('memberku', {}, {}, 0);
    SetFOTO(500,500,'updateFotoMember', pictProfile(UserID()), UserID());
};


Template.profile.helpers({
	sHeaderBackground: function () {
		return sHeaderBackground;
	},
	isEditingUpload: function () {
		return Session.get('editedUploadId') === this._id;
	},
	pictProfile: function () {
		return pictProfile(UserID());
	},
	pictBackground: function () {
		return pictProfileBackground(UserID());
	},
	members: function () {
		return MEMBER.find(Meteor.userId());
	},
	username: function () {
		return UserName();
	},
	email: function () {
		return email();
	},
	uploadData: function () {
		return uploadFotoMember(Meteor.userId());
	},
	isCreatingProfile: function () {
		return Session.get('isCreatingProfile');
	},
	isCreatingPenyelenggara: function () {
		let penyelenggara = PenyelenggaraAdmins.findOne({penyelenggaraAdminID: Meteor.userId()});
		if (!penyelenggara) {
			return true;
		} else {
			return false;
		}
	}
});


Template.profile.events({
	"click a.profilePict": function (e, tpl) {
		e.preventDefault();
		SetFOTO(500,500,'updateFotoMember', pictProfile(UserID()), UserID());
		$('#editYourAvatarModal').modal();
	},


	"click a.upload": function (e, tpl) {
		e.preventDefault();
		SetFOTO(700, 700, 'updateFotoBackground', pictProfileBackground(UserID()), UserID());
		$('#editYourAvatarModal').modal();
	},


	'click a.simpanPhoto': function (e, tpl) {
		let lokasi = sURL_upUser + ".upUser/pictures/memb_" + Meteor.userId() + "/member_" + Meteor.userId() + ".jpg";
		Members.update(Session.get('editedUploadId'),
			{
				$set: {
					fotoMember: lokasi,
					updateAt: new Date(),
					updateBy: profileName(),
					updateByID: Meteor.userId()
				}
			});
		Session.set('editedUploadId', null);
	},



	'click a.create': function (e, tpl) {
		e.preventDefault();
		Session.set('isCreatingProfile', true);
	},

	"click a.edit": function (e, tpl) {
		e.preventDefault();
		Session.set('editedProfileId', true);
	},

	'click a.cancel': function (e, tpl) {
		e.preventDefault();
		Session.set('isCreatingProfile', false);
		Session.set('editedProfileId', null);
		Session.set('isCommentsMessage', false);
		Session.set('editedUploadId', null);
	},
	'click a.start': function (e, tpl) {
		FlashMessages.sendInfo("Status VERIFIED AKTIF : " + this.namatravel);
		e.preventDefault();

		Profile.update(this._id, {$set: {statusPenyelenggaras: "VERIFIED AKTIF"}});
		Profile.update(this._id, {
			$addToSet: {
				statusDetail: {
					status: "VERIFIED AKTIF",
					status_By: profileName(),
					status_Byid: Meteor.userId(),
					status_createdAt: new Date(TimeSync.serverTime())
				}
			}
		});
	},
	'click a.createFollower': function (e, tpl) {
		e.preventDefault();
		Session.set('isCreatingFollower', true);
	},

	"click a.addFollower": function (e, tpl) {
		e.preventDefault();
		Session.set('isFollower', true);
		Session.set('idFollower', this._id);
	},

	'click a.end': function (e, tpl) {

		FlashMessages.sendInfo("Status VERIFIED NONAKTIF : " + this.namatravel);
		e.preventDefault();

		Profile.update(this._id, {$set: {statusPenyelenggaras: "VERIFIED NONAKTIF"}});
		Profile.update(this._id, {
			$addToSet: {
				statusDetail: {
					status: "VERIFIED NONAKTIF",
					status_By: profileName(),
					status_Byid: Meteor.userId(),
					status_createdAt: new Date(TimeSync.serverTime())
				}
			}
		});
	},

	'click a.remove': function (e, tpl) {
		e.preventDefault();
		Profile.remove(this._id);
	},

	'click a.loadmore': function (e, tpl) {
		e.preventDefault();
		incrementLimit();
	},

	"submit form.form-search": function (e, tpl) {
		e.preventDefault();
		let textSearch = tpl.$('input[name="search"]').val();
		Session.set('textSearch', textSearch);
	}
});
