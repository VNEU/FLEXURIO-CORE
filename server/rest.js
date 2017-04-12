/**
 * Created by ThinkMac on 8/11/16.
 */
Meteor.startup(function () {
    var Api = new Restivus({
        useDefaultAuth: true,
        prettyJson: true,
        apiPath:"MenaraAPI",
        auth: {
            token: 'auth.apiKey',
            user: function () {
                return {
                    userId: this.request.headers['user-id'],
                    token: this.request.headers['login-token']
                };
            }
        }
    });

    // Generates: GET, POST on /api/items and GET, PUT, DELETE on
    // /api/items/:id for the Items collection
    Api.addCollection(NEGARA, {
        endpoints: {
            get: {
                authRequired: true
            },
            post: {
                authRequired: false
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
});
