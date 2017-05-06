/**
* Created by ThinkMac on 7/26/16.
*/
import {Session} from "meteor/session";
setSESSION = function (nama, nilai) {
   if(typeof(nilai) !== "boolean"){
      var nilaiBaru = hideData(nilai, UserID());
      Session.set(nama, nilaiBaru);
   } else {
      FlashMessages.sendWarning("Error, on use boolean variable !");
      Session.set(nama, nilai);
   }
};

getSESSION = function (nama) {
   var nilai;
   if(adaDATA(Session.get(nama))) {
      nilai =  Session.get(nama);
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

isAdminActions = function(sRoute, sActions){
   let dataActions = MENUAUTH.findOne({userId:UserID(), routerMENU: sRoute, authTipe: sActions});
   if(dataActions) {
      return true;
   } else {
      return false;
   }
};

isAdmin = function (idMenu) {
   if(sURL != "http://localhost:3000/") {
      if (Roles.userIsInRole(Meteor.userId(), ['root', 'administrator'])) {
         return true;
      } else {
         if(adaDATA(MENUAUTH.findOne({userId:Meteor.userId(), idMENU:idMenu}))) {
            return true;
         } else {
            return false;
         };
      }
   } else {
      return true;
   }
};

subscribtion = function (sObject, oFilter, oOptions, iLimit) {
    return Meteor.subscribe(sObject, iLimit, oFilter, oOptions);
};

EmailUser = function () {
    return Meteor.user().emails[0].address;
};

UserName = function () {
   let user = Meteor.user();
   if(adaDATA(user)) {
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
   Session.set('UI_Width',iLebar);
   Session.set('UI_Height',iPanjang);
   Session.set('UI_Methods', sMethod);
   Session.set('UI_Foto', sPictHasil);
   Session.set('UI_ID', sIDUser);
};
pictProfileBackground = function (userId) {
   try {
      let foto = sBackground;
      let dataFoto = MEMBER.findOne({_id:userId});
      if(adaDATA(dataFoto)){
         if(dataFoto.profile.fotoBackground != undefined) {
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
      let foto = sAvatar;
      let dataFoto = MEMBER.findOne({_id:userId});
      if(adaDATA(dataFoto)){
         if(dataFoto.profile.fotoProfile != undefined) {
            foto = dataFoto.profile.fotoProfile;
         }
      }
      return foto;
   } catch (error) {
      return sAvatar;
   }
};

adaDATA = function(obj) {

    try {
        // null and undefined are "empty"
        if (obj == null) return false;
        if (obj == undefined) return false;
        if (obj == "") return false;

        // untuk boolean
        if (obj == true) return true;
        if (obj == false) return false;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return true;
        if (obj.length === 0)  return false;

        if (typeof obj == "number" && obj != 0) return true;

        // If it isn't an object at this point
        // it is empty, but it can't be anything *but* empty
        // Is it empty?  Depends on your application.
        if (typeof obj !== "object") return false;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        let hasOwnProperty = Object.prototype.hasOwnProperty;
        for (let key in obj) {
            if (hasOwnProperty.call(obj, key)) return true;
        }
        return false;
    } catch(err) {
        return false;
    }
};

insertLogs = function(kodeACTIVITYLOGS, namaACTIVITYLOGS) {
   ACTIVITYLOGS.insert({
      kodeACTIVITYLOGS: kodeACTIVITYLOGS,
      namaACTIVITYLOGS: namaACTIVITYLOGS,
      createBy: UserName(),
      createByID: Meteor.userId()
   });

};

FileReaderObject = {
   previewImage: function(file, callback){
      let reader = new FileReader();
      reader.onload = function (e) {
         // check file
         if(!_.contains(FILEUPLOAD.IMG.TYPE, file.type)){
            callback(new Meteor.Error(412, "File format not supported. Please upload .jpg or .png"));
            return;
         }
         // check size
         if(file.size > FILEUPLOAD.IMG.MAXSIZE){
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
   Session.set("reportCollectionsAll", cCollectionsInitial.find(aReportFilter,aReportOptions).fetch());
   Session.set("reportNumber", sReportNumber);
   Session.set("reportFootnote", sReportFootNote);

   Router.go("report");
};

random = function () {
   return Math.floor((Math.random() * 100) + 1);
};

SelectedTerpilih = function (elementId) {
   let elt = document.getElementById(elementId);

   if (elt.selectedIndex == -1)
   return null;

   return elt.options[elt.selectedIndex].text;
};

setKunci = function () {
   if(!adaDATA(Session.get('kunci'))) {
      let kunciUser = {};
      let dataMember = MEMBER.findOne({_id:UserID()});

      if(dataMember.tokenTemp !== undefined) {
         kunciUser.sTokenKey = dataMember.tokenTemp;
      } else {
         keluar();
         return;
      }

      if(dataMember.publicRSA !== undefined) {
         kunciUser.kunciHide = dataMember.publicRSA;
      } else {
         keluar();
         return;
      }

      if(dataMember.privateRSA !== undefined) {
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
   let kunci = Session.get('kunci');
   let kunc = new JSEncrypt({ default_key_size: 2048 });
   kunc.setKey(kunci.kunciShow);
   return kunc.decrypt(data);
}

hideData = function (data, id) {
   if (data == "") {
      return;
   }
   setKunci();
   let kunci = Session.get('kunci');
   let kunc = new JSEncrypt({ default_key_size: 2048 });
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

dateAdd = function (date, sDatePart, jumlahAdd) {
    var dateNew = new Date();
    if (sDatePart == "minutes") {
        let menitBaru = date.getMinutes() + jumlahAdd;
        dateNew = date.setMinutes(menitBaru);
    }

    if (sDatePart == "hours") {
        let menitBaru = date.getHours() + jumlahAdd;
        dateNew = date.setHours(menitBaru);
    }
    if (sDatePart == "days") {
        let hariBaru = date.getDate() + jumlahAdd;
        dateNew = date.setDate(hariBaru);
    }
    if (sDatePart == "months") {
        let bulanBaru = date.getMonth() + jumlahAdd;
        dateNew = date.setMonth(bulanBaru);
    }
    if (sDatePart == "years") {
        let tahunBaru = date.getFullYear() + jumlahAdd;
        dateNew = date.setFullYear(tahunBaru);
    }

    return new Date(dateNew);
};

isRoleAdmin = function (userId) {
   if (Roles.userIsInRole(userId, ['root', 'administrator'])) {
      return true;
   } else {
      return false;
   }
};


addTodo = function (subjectTODO, contentTODO, actionsTODO, actionsIDTODO, todotoTODO, todotoidTODO) {
   TODO.insert(
       {

          subject: subjectTODO,
          content: contentTODO,
          actions: actionsTODO,
          actionsID: actionsIDTODO,
          todoto: todotoTODO,
          todotoid: todotoidTODO,
          aktifYN: 1,
          createByID: UserID(),
          createBy: UserName(),
          createAt: new Date(),
          readYN: false
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


isLockMenu = function () {
    if (Session.get("lockMenu")) {
        return "col-md-9 col-md-offset-3";
    } else {
        return "";
    };
}