/**
 * Created by ThinkMac on 10/13/15.
 */

EncrypConfig = {
    enforceEmailVerification: false
};

// GENERAL CONFIG
sAPPName = "Flexurio";
apiPath = 'flexurioAPI';

// KEY OAUTH
google = {
    clientId: "792566970662-77l1se8suusk89b4mf8iadp730alq2jo.apps.googleusercontent.com",
    clientSecret: "prSMw73wH30qBzLcchEcD8_I"
};
facebook = {
    appId: "792566970662-77l1se8suusk89b4mf8iadp730alq2jo.apps.googleusercontent.com",
    secret: "prSMw73wH30qBzLcchEcD8_I"
};


// REDIS
redisSERVER = {
    host: "YOURREDISSERVER",
    port: "YOURREDISPORT"
}


// THEME COLOR
sHeaderBackground = "#0E487A";
sHeaderBackgroundSecondary = "#0E5AA4";
sProfileBackground = "#0C3351";
sGeneralFontBackground = "white";
sGeneralFont = "#0E487A";

// CONF ON SERVER
sURL_upUser = "http://localhost:3000/";
sURL = "http://localhost:3000/";
sLokasi_upUser = process.env.PWD + "/public/";

sAvatar = sURL + "images/avatar.svg";
sLogo = sURL + "images/logo.svg";
sBackground = sURL + "images/background.svg";

Meteor.absoluteUrl.defaultOptions.rootUrl = sURL;
