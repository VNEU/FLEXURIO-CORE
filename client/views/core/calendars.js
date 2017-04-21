/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */

import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import './calendars.html';

Template.calendars.created = function () {
    Session.set('limit', 50);
    Session.set('oFILTERS', {});
    Session.set('oOPTIONS', {});
    Session.set('textSearch', '');
    subscribtion('calendars', Session.get('limit'));
    Session.set('namaHeader', 'DATA CALENDARS');
    Session.set('dataDelete', '');
    Session.set('isCreating', false);
    Session.set('isEditing', false);
    Session.set('isDeleting', false);
    Session.set('isShowEvent', false);

    this.autorun(function () {
        subscribtion('apimanager', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.calendars.onRendered(function () {
    ScrollHandler();
});

Template.calendars.rendered = function () {
    $('#calendars').fullCalendar({
        eventClick: function (calEvent, jsEvent, view) {
            Session.set('isShowEvent', true);
            Session.set('idEvent', calEvent.id);
        },
        dayClick: function (date, jsEvent, view) {
            Session.set('isCreating', true);
            Session.set('dateCreate', date.format());
        }
    });
};

Template.calendars.helpers({
    isShowEvent: function () {
        return Session.get('isShowEvent');
    },

    isLockMenu: function () {
        return isLockMenu();
    },
    sHeaderBackground: function () {
        return sHeaderBackground;
    },

    isAction: function (sTipe) {
        return isAdminActions(window.location.href, sTipe);
    },
    sTinggiPopUp: function () {
        return 0.6 * ($(window).height());
    },
    isEditing: function () {
        return Session.get('idEditing') === this._id;
    },
    isDeleting: function () {
        return Session.get('isDeleting');
    },
    isCreating: function () {
        return Session.get('isCreating');
    },
    calendars: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }
        return CALENDARS.find(
            {
                aktifYN: 1,
                $or: [
                    {startdate: {$regex: textSearch, $options: 'i'}},
                    {enddate: {$regex: textSearch, $options: 'i'}},
                    {namaevent: {$regex: textSearch, $options: 'i'}},
                    {lokasi: {$regex: textSearch, $options: 'i'}},
                    {latlokasi: {$regex: textSearch, $options: 'i'}},
                    {lnglokasi: {$regex: textSearch, $options: 'i'}},
                    {keterangan: {$regex: textSearch, $options: 'i'}},
                    {notificationdate: {$regex: textSearch, $options: 'i'}},
                    {repeatdays: {$regex: textSearch, $options: 'i'}},
                    {_id: {$regex: textSearch, $options: 'i'}},
                ]
            },
            {
                sort: {createAt: -1},
                limit: Session.get('limit')
            }
        );
    }
});

Template.calendars.events({
    'click a.ViewAgendaDay': function (e, tpl) {
        e.preventDefault();
        $('#calendars').fullCalendar('changeView', 'agendaDay');
    },
    'click a.ViewAgendaWeek': function (e, tpl) {
        e.preventDefault();
        let myEvent = {
            id: 100,
            title: "TEST BOSSS",
            start: "2017-02-06 09:00:00",
            end: "2017-02-06 15:00:00",
            allDay: false,
        };
        $('#calendars').fullCalendar('renderEvent', myEvent, true);

        $('#calendars').fullCalendar('changeView', 'agendaWeek');
    },
    'click a.ViewMonth': function (e, tpl) {
        e.preventDefault();
        $('#calendars').fullCalendar('changeView', 'month');
    },
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false);
        Session.set('isEditing', false);
        Session.set('idEditing', '');
        Session.set('isDeleting', false);
    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        deleteCALENDARS();
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        Session.set('isDeleting', true);
        Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaCALENDARS);
        Session.set('idDeleting', this._id);
    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', true);
    },
    'keyup #namaCALENDARS': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertCALENDARS(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertCALENDARS(tpl);
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        Session.set('idEditing', this._id);
    },
    'keyup #namaEditCALENDARS': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updateCALENDARS(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updateCALENDARS(tpl);
    },
    'submit form.form-comments': function (e, tpl) {
        e.preventDefault();
        let textComments = tpl.$('input[name="comments' + this._id + '"]').val();
        if (textComments.length) {
            addComments(this._id, textComments, CALENDARS);
        }
        e.target.reset();
    }


});


