import { Meteor } from 'meteor/meteor';
import { Emergencies } from '../imports/api/emergenciesCollection.js';
import { Base } from '../imports/api/baseCollection.js';
import { Vehicles } from '../imports/api/vehiclesCollection.js';
import { Markers } from '../imports/api/marker.js';

    Meteor.methods({
        postForm: function (doc) {
            try {
                var result = Accounts.createUser({
                    email: doc.email,
                    password: doc.password,
                });
                if (result) {
                    console.log(result);
                    if(doc.isAdmin)
                        Roles.addUsersToRoles(result, ['admin'], 'admin');
                    return result;
                }
            }
            catch (err) {
                return err;
            }
        }
    });

Meteor.startup(() => {
  // code to run on server at startup
});
