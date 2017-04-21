/**
* Created by ThinkMac on 7/27/16.
*/
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./menuFab.html";

Template.footNoteReport.helpers({
	sHeaderBackground: function () {
		return sGeneralFontBackground;
	},
	sGeneralFont: function () {
		return sHeaderBackground;
	},
	isSearch: function () {
		return Session.get('isSearch');
	},
	sHeaderBackground: function () {
		return sHeaderBackground;
	},
	datePrint: function () {
		let date = new Date().toString();
		return date;
	},
	username: function () {
		return UserName();
	}

});

Template.menuDownload.helpers({
    sGeneralFontBackground: function () {
		return sGeneralFontBackground;
	},
	sGeneralFont: function () {
		return sHeaderBackground;
	},
	isSearch: function () {
		return Session.get('isSearch');
	},
	sHeaderBackground: function () {
		return sHeaderBackground;
	}

});

Template.menuPrint.helpers({
    sGeneralFontBackground: function () {
        return sGeneralFontBackground;
    },
    sGeneralFont: function () {
        return sGeneralFont;
    },
    sHeaderBackground: function () {
        return sHeaderBackground;
    },
    isSearch: function () {
        return Session.get('isSearch');
    }
});
Template.member.events({
	'click a.upload': function (e, tpl) {
		e.preventDefault();
		Session.set("isUpload", true);
	},
	'click a.cancel': function (e, tpl) {
		e.preventDefault();
		Session.set("isUpload", false);
	},
	'click a.saveUpload': function (e, tpl) {
		e.preventDefault();
		let file = document.getElementById('uploadCSV').files[0];
		readFile(file, function(content) {
			let dataCSV = JSON.parse(csv2json(content));
			let beda = cekKolom(getKeys(MEMBER.findOne()), getKeys(dataCSV[0]));
			if(adaDATA(beda)){
				FlashMessages.sendWarning("Please include column " + JSON.stringify(beda) + " corectlly field like this : " + JSON.stringify(getKeys(MEMBER.findOne())));
				return;
			} else {
				//insert to collections
			}
		});
	}
});
Template.menuUpload.helpers({
	isUpload: function () {
		return Session.get("isUpload");
	},
    sGeneralFontBackground: function () {
		return sGeneralFontBackground;
	},
	sGeneralFont: function () {
		return sHeaderBackground;
	},
	isSearch: function () {
		return Session.get('isSearch');
	},
	sHeaderBackground: function () {
		return sHeaderBackground;
	}
});


Template.menuSearch.helpers({
    sGeneralFontBackground: function () {
        return sGeneralFontBackground;
    },

	sGeneralFont: function () {
		return sHeaderBackground;
	},
	isSearch: function () {
		return Session.get('isSearch');
	},
	sHeaderBackground: function () {
		return sHeaderBackground;
	}

});

Template.menuSearch.events({
	'click a.searchBtn': function (e, tpl) {
		e.preventDefault();
		Session.set('isSearch', true);
	},
	'keyup #searchBox': function (e, tpl) {
		e.preventDefault();
		if (e.keyCode == 27) {
			Session.set('isSearch', false);
		} else {
			let textSearch = tpl.$('input[name="searchBox"]').val();
			Session.set('textSearch', textSearch);
		}
	}
});


Template.menuSearch.created = function () {
	Session.set('isSearch', false);
};

Template.menuReport.helpers({
    sGeneralFontBackground: function () {
        return sGeneralFontBackground;
    },
    sGeneralFont: function () {
        return sGeneralFont;
    },
    sHeaderBackground: function () {
        return sHeaderBackground;
    },
    isSearch: function () {
        return Session.get('isSearch');
    }
});


Template.menuLoadMore.helpers({
    sGeneralFontBackground: function () {
        return sGeneralFontBackground;
    },
    sGeneralFont: function () {
        return sGeneralFont;
    },
    sHeaderBackground: function () {
        return sHeaderBackground;
    },
    isSearch: function () {
        return Session.get('isSearch');
    }
});


Template.menuBack.helpers({
    sGeneralFontBackground: function () {
		return sGeneralFontBackground;
	},
    sGeneralFont: function () {
        return sGeneralFont;
    },
    sHeaderBackground: function () {
		return sHeaderBackground;
	},
	isSearch: function () {
		return Session.get('isSearch');
	}
});

Template.menuBackBottom.helpers({
    sGeneralFontBackground: function () {
        return sGeneralFontBackground;
    },
    sGeneralFont: function () {
        return sGeneralFont;
    },
    sHeaderBackground: function () {
        return sHeaderBackground;
    },
});

Template.menuAdd.helpers({
    sGeneralFontBackground: function () {
		return sGeneralFontBackground;
    },

	sHeaderBackground: function () {
		return sGeneralFontBackground;
	},
	sGeneralFont: function () {
		return sHeaderBackground;
	},
	isSearch: function () {
		return Session.get('isSearch');
	}
});


Template.menuLoadMore.events({
	'click a.loadmore': function (e, tpl) {
		e.preventDefault();
		incrementLimit();
	}
});


csv2json = function (csv){
	let lines=csv.split("\n");
	let result = [];
	let headers=lines[0].split(",");
	for(let i=1;i<lines.length;i++){
		let obj = {};
		let currentline=lines[i].split(",");
		for(let j=0;j<headers.length;j++){
			obj[headers[j]] = currentline[j];
		}
		result.push(obj);
	}
	return JSON.stringify(result);
}

readFile = function(f,onLoadCallback) {
	let reader = new FileReader();
	reader.onload = function (e){
		let contents=e.target.result
		onLoadCallback(contents);
	}
	reader.readAsText(f);
};

getKeys = function (oArray) {
	return Object.keys(oArray);
}

cekKolom = function (oArrayOne, csvJson_One) {
	let data = $(oArrayOne).not(csvJson_One).get();
	return data;
}
