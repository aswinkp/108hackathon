import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Emergencies} from '../api/emergenciesCollection.js';
import {Nearby} from '../api/nearbyCollection.js';

import './emergencyForms.js';
import './Emergency.html';
import './MainLayout.html';
import './nearby.js';

Template.MainLayout.onCreated(function bodyOnCreated() {
    Meteor.subscribe('emergencies');
    Meteor.subscribe('nearby');
});

Template.registerHelper('gt',function (a,b) {
   return a>b;
});

Template.MainLayout.helpers({
    emg: function () {
        return Emergencies.find({owner : Meteor.userId()}, {sort : {updatedAt: -1}});
    },
    nb : function(){
        var assignMode = Session.get('assignMode');
        var emergency = Session.get('selectedEmergency');
        if(assignMode){
           return Nearby.find({});
        }else{
            return null;
        }

    },
    unassigned : function(){
        return Emergencies.find({ owner : null}, {sort : {updatedAt: -1}});
    },
    unassignedCount : function(){
        return Emergencies.find({ owner : null}).count();
    },
    selectedEmg: function () {
        var emergency = Session.get('selectedEmergency');
        console.log(Session.get('selectedEmergency'));
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
    'click .viewEmergency'(event){
        $('.selectedEmg').removeClass('selectedEmg');
        Session.set('assignMode', false);
        Session.set('selectedEmergency', this);
        $(event.target).closest('.panel').addClass('selectedEmg');
    },
    'click .takeEmergency'(event){
        Meteor.call('emergencies.take',this._id);
    }
});