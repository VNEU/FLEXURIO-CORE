/**
 * Created by ThinkMac on 8/11/16.
 */
Meteor.startup(function () {
    var Api = new Restivus({
        useDefaultAuth: true,
        prettyJson: true,
        apiPath:"flxAPI"
    });

    Api.addCollection(WO, {
        routeOptions: {
            authRequired: true
        },
        endpoints: {
            get: {
                authRequired: true
            },
            post: {
                authRequired: true
            },
            put: {
                authRequired: true,
                roleRequired: 'admin'
            },
            delete: {
                authRequired: true,
                roleRequired: 'admin'
            }
        }
    });

    // Maps to: /api/articles/:id
    Api.addRoute('/wo/:id', {authRequired: true}, {
        get: function () {
            console.log(Api.users);
            return WO.findOne(this.urlParams.id);
        }
    });
});


//curl http://localhost:3000/flxAPI/login/ -d "username=admin@flexurio.com&password=flx.indo"
//curl -H "x-auth-token: ZQFv9449VLIF5I8BPc0v2kqg4dK1KouNNQXIa9eu6My" -H "x-user-id: 4BxgJARXEevAbuirr" http://localhost:3000/flx/wo/
