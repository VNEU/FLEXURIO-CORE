import {Accounts} from "meteor/accounts-base";
import {Session} from "meteor/session";

Meteor.methods({
	createUserNew: function (nama, email, password) {
		if (Roles.userIsInRole(this.userId, ['root', 'administrator', 'admin'])) {
			if (Meteor.users.find({username: email}).count() === 0) {
				Accounts.createUser({
					email: email,
					password: password,
					profile: {
						name: nama,
						createAt: new Date(),
						updateAt: new Date(),
						verification: "1"
					}
				});
			}
		}
	},
	deleteUser: function (_id) {
		if (Roles.userIsInRole(this.userId, ['root', 'administrator', 'admin'])) {
			Meteor.users.remove(_id);
		}
	},
    updateUserData: function (_id, emailNew, passwordNew) {
        if (emailNew !== "") {
            if (adaDATA(MEMBER.findOne({_id: _id}).emails)) {
                Accounts.removeEmail(_id, MEMBER.findOne({_id: _id}).emails[0].address);
            }
            Accounts.addEmail(_id, emailNew);
        }
        if (passwordNew !== "") {
            Accounts.setPassword(_id, passwordNew);
        }
    },
	updateFotoMember: function (oDataFoto, idSelector) {
		if (!this.userId) {
			throw new Meteor.Error(403, "You must be logged in");
		}

		try {
			if (!/^data:image\/png;base64,/i.test(oDataFoto)) {
				return false;
			}

			return MEMBER.update(
				{_id: idSelector},
				{
					$set: {
						'profile.fotoProfile': oDataFoto
					}
				}
			);
		}
		catch (e) {
			throw new Meteor.Error(403, e.message);
		}
		return true;
	},

	updateFotoBackground: function (oDataFoto, idSelector) {
		try {
			return MEMBER.update(
				{_id: idSelector},
				{$set: {'profile.fotoBackground': oDataFoto}}
			);
		} catch (e) {
			throw new Meteor.Error(403, e.message);
		}
	},
	cariKunci: function () {
		let sTokenKey = DATATOKEN.findOne().sTokenKey;
		MEMBER.update(
			{_id:this.userId},
			{
				$set:{
						tokenTemp:sTokenKey
				}
			}
		);
	},
	resetKunci: function () {
		MEMBER.update(
			{_id:this.userId},
			{
				$set:{
						tokenTemp:""
				}
			}
		);
	},

    updatePassUser: function (_id, passwordNew) {
        if (passwordNew !== "") {
            Accounts.setPassword(_id, passwordNew);
        }
    },
    badgeData: function (sRouter) {
        var qty = countBadge(sRouter);
        if(parseInt(qty) > 0) {
            return  qty;
        } else {
            return  "";
        }
    },


});

setToken = function (idUser) {
	sTokenKey = DATATOKEN.findOne().sTokenKey;
	return sTokenKey;
};
