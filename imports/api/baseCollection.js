import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Base = new Mongo.Collection('base');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('base', function basePublication() {
        return Base.find();
    });
    Meteor.publish('base_by_vehicle', function basePublication(vehicle_id) {
        return Base.find({vehicle_id:vehicle_id});
    });
    // For API to access, below should be nessesary
    Base.allow({
        'insert': function (userId, doc) {
            /* user and doc checks ,
             return true to allow insert */
            return true;
        },
        'update': function (userId, doc) {
            /* user and doc checks ,
             return true to allow insert */
            return true;
        }
    });
}

Meteor.methods({
    'base.insert'(obj) {
        Base.insert({
            vehicle_id: obj.vehicle_id,
            name: obj.name,
            addess1: obj.addess1,
            addess2: obj.addess2,
            city: obj.city,
            distict: obj.distict,
            phone: obj.phone,
            loc: {
                type: "Point",
                coordinates: [obj.lng, obj.lat]
            },
            createdAt: new Date(),
            updatedAt: new Date()
        });
    },
    'base.update'(baseId, obj) {
        check(baseId, String);
        Base.update(baseId, {
            $set: {
                name: obj.name,
                addess1: obj.addess1,
                addess2: obj.addess2,
                city: obj.city,
                distict: obj.distict,
                phone: obj.phone,
                loc: {
                    type: "Point",
                    coordinates: [obj.lng, obj.lat]
                },
                updatedAt: new Date()
            }
        });
    },
    'base.updateLocation'(baseId, obj){
        check(baseId, String);
        Base.update(baseId, {
            $set: {
                loc: {
                    type: "Point",
                    coordinates: [obj.lng, obj.lat]
                },
                updatedAt: new Date()
            }
        });
    },
    'base.updateStatus'(baseId, obj){
        if (obj.status == "offline") {
            var status = {
                loc: null,
                status: obj.status,
                updatedAt: new Date()
            }
        } else if (obj.status == "busy") {
            var status = {
                status: obj.status,
                updatedAt: new Date()
            }
        } else if(obj.status == "available"){
            var status = {
                loc: {
                    type: "Point",
                    coordinates: [obj.lng, obj.lat]
                },
                status: obj.status,
                updatedAt: new Date()
            }
        }


        check(baseId, String);
        Base.update(baseId, {
            $set: status
        });
    },
});