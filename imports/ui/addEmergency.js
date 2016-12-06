import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './addEmergency.html';
Template.addEmergency.helpers({
    editableEmg() {
        var editableEmergency = Session.get('editableEmergency');
        return editableEmergency;
    }
})

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
         fire : fire,
         ambulance : ambulance,
         police : police,
         reason : reason,
         casualities : casualities,
         location : location,
         name : name,
         phone : phone
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
    'submit #editForm'(event) {
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
        var editableEmergency = Session.get('editableEmergency');
        const id = editableEmergency._id;
        // Insert a task into the collection
        Meteor.call('emergencies.update', id, {
         fire : fire,
         ambulance : ambulance,
         police : police,
         reason : reason,
         casualities : casualities,
         location : location,
         name : name,
         phone : phone
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
        $('#editModal').modal('hide');
  },
});