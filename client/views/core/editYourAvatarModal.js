import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import './editYourAvatarModal.html';

var x, // x position of crop image
	y, // y position of crop image
	width, // width of crop image
	height, // height of crop image
	error, //
	saveAvatarButton,
	modal,
	realImage,
	displayImage,
	isShowCropAndButton = false;

var ratioImage = '1:1';

Template.editYourAvatarModalBody.helpers({
	image: function () {
		if (Meteor.user())
			return Session.get('UI_Foto');
		else
			return sAvatar;
	},
	sLebar: function(){
		return Session.get('UI_Width');
	},
	sTinggi: function(){
		return Session.get('UI_Height');
	}

});

Template.editYourAvatarModal.rendered = function () {
	if(Session.get('UI_Width') >= Session.get('UI_Height')) {
		ratioImage = Math.ceil(Session.get('UI_Width')/Session.get('UI_Height')).toString() + ':1';
	} else {
		ratioImage = '1:' + Math.ceil(Session.get('UI_Height')/Session.get('UI_Width')).toString();
	}

	let tmpl = this;
	// cache the dom
	modal = $(tmpl.find('#editYourAvatarModal'));
	error = $(tmpl.find('.error'));
	saveAvatarButton = $(tmpl.find('#saveAvatarButton'));
	propSaveAvatarButton(false);
	realImage = tmpl.find('#realImage');
	modal.on('hide.bs.modal', function () {
		clear();
	});
	modal.on('show.bs.modal', function () {
		loadImage(tmpl, Session.get('UI_Foto'));
		$(function () {
			displayImage.imgAreaSelect({
				aspectRatio: ratioImage, handles: true,
				fadeSpeed: 200, onSelectChange: preview, parent: $('.modal-content')
			});
		});
	});
};

Template.editYourAvatarModalBody.rendered = function () {
	if(Session.get('UI_Width') >= Session.get('UI_Height')) {
		ratioImage = '1:' + Math.ceil(Session.get('UI_Width')/Session.get('UI_Height')).toString();
	} else {
		ratioImage = Math.ceil(Session.get('UI_Height')/Session.get('UI_Width')).toString() + ':1';
	}

	displayImage = $(this.find('#avatarUserImg'));
	$(function () {
		displayImage.imgAreaSelect({
			aspectRatio: ratioImage, handles: true,
			fadeSpeed: 200, onSelectChange: preview
		});
	});
};

Template.editYourAvatarModalBody.events({
	"change input[name=avatarFile]": function (evt, tmpl) {
		evt.preventDefault();
		let input = tmpl.find('input[name=avatarFile]');
		if (input.files && input.files[0]) {
			FileReaderObject.previewImage(input.files[0], function (err, file) {
				if (err) {
					error.html(createAlertDanger(err.message));
					Meteor.setTimeout(function () {
						error.html('');
					}, 5000);
				}
				else {
					loadImage(tmpl, file.result);
					$(function () {
						displayImage.imgAreaSelect({
							aspectRatio: ratioImage, handles: true,
							fadeSpeed: 200, onSelectChange: preview
						});
					});
				}
			});
		}
	},
	'click #changeAvatarButton': function (evt, tmp) {
		evt.preventDefault();
		tmp.find('input[name=avatarFile]').click();
	}
});
Template.editYourAvatarModal.events({
	'click #changeAvatarButton': function (evt, tmp) {
		evt.preventDefault();
		tmp.find('input[name=avatarFile]').click();
	},
	'click #saveAvatarButton': function (evt, tmp) {
		evt.preventDefault();
		processChangeAvatar(tmp);
	},
	'keypress': function (evt, tmp) {
		if (evt.charCode == 13) {
			evt.preventDefault();
			modal.modal('hide');
		}
	}
});
/**
 * FUNCTION CLASS DEFINE
 */
var processChangeAvatar = function (tmp) {
	let canvas = document.createElement("canvas");
	canvas.width = Session.get('UI_Width');
	canvas.height = Session.get('UI_Height');
	let scaleX = realImage.width / displayImage.width();
	let scaleY = realImage.height / displayImage.height();
	let ctx = canvas.getContext("2d");
	ctx.drawImage(realImage, x * scaleX, y * scaleY, width * scaleX, height * scaleY, 0, 0, Session.get('UI_Width'), Session.get('UI_Height'));

	let sMethods = Session.get('UI_Methods');

	Meteor.call(sMethods, canvas.toDataURL(), Session.get("UI_ID"), function (err, res) {
		if (err) {
			error.html(createAlertDanger(err.message));
			Meteor.setTimeout(function () {
				error.html('');
			}, 5000);
		}
		else {
			modal.modal('hide');
		}
	});
};

function preview(img, selection) {
	if (!selection.width || !selection.height)
		return;
	let scaleX = Session.get('UI_Width') / selection.width;
	let scaleY = Session.get('UI_Height') / selection.height;
	$('#preview img').css({
		width: Math.round(scaleX * img.width),
		height: Math.round(scaleY * img.height),
		marginLeft: -Math.round(scaleX * selection.x1),
		marginTop: -Math.round(scaleY * selection.y1)
	});
	x = selection.x1;
	y = selection.y1;
	width = selection.width;
	height = selection.height;
	if (!isShowCropAndButton) {
		open();
	}
};
function propSaveAvatarButton(bool) {
	if (saveAvatarButton) {
		saveAvatarButton.prop('disabled', !bool);
	}
};
function loadImage(tmp, src) {
	$(tmp.find('#avatarUserImg')).attr('src', src);
	$(tmp.find('#preview img')).attr('src', src);
	$(tmp.find('#realImage')).attr('src', src);
};
function open() {
	propSaveAvatarButton(true);
	$('#previewFrame').removeClass('hide');
	isShowCropAndButton = true;
};
function clear() {
	// hide crop area
	$('.imgareaselect-border1').parent().hide();
	$('.imgareaselect-outer').hide();
	isShowCropAndButton = false;
	$('#previewFrame').addClass('hide');
	// reset input
	//http://stackoverflow.com/questions/16452699/how-to-reset-a-form-using-jquery-with-reset-method
	let inputAvatar = $('input[name=avatarFile]');
	inputAvatar.wrap('<form>').closest('form').get(0).reset();
	inputAvatar.unwrap();
};

/**
 * =====================================================================================================================
 * AVATAR DEFAULT BASE64
 */
AVATAR = "data:image/jpeg;base64,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";
FILEUPLOAD = {
    IMG : {  TYPE: ["image/jpeg", "image/png"], MAXSIZE: 512000  },// 512 kb
    DOC : []
};
validateImgBase64 = function(src){
    if(!/^data:image\/png;base64,/i.test(src)){
        throw new Error("Image is not decode 1");
    }
    return true;
};
createAlert = {
    'error' : function(message) {
        return '<div class="alert alert-danger">' + message + '</div>';
    },
    'success' : function(message) {
        return '<div class="alert alert-success">' + message + '</div>';
    },
    'alert' : function(message) {
        return '<div class="alert alert-warning">' + message + '</div>';
    },
    'info' : function(message) {
        return '<div class="alert alert-info">' + message + '</div>';
    },
    'default' : function(message) {
        return '<div class="alert">' + message + '</div>';
    }
};
createAlertDanger = function(message) {
    return createAlert['error'](message);
};
createAlertSuccess = function(message) {
    return createAlert['success'](message);
};
createAlertInfo = function(message){
    return createAlert['info'](message);
};

/*
 * =====================================================================================================================
 */
