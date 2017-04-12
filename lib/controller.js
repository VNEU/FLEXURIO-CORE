/**
 * Created by MacBookPro on 6/17/15.
 * By Pamungkas Jayuda
 * yulius.jayuda@gmail.com / +628119003077
 */

controller = RouteController.extend({
	action_home: function () {
		this.render('home');
	},
	action_profile: function () {
		this.render('profile');
	}
});
