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

Template.login.helpers({
    namaApp: function () {
        return sAPPName;
    },
    sHeaderBackground: function () {
        return sHeaderBackground;
    }
});
