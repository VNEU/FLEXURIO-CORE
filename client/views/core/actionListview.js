Template.actionListview.helpers({
    isActionEDIT: function () {
        return isAdminActions(Session.get('sURLMenu'), 'EDIT');
    },

    isActionDELETE: function () {
        return isAdminActions(Session.get('sURLMenu'), 'DELETE');
    },
});
