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
    'base.assign'(obj){
        baseId = obj.baseId;
        emg = obj.emg;
        Base.update(baseId, {
            $push: {
                currently_assigned: emg
            }
        });
    },
    'base.complete'(obj){
        var baseId = obj.baseId;
        var emgId = obj.emgId;
        Base.update(baseId, {
            $pull: { currently_assigned: { _id: emgId}}
        });
    },
    'base.updateLocation'(obj){
        var baseId = obj.baseId;
        var lat = obj.lat;
        var lng = obj.lng;
        check(baseId, String);
        Base.update(baseId, {
            $set: {
                loc: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                updatedAt: new Date()
            }
        });
    },
    'base.updateStatus'(obj){
        var baseId = obj.baseId;
        var status = obj.status;
        var stats;
        if (status == "offline") {
            stats = {
                loc: null,
                status: obj.stats,
                updatedAt: new Date()
            }
        } else if (status == "busy") {
            stats = {
                status: obj.stats,
                updatedAt: new Date()
            }
        } else if(obj.status == "available"){
            stats = {
                /*loc: {
                    type: "Point",
                    coordinates: [obj.lng, obj.lat]
                },*/
                status: status,
                updatedAt: new Date()
            }
        }


        check(baseId, String);
        Base.update(baseId, {
            $set: status
        });
    },
});