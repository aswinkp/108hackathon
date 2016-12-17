import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Emergencies} from '../api/emergenciesCollection.js';
import {Base} from '../api/baseCollection.js';

import './emergencyForms.js';
import './Emergency.html';
import './HomeLayout.html';
import './base.js';

Template.HomeLayout.onCreated(function bodyOnCreated() {
    Meteor.subscribe('emergencies');
    Meteor.subscribe('base');
});

Template.registerHelper('gt', function (a, b) {
    return a > b;
});


Template.HomeLayout.helpers({
    emg: function () {
        return Emergencies.find({owner: Meteor.userId()}, {sort: {updatedAt: -1}});
    },
    nb: function () {
        var assignMode = Session.get('assignMode');
        var assignedBase = Session.get('assignedBase');
        var selectedEmergency = Session.get('selectedEmergency');
        if (assignMode) {
            // return Base.find({loc: {$near: {$geometry: selectedEmergency.loc}}});
            return Base.find({loc: {$near: {$geometry: selectedEmergency.loc}}});
        } else {
            return null;
        }

    },
    assignedBase: function(){
        return Session.get('assignedBase');
    }
});

Template.HomeLayout.events({
    /*'submit .new-task'(event) {
     // Prevent default browser form submit
     event.preventDefault();

     // Get value from form element
     const target = event.target;
     const text = target.text.value;

     // Insert a task into the collection
     Meteor.call('tasks.insert', text);

     // Clear form
     target.text.value = '';
     },*/
    /*'change .hide-completed input'(event, instance) {
     instance.state.set('hideCompleted', event.target.checked);
     },*/
    'click .viewEmergency'(event){
        $('.selectedEmg').removeClass('selectedEmg');
        Session.set('assignMode', false);
        Session.set('selectedEmergency', this);
        var assigned = [];
        Session.set('assignedBase', []);
        if ('assigned' in this) {
            this.assigned.forEach(function (item,) {
                assigned.push(item._id);
            });
        }
        Session.set('assignedBase', assigned);
        $(event.target).closest('.panel').addClass('selectedEmg');
    }
});