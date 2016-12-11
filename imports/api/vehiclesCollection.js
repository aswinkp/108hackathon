/**
 * Created by aswin on 11/12/16.
 */
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Vehicles = new Mongo.Collection('vehicles');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('nearby', function nearbyPublication() {
        return Vehicles.find();
    });
    // For API to access, below should be nessesary
    Vehicles.allow({
        'insert': function (userId, doc) {
            /* user and doc checks ,
             return true to allow insert */
            return true;
        }
    });
}

Meteor.methods({
    'vehicles.insert'(obj) {
        if (Meteor.isServer) {
            console.log("Inside Insert");
        }
        Vehicles.insert({
            name: obj.name,
            phone: obj.phone,
            loc: {
                type: "Point",
                coordinates: [obj.lng, obj.lat]
            },
            createdAt: new Date(),
            updatedAt: new Date()
        });
    },
    'vehicles.update'(emergencyId, obj) {
        check(emergencyId, String);
        Vehicles.update(emergencyId, {
            $set: {
                name: obj.name,
                phone: obj.phone,
                loc: {
                    type: "Point",
                    coordinates: [obj.lng, obj.lat]
                },
                updatedAt: new Date()
            }
        });
    },
});