/**
 * Created by Jayuda on 6/1/17.
 */

countBadge = function (sRouter) {
    if(sRouter == 'messages') {
        var qty = MESSAGES.find({aktifYN: 1, status: "UNREAD"}).fetch().length;
        return qty;
    } else {
        return "";
    }
};