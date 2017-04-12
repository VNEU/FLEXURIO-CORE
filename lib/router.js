/**
 * Flexurio Created by YN.Pamungkas Jayuda on 12/3/15.
 */
Router.plugin('dataNotFound', {notFoundTemplate: 'oraono'});
Router.configure({
    notFoundTemplate: 'oraono'
});

Router.route('/', {
    name: 'home',
    controller: 'controller',
    action: 'action_home'
});

Router.route('/profile', {
    name: 'profile',
    controller: 'controller',
    action: 'action_profile'
});

Router.route('/report', function () {
    this.render('report');
});
Router.route('/charts', function () {
    this.render('chartsExample');
});

Router.route('/pie', function () {
    this.render('pie');
});


Router.route('/loading', function () {
    this.render('loading');
});

Router.route('/oraono', function () {
    this.render('oraono');
});

Router.route('/menu', function () {
    this.render('menu');
});

Router.route('/menuGroup', function () {
    this.render('menuGroup');
});


Router.route('/menuAuth', function () {
    this.render('menuAuth');
});


Router.route('/member', function () {
    this.render('member');
});


Router.route('/todo', function () {
    this.render('todo');
});


Router.route('/message', function () {
    this.render('message');
});

Router.route('/activitylogs', function () {
    this.render('activitylogs');
});


Router.route('/profileData', function () {
    this.render('profileData');
});

Router.route('/negara', function () {
    this.render('negara');
});


Router.route('/provinsi', function () {
    this.render('provinsi');
});


Router.route('/kabupaten', function () {
    this.render('kabupaten');
});


Router.route('/kecamatan', function () {
    this.render('kecamatan');
});


Router.route('/kelurahan', function () {
    this.render('kelurahan');
});

Router.route('/woTipe', function () {
    this.render('woTipe');
});


Router.route('/woSubTipe', function () {
    this.render('woSubTipe');
});


Router.route('/woSubTipeDetail', function () {
    this.render('woSubTipeDetail');
});


Router.route('/wo', function () {
    this.render('wo');
});

Router.route('/apimanager', function () {
    this.render('apimanager');
});


Router.route('/calendar', function () {
    this.render('calendar');
});


Router.route('/INU', function () {
    Session.set("sURLMenu", 'INU');
    this.render('INU');
});
    


    Router.route('/ITU', function () {
        Session.set('sURLMenu', 'ITU');
       this.render('ITU');
    });
    
