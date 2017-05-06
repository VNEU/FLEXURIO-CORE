/**
 * Flexurio Created by YN.Pamungkas Jayuda on 12/3/15.
 */
Router.plugin('dataNotFound', {notFoundTemplate: 'oraono'});
Router.configure({
    notFoundTemplate: 'oraono'
});

Router.route('/', function () {
    this.render('home');
});

Router.route('/oraono', function () {
    Session.set('sURLMenu', 'oraono');
    this.render('oraono');
});

Router.route('/menu', function () {
    Session.set('sURLMenu', 'menuGroup');
    this.render('menu');
});

Router.route('/menuGroup', function () {
    Session.set('sURLMenu', 'menuGroup');
    this.render('menuGroup');
});


Router.route('/menuAuth', function () {
    Session.set('sURLMenu', 'member');
    this.render('menuAuth');
});


Router.route('/member', function () {
    Session.set('sURLMenu', 'member');
    this.render('member');
});



Router.route('/message', function () {
    Session.set('sURLMenu', 'message');
    this.render('message');
});

Router.route('/activitylogs', function () {
    Session.set('sURLMenu', 'activitylogs');
    this.render('activitylogs');
});


Router.route('/profileData', function () {
    Session.set('sURLMenu', 'profileData');
    this.render('profileData');
});

Router.route('/profile', function () {
    this.render('profile');
});



Router.route('/woTipe', function () {
    Session.set('sURLMenu', 'woTipe');
    this.render('woTipe');
});


Router.route('/woSubTipe', function () {
    Session.set('sURLMenu', 'woTipe');
    this.render('woSubTipe');
});


Router.route('/woSubTipeDetail', function () {
    Session.set('sURLMenu', 'woTipe');
    this.render('woSubTipeDetail');
});


Router.route('/wo', function () {
    Session.set('sURLMenu', 'wo');
    this.render('wo');
});
