/**
 * Created by ThinkMac on 10/21/15.
 */

 import { Template } from 'meteor/templating';
 import { Session } from 'meteor/session';
 import './utama.html';

Template.utama.created = function () {
    if (!Meteor.userId()) {
        Router.go('/oraono');
    }

};
