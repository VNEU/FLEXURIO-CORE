/**
 * Created by ThinkMac on 2/13/16.
 */
 import { Template } from 'meteor/templating';
 import { Session } from 'meteor/session';
 import './loading.html';


Template.loading.rendered = function () {
	if ( ! Session.get('loadingSplash') ) {
		Session.set('loadingSplash', true); // just show loading splash once
	}
};

Template.loading.destroyed = function () {
	if ( this.loading ) {
		this.loading.finish();
	}
};

var message = '<p class="loading-message">Loading Message</p>';
var spinner = '<div class="sk-spinner sk-spinner-rotating-plane"></div>';
