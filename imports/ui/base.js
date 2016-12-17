import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import './base.html';


Template.registerHelper('isInArray', function (id) {
    var assignedBase = Session.get('assignedBase');
    return assignedBase.indexOf(id) > -1;
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('distance', function (a) {
    var emg = Session.get('selectedEmergency');
    /*return geolib.getDistance(geolib.getDistance(
     {latitude: emg.loc.coordinates[1], longitude: emg.loc.coordinates[0]},
     {latitude: a.coordinates[1], longitude: a.coordinates[0]}
     ));*/
    var away = geolib.getDistance(
        {latitude: emg.loc.coordinates[1], longitude: emg.loc.coordinates[0]},
        {latitude: a.coordinates[1], longitude: a.coordinates[0]}
    );
    return away/1000+" KM away";
});

Template.base.events({
    'click .assignFor'(event){
        var emg = Session.get('selectedEmergency');
        var assigned = Session.get('assignedBase');
        assigned.push(this._id);
        Session.set('assignedBase', assigned);
        Meteor.call('emergencies.assign', emg._id, this);
    }
});

Template.baseForm.events({

    'submit #addbase'(event){
        event.preventDefault();
        // Get value from form element
        const target = event.target;
        const vehicle_id = target.vehicle_id.value;
        const name = target.name.value;
        const phone = target.phone.value;
        const lat = target.lat.value;
        const lng = target.lng.value;
        Meteor.call('base.insert', {
            name: name,
            phone: phone,
            lat: lat,
            lng: lng,
            vehicle_id: vehicle_id
        });
    }
});