/**
 * Created by aswin on 17/12/16.
 */
import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import './UserManagement.html';

Template.UserManagement.events({
    'submit #addUserForm'(event) {
        // Prevent default browser form submit
        event.preventDefault();
        // Get value from form element
        const target = event.target;
        const email = target.email.value;
        const password = target.password.value;
        const isAdmin = target.isAdmin.checked;
        // Insert a task into the collection
        console.log(email);
        console.log(password);
        var newUser = {
            email: email,
            password: password,
            isAdmin: isAdmin
        }
        Meteor.call('postForm', newUser, function(error, response) {
            if (error) {
                console.log('postForm: Error: ', error);
            }
            if (response) {
                console.log('postForm: Response: ', response);
            }
        });

        // Clear form
        /*$('#addUserForm').reset();*/
    },
    'blur #phone'(event, template) {
        const target = event.target;
        Session.set('phone', target.value);
    }
});