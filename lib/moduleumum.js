/**
 * Created by ThinkMac on 7/26/16.
 */
import {Session} from "meteor/session";
setSESSION = function (nama, nilai) {
    if (typeof(nilai) !== "boolean") {
        var nilaiBaru = hideData(nilai, UserID());
        Session.set(nama, nilaiBaru);
    } else {
        FlashMessages.sendWarning("Error, on use boolean variable !");
        Session.set(nama, nilai);
    }
};

getSESSION = function (nama) {
    var nilai;
    if (adaDATA(Session.get(nama))) {
        nilai = Session.get(nama);
        var nilaiBaru;
        nilaiBaru = showData(nilai, UserID());
    } else {
        nilaiBaru = "";
    }
    return nilaiBaru;
};

setBOOLEAN = function (nama, nilai) {
    Session.set(nama, nilai);
};

getBOOLEAN = function (nama) {
    return Session.get(nama);
};

incrementLimit = function () {
    var newLimit = Session.get('limit') + 5;
    Session.set('limit', newLimit);
};

getRoute = function (sURLNow) {
    var sRoute = sURLNow.replace(sURL, '').replace("#", '').replace('!', '');
    return sRoute;
};

isAdminActions = function (sRoute, sActions) {
    var dataActions = MENUAUTH.findOne({userId: UserID(), routerMENU: sRoute, authTipe: sActions});
    if (dataActions) {
        return true;
    } else {
        return false;
    }
};

isAdmin = function (idMenu) {
    if (adaDATA(MENUAUTH.findOne({userId: Meteor.userId(), idMENU: idMenu}))) {
        return true;
    } else {
        return false;
    }
};

subscribtion = function (sObject, oFilter, oOptions, iLimit) {
    return Meteor.subscribe(sObject, iLimit, oFilter, oOptions);
};

EmailUser = function () {
    return Meteor.user().emails[0].address;
};

UserName = function () {
    var user = Meteor.user();
    if (adaDATA(user)) {
        return user.profile.name;
    } else {
        return "";
    }
};
UserID = function () {
    return Meteor.userId();
};

ScrollHandler = function (sObject, oFilter, oOptions) {
    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
            incrementLimit();
        }
    });
};


Scroll2Top = function () {
    $("html, body").animate({
        scrollTop: 0
    }, 600);
};

uploadFotoMember = function (idMember) {
    return {
        id: "member_" + idMember,
        directory: "pictures/memb_" + idMember,
        namefile: "member_" + idMember + ".jpg"
    }
};

SetFOTO = function (iPanjang, iLebar, sMethod, sPictHasil, sIDUser) {
    Session.set('UI_Width', iLebar);
    Session.set('UI_Height', iPanjang);
    Session.set('UI_Methods', sMethod);
    Session.set('UI_Foto', sPictHasil);
    Session.set('UI_ID', sIDUser);
};
pictProfileBackground = function (userId) {
    try {
        var foto = sBackground;
        var dataFoto = MEMBER.findOne({_id: userId});
        if (adaDATA(dataFoto)) {
            if (dataFoto.profile.fotoBackground != undefined) {
                foto = dataFoto.profile.fotoBackground;
            }
        }
        return foto;
    } catch (error) {
        return sBackground;
    }
};

pictProfile = function (userId) {
    try {
        var foto = sAvatar;
        var dataFoto = MEMBER.findOne({_id: userId});
        if (adaDATA(dataFoto)) {
            if (dataFoto.profile.fotoProfile != undefined) {
                foto = dataFoto.profile.fotoProfile;
            }
        }
        return foto;
    } catch (error) {
        return sAvatar;
    }
};


insertLogs = function (kodeACTIVITYLOGS, namaACTIVITYLOGS) {
    ACTIVITYLOGS.insert({
        kodeACTIVITYLOGS: kodeACTIVITYLOGS,
        namaACTIVITYLOGS: namaACTIVITYLOGS,
        createBy: UserName(),
        createByID: Meteor.userId()
    });
    FlashMessages.sendSuccess(namaACTIVITYLOGS);

};

FileReaderObject = {
    previewImage: function (file, callback) {
        var reader = new FileReader();
        reader.onload = function (e) {
            // check file
            if (!_.contains(FILEUPLOAD.IMG.TYPE, file.type)) {
                callback(new Meteor.Error(412, "File format not supported. Please upload .jpg or .png"));
                return;
            }
            // check size
            if (file.size > FILEUPLOAD.IMG.MAXSIZE) {
                callback(new Meteor.Error(412, "File is too large. 512kb size limit"));
                return;
            }
            file.result = e.target.result;
            callback(null, file);
        };
        reader.onerror = function () {
            callback(reader.error);
        };
        reader.readAsDataURL(file);
    }
};

setREPORT = function (sReportName, sReportNumber, sReportFootNote, sCollections, sBackUrl, cCollectionsInitial, aReportFilter, aReportOptions, oReportFieldDisplay) {
    Session.set("reportNama", sReportName);
    Session.set("reportKolom", oReportFieldDisplay);
    Session.set("reportCollections", sCollections);
    Session.set("reportBackUrl", sBackUrl);
    Session.set("reportCollectionsAll", cCollectionsInitial.find(aReportFilter, aReportOptions).fetch());
    Session.set("reportNumber", sReportNumber);
    Session.set("reportFootnote", sReportFootNote);

    Router.go("report");
};


SelectedTerpilih = function (elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
};

setKunci = function () {
    if (!adaDATA(Session.get('kunci'))) {
        var kunciUser = {};
        var dataMember = MEMBER.findOne({_id: UserID()});

        if (dataMember.tokenTemp !== undefined) {
            kunciUser.sTokenKey = dataMember.tokenTemp;
        } else {
            keluar();
            return;
        }

        if (dataMember.publicRSA !== undefined) {
            kunciUser.kunciHide = dataMember.publicRSA;
        } else {
            keluar();
            return;
        }

        if (dataMember.privateRSA !== undefined) {
            kunciUser.kunciShow = dataMember.privateRSA;
        } else {
            keluar();
            return;
        }
        Session.set('kunci', kunciUser);
    }
};

showData = function (data, id) {
    if (data == "") {
        return;
    }
    setKunci();
    var kunci = Session.get('kunci');
    var kunc = new JSEncrypt({default_key_size: 2048});
    kunc.setKey(kunci.kunciShow);
    return kunc.decrypt(data);
}

hideData = function (data, id) {
    if (data == "") {
        return;
    }
    setKunci();
    var kunci = Session.get('kunci');
    var kunc = new JSEncrypt({default_key_size: 2048});
    kunc.setKey(kunci.kunciHide);
    return kunc.encrypt(data);
}

keluar = function () {
    Meteor.call('resetKunci');
    Meteor.logout(function () {
        Session.set("isLogin", true);
        FlashMessages.sendError("Your RSA Key not Set, please contact systems administrator !");
        Router.go("home");
    });
};


isRoleAdmin = function (userId) {
    if (Roles.userIsInRole(userId, ['root', 'administrator'])) {
        return true;
    } else {
        return false;
    }
};


isLockMenu = function () {
    if (Session.get("lockMenu")) {
        return "col-md-9 col-md-offset-3";
    } else {
        return "col-md-12 col-md-offset-0";
    }
    ;
};

