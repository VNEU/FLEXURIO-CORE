MEMBER.allow({
    'insert': function (userId, doc) {
        return true;
    },
    'remove': function (userId, doc) {
        if (Roles.userIsInRole(userId, ['root', 'administrator'])) {
            return true;
        } else {
            return false;
        }
    },
    'update': function (userId, doc, fieldNames, modifier) {
        return true;
    }
});

APIMANAGER.allow({
    'insert': function (userId, doc) {
        // do somethings here
        return true;
    },
    'remove': function (userId, doc) {
        if (Roles.userIsInRole(userId, ['root', 'administrator'])) {
            return true;
        } else {
            return false;
        }
    },
    'update': function (userId, doc, fieldNames, modifier) {
        // do somethings here
        return true;
    }
});

WO.allow({
    'insert': function (userId, doc) {
        return true;
    },
    'remove': function (userId, doc) {
        if (Roles.userIsInRole(userId, ['root', 'administrator'])) {
            return true;
        } else {
            return false;
        }
    },
    'update': function (userId, doc, fieldNames, modifier) {
        return true;
    }
});

WOTIPE.allow({
    'insert': function (userId, doc) {
        return true;
    },
    'remove': function (userId, doc) {
        if (Roles.userIsInRole(userId, ['root', 'administrator'])) {
            return true;
        } else {
            return false;
        }
    },
    'update': function (userId, doc, fieldNames, modifier) {
        return true;
    }
});
WOSUBTIPE.allow({
    'insert': function (userId, doc) {
        return true;
    },
    'remove': function (userId, doc) {
        if (Roles.userIsInRole(userId, ['root', 'administrator'])) {
            return true;
        } else {
            return false;
        }
    },
    'update': function (userId, doc, fieldNames, modifier) {
        return true;
    }
});

WOSUBTIPEDETAIL.allow({
    'insert': function (userId, doc) {
        return true;
    },
    'remove': function (userId, doc) {
        if (Roles.userIsInRole(userId, ['root', 'administrator'])) {
            return true;
        } else {
            return false;
        }
    },
    'update': function (userId, doc, fieldNames, modifier) {
        return true;
    }
});



MENUAUTH.allow({
    'insert': function (userId, doc) {
        return true;
    },
    'remove': function (userId, doc) {
        if (Roles.userIsInRole(userId, ['root', 'administrator'])) {
            return true;
        } else {
            return false;
        }
    },
    'update': function (userId, doc, fieldNames, modifier) {
        // do somethings here
        return true;
    }
});

MENU.allow({
    'insert': function (userId, doc) {
        // do somethings here
        return true;
    },
    'remove': function (userId, doc) {
        if (Roles.userIsInRole(userId, ['root', 'administrator'])) {
            return true;
        } else {
            return false;
        }
    },
    'update': function (userId, doc, fieldNames, modifier) {
        // do somethings here
        return true;
    }
});

MENUGROUP.allow({
    'insert': function (userId, doc) {
        // do somethings here
        return true;
    },
    'remove': function (userId, doc) {
        if (Roles.userIsInRole(userId, ['root', 'administrator'])) {
            return true;
        } else {
            return false;
        }
    },
    'update': function (userId, doc, fieldNames, modifier) {
        // do somethings here
        return true;
    }
});
MESSAGE.allow({
    'insert': function (userId, doc) {
        // do somethings here
        return true;
    },
    'remove': function (userId, doc) {
        if (Roles.userIsInRole(userId, ['root', 'administrator'])) {
            return true;
        } else {
            return false;
        }
    },
    'update': function (userId, doc, fieldNames, modifier) {
        // do somethings here
        return true;
    }
});
MESSAGEMEMBER.allow({
    'insert': function (userId, doc) {
        // do somethings here
        return true;
    },
    'remove': function (userId, doc) {
        if (Roles.userIsInRole(userId, ['root', 'administrator'])) {
            return true;
        } else {
            return false;
        }
    },
    'update': function (userId, doc, fieldNames, modifier) {
        // do somethings here
        return true;
    }
});