insertCALENDARS = function (tpl) {


    let startdateCALENDARS = tpl.$('input[name="startdateCALENDARS"]').val();

    let enddateCALENDARS = tpl.$('input[name="enddateCALENDARS"]').val();

    let namaeventCALENDARS = tpl.$('input[name="namaeventCALENDARS"]').val();

    let lokasiCALENDARS = tpl.$('input[name="lokasiCALENDARS"]').val();

    let latlokasiCALENDARS = tpl.$('input[name="latlokasiCALENDARS"]').val();

    let lnglokasiCALENDARS = tpl.$('input[name="lnglokasiCALENDARS"]').val();

    let keteranganCALENDARS = tpl.$('input[name="keteranganCALENDARS"]').val();

    let notificationdateCALENDARS = tpl.$('input[name="notificationdateCALENDARS"]').val();

    let repeatdaysCALENDARS = tpl.$('input[name="repeatdaysCALENDARS"]').val();


    if (!adaDATA(startdateCALENDARS) | !adaDATA(enddateCALENDARS) | !adaDATA(namaeventCALENDARS) | !adaDATA(lokasiCALENDARS) | !adaDATA(latlokasiCALENDARS) | !adaDATA(lnglokasiCALENDARS) | !adaDATA(keteranganCALENDARS) | !adaDATA(notificationdateCALENDARS) | !adaDATA(repeatdaysCALENDARS)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    CALENDARS.insert(
        {

            startdate: startdateCALENDARS,

            enddate: enddateCALENDARS,

            namaevent: namaeventCALENDARS,

            lokasi: lokasiCALENDARS,

            latlokasi: latlokasiCALENDARS,

            lnglokasi: lnglokasiCALENDARS,

            keterangan: keteranganCALENDARS,

            notificationdate: notificationdateCALENDARS,

            repeatdays: repeatdaysCALENDARS,

            aktifYN: 1,
            createByID: UserID(),
            createBy: UserName(),
            createAt: new Date()
        },
        function (err, id) {
            if (err) {
                FlashMessages.sendWarning('Sorry, Data could not be saved - Please repeat again.');
            } else {
                Session.set('isCreating', false);
                FlashMessages.sendSuccess('Thanks, your data is successfully saved');
            }
        }
    );
};


updateCALENDARS = function (tpl) {


    let startdateEditCALENDARS = tpl.$('input[name="startdateEditCALENDARS"]').val();

    let enddateEditCALENDARS = tpl.$('input[name="enddateEditCALENDARS"]').val();

    let namaeventEditCALENDARS = tpl.$('input[name="namaeventEditCALENDARS"]').val();

    let lokasiEditCALENDARS = tpl.$('input[name="lokasiEditCALENDARS"]').val();

    let latlokasiEditCALENDARS = tpl.$('input[name="latlokasiEditCALENDARS"]').val();

    let lnglokasiEditCALENDARS = tpl.$('input[name="lnglokasiEditCALENDARS"]').val();

    let keteranganEditCALENDARS = tpl.$('input[name="keteranganEditCALENDARS"]').val();

    let notificationdateEditCALENDARS = tpl.$('input[name="notificationdateEditCALENDARS"]').val();

    let repeatdaysEditCALENDARS = tpl.$('input[name="repeatdaysEditCALENDARS"]').val();


    if (!adaDATA(startdateEditCALENDARS) | !adaDATA(enddateEditCALENDARS) | !adaDATA(namaeventEditCALENDARS) | !adaDATA(lokasiEditCALENDARS) | !adaDATA(latlokasiEditCALENDARS) | !adaDATA(lnglokasiEditCALENDARS) | !adaDATA(keteranganEditCALENDARS) | !adaDATA(notificationdateEditCALENDARS) | !adaDATA(repeatdaysEditCALENDARS)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    CALENDARS.update({_id: Session.get('idEditing')},
        {
            $set: {

                startdate: startdateEditCALENDARS,

                enddate: enddateEditCALENDARS,

                namaevent: namaeventEditCALENDARS,

                lokasi: lokasiEditCALENDARS,

                latlokasi: latlokasiEditCALENDARS,

                lnglokasi: lnglokasiEditCALENDARS,

                keterangan: keteranganEditCALENDARS,

                notificationdate: notificationdateEditCALENDARS,

                repeatdays: repeatdaysEditCALENDARS,

                updateByID: UserID(),
                updateBy: UserName(),
                updateAt: new Date()
            }
        },
        function (err, id) {
            if (err) {
                FlashMessages.sendWarning('Sorry, Data could not be saved - Please repeat again.');
            } else {
                Session.set('idEditing', '');
                FlashMessages.sendSuccess('Thanks, your data is successfully saved');
            }
        }
    );
};

deleteCALENDARS = function () {

    if (!adaDATA(Session.get('idDeleting'))) {
        FlashMessages.sendWarning('Please select data that you want to remove . . .');
        return;
    }

    CALENDARS.update({_id: Session.get('idDeleting')},
        {
            $set: {
                aktifYN: 0,
                deleteByID: UserID(),
                deleteBy: UserName(),
                deleteAt: new Date()
            }
        },
        function (err, id) {
            if (err) {
                FlashMessages.sendWarning('Sorry, Data could not be saved - Please repeat again.');
            } else {
                Session.set('idEditing', '');
                FlashMessages.sendSuccess('Thanks, your data is successfully saved');
            }
        }
    );
};


    
