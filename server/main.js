import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	Accounts.loginServiceConfiguration.remove({
		service: "google"
	});
	Accounts.loginServiceConfiguration.insert({
		service: "google",
		clientId: google.clientId,
		secret: google.clientSecret
	});

	ServiceConfiguration.configurations.remove({
		service: 'facebook'
	});
	ServiceConfiguration.configurations.insert({
		service: 'facebook',
		appId: facebook.appId,
		secret: facebook.secret
	});

});
