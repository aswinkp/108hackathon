import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Emergencies} from '../api/emergenciesCollection.js';
import {Base} from '../api/baseCollection.js';
//AIzaSyCQFxD0Q4KUzW20VlX4DhAeEuhXhCPjuH8 Maps API Key
import './emergencyForms.js';
import './emergencyForms.js';
import './Emergency.html';
import './MainLayout.html';
import './base.js';

Template.MainLayout.onCreated(function bodyOnCreated() {
    Meteor.subscribe('emergencies');
    Meteor.subscribe('base');
});

Template.registerHelper('gt',function (a,b) {
   return a>b;
});

Template.MainLayout.helpers({
    unassigned : function(){
        return Emergencies.find({ owner : null}, {sort : {updatedAt: -1}});
    },
    unassignedCount : function(){
        return Emergencies.find({ owner : null}).count();
    },
    selectedEmg: function () {
        var emergency = Session.get('selectedEmergency');
        if (Session.get('selectedEmergency')) {
            return Emergencies.findOne({_id: emergency._id});
        } else {
            return null;
        }
    }
});

Template.MainLayout.events({
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
    'click .takeEmergency'(event){
        Meteor.call('emergencies.take',this._id);
    }
});