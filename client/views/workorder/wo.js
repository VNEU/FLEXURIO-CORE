/**
 * Generated from flexurio tools
 * Flexurio By Pamungkas Jayuda yulius.jayuda@gmail.com / +628119003077
 */


import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./wo.html";

Template.wo.created = function () {
    Session.set('limit', 50); Session.set('oFILTERS', {}); Session.set('oOPTIONS', {});
    Session.set('namaHeader', 'WORK ORDER');
    Session.set('dataDelete', '');
    Session.set('isCreating', false); Session.set('isEditing', false);
    Session.set('isDeleting', false);
    Session.set('idSignTo', "");

    subscribtion('woTipe', {aktifYN: 1}, {}, 0);
    subscribtion('woSubTipe', {aktifYN: 1}, {}, 0);
    subscribtion('woSubTipeDetail', {aktifYN: 1}, {}, 0);

    this.autorun(function () {
        subscribtion('wo', Session.get('oFILTERS'), Session.get('oOPTIONS'), Session.get('limit'));
    });
};

Template.wo.onRendered(function () {
    ScrollHandler();
});


Template.wo.helpers({
    isLockMenu: function () {
        return isLockMenu();
    },

    isStop: function () {
        if (this.status !== "FINISH") {
            if (this.status === "START") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    isPlay: function () {
        if (this.status !== "FINISH") {
            return this.signToID === UserID() | isRoleAdmin(UserID());
        } else {
            return false;
        }
    },
    members: function () {
        return MEMBER.find({}, {sort: {'profile.name': 1}})
    },
    subTipeWODetailDATA: function () {
        return WOSUBTIPEDETAIL.find({kodeWOSUBTIPE: Session.get("subTipeWO"), aktifYN: 1}, {sort: {namaWOSUBTIPEDETAIL: 1}});
    },
    subTipeWODATA: function () {
        return WOSUBTIPE.find({kodeWOTIPE: Session.get("tipeWOID"), aktifYN: 1}, {sort: {namaWOSUBTIPE: 1}});
    },
    woTipeDATA: function () {
        return WOTIPE.find({aktifYN: 1}, {sort: {namaWOTIPE: 1}});
    },
    isSignTo: function () {
        return Session.get('isSignTo');
    },
    isEditing: function () {
        if (this.status !== "FINISH") {
            return Session.get('idEditing') === this._id;
        } else {
            return false;
        }
    },
    isDeleting: function () {
        if (this.status !== "FINISH") {
            return Session.get('isDeleting');
        } else {
            return false;
        }
    },
    isCreating: function () {
        return Session.get('isCreating');
    },
    wos: function () {
        let textSearch = '';
        if (adaDATA(Session.get('textSearch'))) {
            textSearch = Session.get('textSearch').replace('#', '').trim();
        }

        let oFILTERS = {
            $or: [
                {namaWO: {$regex: textSearch, $options: 'i'}},
                {tipeWO: {$regex: textSearch, $options: 'i'}},
                {detailTipeWO: {$regex: textSearch, $options: 'i'}},
                {keteranganWO: {$regex: textSearch, $options: 'i'}},
                {createBy: {$regex: textSearch, $options: 'i'}},
                {tipeWO: {$regex: textSearch, $options: 'i'}},
                {_id: {$regex: textSearch, $options: 'i'}},
                {status: {$regex: textSearch, $options: 'i'}},
                {signTo: {$regex: textSearch, $options: 'i'}}
            ],
            aktifYN: 1
        };

        if (!isRoleAdmin(UserID())) {
            oFILTERS.createByID = UserID();
        }

        let oOPTIONS = {
            sort: {createAt: -1},
            limit: Session.get('limit')
        };

        Session.set('oOPTIONS', oOPTIONS);
        Session.set('oFILTERS', oFILTERS);
        return WO.find(
            oFILTERS,
            oOPTIONS
        );
    }
});

Template.wo.events({
    'click a.report': function (e, tpl) {
        e.preventDefault();

        if (this.status !== "FINISH") {
            let sReportName = this.namaWO;
            let sReportNumber = this.tipeWO + ' - ' + this.subTipeWO;
            let sReportFootNote = this.createBy + '<BR>' + this.createAt;
            let sCollections = "wo";
            let sBackUrl = "wo";
            let cCollectionsInitial = WO;
            let aReportFilter = {aktifYN: 1, _id: this._id};
            let aReportOptions = {
                fields: {
                    keteranganWO: 1
                }
            };
            let oReportFieldDisplay = [
                {"NAMA": this.detailTipeWO, "fields": "keteranganWO"}
            ];

            setREPORT(sReportName, sReportNumber, sReportFootNote, sCollections, sBackUrl, cCollectionsInitial, aReportFilter, aReportOptions, oReportFieldDisplay);
        } else {
            FlashMessages.sendWarning('Attention, This WO has been FINISH !');
        }
    },
    'change #subTipeWO': function (e, tpl) {
        e.preventDefault();
        let ID_tipeWODipilih = tpl.$('select[name="subTipeWO"]').val();
        Session.set("subTipeWO", ID_tipeWODipilih);
    },
    'change #tipeWO': function (e, tpl) {
        e.preventDefault();
        let ID_tipeWODipilih = tpl.$('select[name="tipeWO"]').val();
        Session.set("tipeWOID", ID_tipeWODipilih);
    },
    'click a.cancel': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', false); Session.set('isEditing', false);
        Session.set('idEditing', '');
        Session.set('isDeleting', false);
        Session.set('idSignTo', null);
        Session.set('isSignTo', false);
    },

    'click a.deleteDataOK': function (e, tpl) {
        e.preventDefault();
        deleteWO();
        FlashMessages.sendWarning('Attention, ' + Session.get('dataDelete') + ' successfully DELETE !');
        Session.set('isDeleting', false);
    },
    'click a.deleteData': function (e, tpl) {
        e.preventDefault();
        if (this.status !== "FINISH") {
            Session.set('isDeleting', true);
            Session.set('dataDelete', Session.get('namaHeader').toLowerCase() + ' ' + this.namaWO);
            Session.set('idDeleting', this._id);
        } else {
            FlashMessages.sendWarning('Attention, This WO has been FINISH !');
        }
    },

    'click a.signTo': function (e, tpl) {
        e.preventDefault();

        if (this.status !== "FINISH") {
            Session.set('idSignTo', this._id);
            Session.set('isSignTo', true);
        } else {
            FlashMessages.sendWarning('Attention, This WO has been FINISH !');
        }

    },

    'click a.create': function (e, tpl) {
        e.preventDefault();
        Session.set('isCreating', true);
    },
    'keyup #namaWO': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            insertWO(tpl);
        }
    },
    'click a.save': function (e, tpl) {
        e.preventDefault();
        insertWO(tpl);
    },

    'click a.saveSignTo': function (e, tpl) {
        e.preventDefault();
        updatePIC(tpl);
    },

    'click a.editData': function (e, tpl) {
        e.preventDefault();
        if (this.status !== "FINISH") {
            Session.set('idEditing', this._id);
        } else {
            FlashMessages.sendWarning('Attention, This WO has been FINISH !');
        }
    },
    'keyup #namaEditWO': function (e, tpl) {
        e.preventDefault();
        if (e.keyCode == 13) {
            updateWO(tpl);
        }
    },
    'click a.saveEDIT': function (e, tpl) {
        e.preventDefault();
        updateWO(tpl);
    },
    "submit form.form-comments": function (e, tpl) {
        e.preventDefault();
        let textComments = tpl.$('input[name="comments' + this._id + '"]').val();
        if (textComments.length) {
            addComments(this._id, textComments, WO);
        }
        e.target.reset();
    },
    'click a.play': function (e, tpl) {
        e.preventDefault();
        WO.update({_id: this._id},
            {
                $set: {
                    status: "START",
                    statusBy: UserName(),
                    statusByID: UserID()
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

    },
    'click a.stop': function (e, tpl) {
        e.preventDefault();
        WO.update({_id: this._id},
            {
                $set: {
                    status: "FINISH",
                    statusBy: UserName(),
                    statusByID: UserID()
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

    }


});


insertWO = function (tpl) {

    let namaWO = tpl.$('input[name="namaWO"]').val();
    let tipeWO = SelectedTerpilih("tipeWO");
    let subTipeWO = SelectedTerpilih("subTipeWO");
    let detailTipeWO = SelectedTerpilih("detailTipeWO");
    let keteranganWO = tpl.$('textarea[name="keteranganWO"]').val();

    if (!adaDATA(namaWO) | !adaDATA(tipeWO) | !adaDATA(subTipeWO) | !adaDATA(detailTipeWO) | !adaDATA(keteranganWO)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    WO.insert(
        {
            namaWO: namaWO,
            tipeWO: tipeWO,
            subTipeWO: subTipeWO,
            detailTipeWO: detailTipeWO,
            keteranganWO: keteranganWO,
            aktifYN: 1,
            status: "INPUT",

            signByID: "-",
            signBy: "-",
            signAt: "-",
            signTo: "-",

            closeByID: "-",
            closeBy: "-",
            closeAt: "-",

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


updatePIC = function (tpl) {

    let id = tpl.$('select[name="signTo"]').val();
    let nama = SelectedTerpilih("signTo");

    if (!adaDATA(nama)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    } else {
        let nama = MEMBER.findOne({_id: id}).profile.name;
    }

    WO.update({_id: Session.get('idSignTo')},
        {
            $set: {
                signByID: UserID(),
                signBy: UserName(),
                signAt: new Date(),
                signTo: nama,
                status: "SIGN PIC",
                signToID: id,
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


    addTodo(
        "SIGN PIC WO",
        "Hello " + nama + ", Anda telah di minta menjadi PIC untuk Pekerjaan baru. Mohon lihat WO Menu",

        sURL + "wo",
        Session.get('idSignTo'),

        nama,
        id);


    Session.set('idSignTo', null);
    Session.set('isSignTo', false);

};


updateWO = function (tpl) {

    let keteranganWO = tpl.$('input[name="keteranganEditWO"]').val();

    if (!adaDATA(keteranganWO)) {
        FlashMessages.sendWarning('Please complete all of the data to be . . .');
        return;
    }

    WO.update({_id: Session.get('idEditing')},
        {
            $set: {
                keteranganWO: keteranganWO
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

deleteWO = function () {

    if (!adaDATA(Session.get('idDeleting'))) {
        FlashMessages.sendWarning('Please select data that you want to remove . . .');
        return;
    }

    WO.update({_id: Session.get('idDeleting')},
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