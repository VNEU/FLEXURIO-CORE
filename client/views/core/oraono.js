import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import './oraono.html';

Template.oraono.helpers({
  pictBackground: function () {
    return sBackground;
  },
  sAvatar: function () {
    return sAvatar;
  }
});
