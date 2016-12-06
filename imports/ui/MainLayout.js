import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Emergencies } from '../api/emergenciesCollection.js';

import './addEmergency.js';
import './Emergency.html';
import './MainLayout.html';

Template.MainLayout.onCreated(function bodyOnCreated() {
  Meteor.subscribe('emergencies');
});

Template.MainLayout.helpers({
  emg: function() {
    return Emergencies.find({});
  },
  selectedEmg: function(){
    return Session.get('selectedEmergency');
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
    Session.set('selectedEmergency', this);
    $(event.target).closest('.panel').addClass('selectedEmg');
  },
  'click .editEmergency'(event){
    Session.set('editableEmergency', this);

  }
});