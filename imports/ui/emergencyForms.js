import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Emergencies} from '../api/emergenciesCollection.js';

import './emergencyForms.html';

/*var initAutoComplete = function () {
 var autocomplete = new google.maps.places.Autocomplete(
 (document.getElementById('location')), {types: ['geocode']}
 );
 };
 Template.addEmergency.rendered = initAutoComplete;*/


Template.addEmergency.onRendered(function () {
    this.autorun(function () {
        var phone = Session.get('phone');
        Meteor.subscribe('by_phone', phone);
    }.bind(this));
});

Template.addEmergency.onRendered(function () {
    this.autorun(function () {
        if (GoogleMaps.loaded()) {
            $("#location").geocomplete({
                details: "#addForm",
                detailsAttribute: "data-geo"
            });
        }
    });
});

Template.editEmergency.onCreated(function editEmgOnCreated() {
    this.editMode = new ReactiveVar(false);
});

Template.addEmergency.helpers({
    duplicates: function () {
        var phone = Session.get('phone');
        return Emergencies.find({phone: phone}, {sort: {updatedAt: -1}}, {limit: 1});
    },
    duplicates2: function () {
        return Emergencies.find({phone: Template.instance().phone.get()});
    },

});

Template.editEmergency.helpers({
    editableEmg() {
        var emergency = Session.get('selectedEmergency');
        if (emergency) {
            return Emergencies.findOne({_id: emergency._id});
        } else {
            return null;
        }
    },
    editMode: function () {
        return Template.instance().editMode.get();
    }
});

Template.addEmergency.events({
    'submit #addForm'(event) {
        // Prevent default browser form submit
        event.preventDefault();
        // Get value from form element
        const target = event.target;
        const fire = target.fire.checked;
        const ambulance = target.ambulance.checked;
        const police = target.police.checked;
        const reason = target.reason.value;
        const casualities = target.casualities.value;
        const address = target.address.value;
        const location = target.location.value;
        const name = target.name.value;
        const phone = target.phone.value;
        const lat = target.lat.value;
        const lng = target.lng.value;
        // Insert a task into the collection
        Meteor.call('emergencies.insert', {
         fire: fire,
         ambulance: ambulance,
         police: police,
         reason: reason,
         casualities: casualities,
         address: address,
         location: location,
         name: name,
         phone: phone,
         lat: lat,
         lng: lng
         });
         // Clear form
         target.fire.checked = false;
         target.ambulance.checked = false;
         target.police.checked = false;
         target.reason.value = '';
         target.casualities.value = '';
         target.location.value = '';
         target.address.value = '';
         target.name.value = '';
         target.phone.value = '';
         target.lat.value = '';
         target.lng.value = '';
        $('#myModal').modal('toggle');
    },
    'blur #phone'(event, template) {
        const target = event.target;
        Session.set('phone', target.value);
    },
    'click .selectEmergency'(event){
        Session.set('selectedEmergency', this._id);
        Meteor.call('emergencies.take', this._id);
        $('#myModal').modal('toggle');
    }
});
Template.editEmergency.events({
    'click #openEdit'(event, template){
        template.editMode.set(true);
    },
    'click #closeEdit'(event, template){
        template.editMode.set(false);
    },
    'click #assign'(event, template){
        Session.set('assignMode', true)
    },
    'submit #editForm'(event, template){
        // Prevent default browser form submit
        event.preventDefault();
        // Get value from form element
        const target = event.target;
        const fire = target.fire.checked;
        const ambulance = target.ambulance.checked;
        const police = target.police.checked;
        const reason = target.reason.value;
        const casualities = target.casualities.value;
        const location = target.location.value;
        const name = target.name.value;
        const phone = target.phone.value;
        const assigned = target.assigned.checked;
        const complete = target.complete.checked;
        var editableEmergency = Session.get('selectedEmergency');
        const id = editableEmergency._id;
        // Insert a task into the collection
        Meteor.call('emergencies.update', id, {
            fire: fire,
            ambulance: ambulance,
            police: police,
            reason: reason,
            casualities: casualities,
            location: location,
            name: name,
            phone: phone,
            assigned: assigned,
            complete: complete
        });
        // Clear form
        target.fire.checked = false;
        target.ambulance.checked = false;
        target.police.checked = false;
        target.reason.value = '';
        target.casualities.value = '';
        target.location.value = '';
        target.name.value = '';
        target.phone.value = '';
        template.editMode.set(false);
    },
});