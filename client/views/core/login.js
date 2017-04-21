/**
* Created by ThinkMac on 8/11/16.
*/

import { Session } from 'meteor/session';
import './login.html';
import { Template } from 'meteor/templating';

pasangkunc = function () {
	Meteor.call('cariKunci');
};

Template.login.created = function(){
	Session.set("isLogin", true);
};

Template.login.helpers({
	sHeaderBackground: function () {
		return sHeaderBackground;
    },
	isLogin: function(){
		return Session.get("isLogin");
	}
});

Template.login.events({
	'click a.registerLogin': function (e, tpl) {
		e.preventDefault();
		Session.set("isLogin", true);
	},
	'click a.registerForm': function (e, tpl) {
		e.preventDefault();
		Session.set("isLogin", false);
	},
	'click a#loginGoogle': function (e, t) {
		e.preventDefault();
		Session.set('isPROSES', true);
		Meteor.loginWithGoogle(
			{
				requestPermissions: [
					'https://picasaweb.google.com/data/',
					'https://www.googleapis.com/auth/userinfo.email',
					'https://www.googleapis.com/auth/userinfo.profile',
					'https://www.googleapis.com/auth/plus.me'
				],
				requestOfflineToken: 'true'
			},function(error) {
				if (error) {
				}else{
					pasangkunc();
					Router.go('/')
				}
			}
		);
	},
	'click #loginFacebook': function (event) {
		Session.set('isPROSES', true);
		Meteor.loginWithFacebook({}, function (err) {
			if (err) {
				throw new Meteor.Error("Facebook login failed");
			} else {
				pasangkunc();
				Router.go('/')
			}
		});
	},
	'submit form.register-server': function (e, tpl) {
		e.preventDefault();
		Session.set('isPROSES', true);

		let textFirstName = tpl.$('input[name=textFirstName]').val();
		let textLastName = tpl.$('input[name=textLastName]').val();
		let textEmail = tpl.$('input[name=textEmail]').val();
		let textPassword = tpl.$('input[name=textPassword]').val();
		let textPasswordRetype = tpl.$('input[name=textPasswordRetype]').val();

		if (textPassword != textPasswordRetype) {
			FlashMessages.sendWarning('Sorry, Please retype your password corectlly !');
			return;
		}

		Accounts.createUser(
			{
				password: textPassword,
				email: textEmail,
				profile: {
					name:textFirstName + ' ' + textLastName,
					firstName: textFirstName,
					lastName: textLastName
				}
			}, function (err) {
				if (err) {
					FlashMessages.sendWarning('Register failed, Please try again');
				} else {
					pasangkunc();
					Router.go('/')
					FlashMessages.sendSuccess('Hello ' + UserName() + ', Wellcome to ' + sAPPName);
				}
			});
		},
		'submit form.login-server': function (e, tpl) {
			e.preventDefault();
			let textEmail = tpl.$('input[name=username]').val();
			let textPassword = tpl.$('input[name=password]').val();

			Meteor.loginWithPassword(textEmail, textPassword, function (err) {
				if (err) {
					FlashMessages.sendWarning('Sorry, your username or password not valid !');
				} else {
					FlashMessages.sendSuccess('Hello ' + UserName() + ', Wellcome to ' + sAPPName);
					pasangkunc();
					Router.go('/');
				}
			});
		}
	}
);
