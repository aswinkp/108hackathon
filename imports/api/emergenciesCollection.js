import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Emergencies = new Mongo.Collection('emergencies');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('emergencies', function emergenciesPublication() {
        return Emergencies.find({
            "$or": [{
                        "owner": this.userId
                    }, {
                        "owner": null
                    }]
        });
    });

    Meteor.publish('by_phone', function emergenciesbyPhonePub(phone){
        return Emergencies.find({phone: phone}, {sort : {updatedAt: -1}}, {limit: 1});
    });

    Meteor.publish();
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
            owner: [this.userId],
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
            loc: {
                type: "Point",
                coordinates: [obj.lng, obj.lat]
            },
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
        console.log(obj.assigned);
        console.log(obj.complete);
        Emergencies.update(emergencyId, {
            $set: {
                fire: obj.fire,
                ambulance: obj.ambulance,
                police: obj.police,
                reason: obj.reason,
                casualities: obj.casualities,
                location: obj.location,
                loc: {
                    type: "Point",
                    coordinates: [obj.lng, obj.lat]
                },
                name: obj.name,
                phone: obj.phone,
                assigned: obj.assigned,
                complete: obj.complete,
                updatedAt: new Date()
            }
        });
    },
    'emergencies.take'(emergencyId) {
        check(emergencyId, String);

        const emergency = Emergencies.findOne(emergencyId);
        if (this.userId != null) {
            Emergencies.update(emergencyId, {$push: {owner: this.userId}});
        } else {
            throw new Meteor.Error('not-authorized');
        }
    },
    'emergencies.assign'(emergencyId, nearby){
        check(emergencyId, String);

        const emergency = Emergencies.findOne(emergencyId);
        if (this.userId != null) {
            Emergencies.update(emergencyId, {$push: {assigned: nearby}});
        } else {
            throw new Meteor.Error('not-authorized');
        }
    }

});