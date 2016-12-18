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

    Meteor.publish('by_phone', function emergenciesbyPhonePub(phone) {
        return Emergencies.find({phone: phone}, {sort: {updatedAt: -1}}, {limit: 1});
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

    Meteor.methods({
        'emergencies.findDuplicates'(loc){
            return (Emergencies.aggregate([
                {
                    $geoNear: {
                        near: loc,
                        distanceField: "dist.calculated",
                        includeLocs: "dist.location",
                        num: 5,
                        distanceMultiplier: 0.001,
                        spherical: true
                    }
                }
            ]));
        }
    });
}

Meteor.methods({
    'emergencies.insert'(obj) {
        console.log(obj.lng);
        console.log(obj.lat);
        Emergencies.insert({
            fire: obj.fire,
            ambulance: obj.ambulance,
            police: obj.police,
            reason: obj.reason,
            casualities: obj.casualities,
            address: obj.address,
            location: obj.location,
            name: obj.name,
            condition: obj.condition,
            phone: obj.phone,
            type: "manual",
            loc: {
                type: "Point",
                coordinates: [parseFloat(obj.lng), parseFloat(obj.lat)]
            },
            owner: [this.userId],
            createdAt: new Date(),
            updatedAt: new Date()
        });
    },
    'emergencies.apiinsert'(obj) {
        console.log(obj);
        Emergencies.insert({
            fire: obj.fire,
            ambulance: obj.ambulance,
            police: obj.police,
            reason: obj.reason,
            casualities: obj.casualities,
            location: obj.location,
            name: obj.name,
            condition: obj.condition,
            phone: obj.phone,
            loc: {
                type: "Point",
                coordinates: [parseFloat(obj.lng), parseFloat(obj.lat)]
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
        Emergencies.update(emergencyId, {
            $set: {
                fire: obj.fire,
                ambulance: obj.ambulance,
                police: obj.police,
                reason: obj.reason,
                casualities: obj.casualities,
                location: obj.location,
                name: obj.name,
                phone: obj.phone,
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
    'emergencies.assign'(obj){
        emergencyId = obj.emergencyId;
        base = obj.base;
        check(emergencyId, String);

        const emergency = Emergencies.findOne(emergencyId);
        if (this.userId != null) {
            Emergencies.update(emergencyId,
                {$push: {assigned: base}}
            );
        } else {
            throw new Meteor.Error('not-authorized');
        }
    },
    'emergencies.getDistance'(phoneNo){
        console.log("emergencies.getDistance");
        console.log(phoneNo);
        var emergency = Emergencies.findOne({phone: phoneNo},{sort: {createdAt: -1}});
        console.log(emergency);
        var list = "";
        if (Array.isArray(emergency.assigned) && emergency.assigned.length) {
            for (var i = 0; i < emergency.assigned.length; i++) {
                if(i>0){
                    list = list.concat(",");
                }
                list = list.concat(emergency.assigned[i]._id);
            }
        }
        console.log(list);
        return list;
    }

});