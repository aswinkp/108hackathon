import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Emergencies} from '../api/emergenciesCollection.js';

import './emergencyForms.html';

Template.editEmergency.onCreated(function bodyOnCreated() {
    Meteor.subscribe('emergencies');
    this.editMode = new ReactiveVar(false);
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
        const location = target.location.value;
        const name = target.name.value;
        const phone = target.phone.value;
        // Insert a task into the collection
        Meteor.call('emergencies.insert', {
            fire: fire,
            ambulance: ambulance,
            police: police,
            reason: reason,
            casualities: casualities,
            location: location,
            name: name,
            phone: phone
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
        $('#myModal').modal('toggle');
    },
});
Template.editEmergency.events({
    'click #openEdit'(event, template){
        template.editMode.set(true);
    },
    'click #closeEdit'(event, template){
        template.editMode.set(false);
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
            phone: phone
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