/**
 * Created by MacBookPro on 9/10/15.
 */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { flashMessages } from 'meteor/mrt:flash-messages';
import './home.html';

Template.header.helpers({
    namaApp: function () {
        return sAPPName;
    }
});

Template.home.helpers({
  dataCircle: function () {
    var data = [
            {
                value: 340,
                color: "RED",
                highlight: "#FF5A5E",
                label: "Red"
            },
            {
                value: 210,
                color: "YELLOW",
                highlight: "#A8B3C5",
                label: "Grey"
            }, {
                value: 710,
                color: "GREEN",
                highlight: "#616774",
                label: "Dark Grey"
            }];

            return data;
  }
});

Template.login.helpers({
    namaApp: function () {
        return sAPPName;
    },
    sHeaderBackground: function () {
        return sHeaderBackground;
    }
});
