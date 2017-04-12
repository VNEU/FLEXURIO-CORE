/**
 * Flexurio Created by YN.Pamungkas Jayuda on 12/3/15.
 */
import {Mongo} from 'meteor/mongo';

MENU = new Mongo.Collection('menu');
MENUGROUP = new Mongo.Collection('menuGroup');
MENUAUTH = new Mongo.Collection('menuAuth');
MEMBER = Meteor.users;
TODO = new Mongo.Collection('todo');
MESSAGE = new Mongo.Collection('message');
MESSAGEMEMBER = new Mongo.Collection('messageMember');

ACTIVITYLOGS = new Mongo.Collection('activitylogs');
PROFILEDATA = new Mongo.Collection('profileData');
NEGARA = new Mongo.Collection('negara');
PROVINSI = new Mongo.Collection('provinsi');
KABUPATEN = new Mongo.Collection('kabupaten');
KECAMATAN = new Mongo.Collection('kecamatan');
KELURAHAN = new Mongo.Collection('kelurahan');
WOTIPE = new Mongo.Collection('woTipe');
WOSUBTIPE = new Mongo.Collection('woSubTipe');
WOSUBTIPEDETAIL = new Mongo.Collection('woSubTipeDetail');
WO = new Mongo.Collection('wo');
APIMANAGER = new Mongo.Collection('apimanager');
CALENDARS = new Mongo.Collection('calendar');
