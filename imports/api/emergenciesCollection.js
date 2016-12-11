import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Emergencies = new Mongo.Collection('emergencies');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('emergencies', function emergenciesPublication() {
        return Emergencies.find();
    });
    // For API to access, below should be nessesary
    Emergencies.allow({
        'insert': function (userId, doc) {
            /* user and doc checks ,
             return true to allow insert */
            return true;
        }
    });
}

Meteor.methods({
    'emergencies.insert'(obj) {
        Emergencies.insert({
            fire: obj.fire,
            ambulance: obj.ambulance,
            police: obj.police,
            reason: obj.reason,
            casualities: obj.casualities,
            location: obj.location,
            name: obj.name,
            phone: obj.phone,
            type: "manual",
            owner: this.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    },
    'emergencies.apiinsert'(obj) {
        Emergencies.insert({
            fire: obj.fire,
            ambulance: obj.ambulance,
            police: obj.police,
            reason: obj.reason,
            casualities: obj.casualities,
            location: obj.location,
            name: obj.name,
            phone: obj.phone,
            lat: obj.lat,
            lng: obj.lng,
            type: "mobile",
            createdAt: new Date(),
            updatedAt: new Date()
        });
    },
    'emergencies.remove'(emergencyId) {
        check(emergencyId, String);

        Emergencies.remove(emergencyId);
    },
    'emergencies.update'(emergencyId, obj) {
        check(emergencyId, String);

        Emergencies.update(emergencyId, {$set: {
            fire: obj.fire,
            ambulance: obj.ambulance,
            police: obj.police,
            reason: obj.reason,
            casualities: obj.casualities,
            location: obj.location,
            lat: obj.lat,
            lng: obj.lng,
            name: obj.name,
            phone: obj.phone,
            updatedAt: new Date()
        }});
    },
    'emergencies.take'(emergencyId) {
        check(emergencyId, String);

        const emergency = Emergencies.findOne(emergencyId);

        if (emergency.owner == null) {
            Emergencies.update(emergencyId, {$set: {owner: this.userId}});
        }else {
           throw new Meteor.Error('not-authorized');
        }
    },
});