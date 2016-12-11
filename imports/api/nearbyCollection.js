import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Nearby = new Mongo.Collection('nearby');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('nearby', function nearbyPublication() {
        return Nearby.find();
    });
    // For API to access, below should be nessesary
    Nearby.allow({
        'insert': function (userId, doc) {
            /* user and doc checks ,
             return true to allow insert */
            return true;
        }
    });
}

Meteor.methods({
    'nearby.insert'(obj) {
        if (Meteor.isServer) {
            console.log("Inside Insert");
        }
        Nearby.insert({
            name: obj.name,
            addess1: obj.addess1,
            addess2: obj.addess2,
            city: obj.city,
            distict: obj.distict,
            phone: obj.phone_no,
            lat: obj.lat,
            lng: obj.lng,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    },
    'nearby.update'(emergencyId, obj) {
        check(emergencyId, String);
        Nearby.update(emergencyId, {
            $set: {
                name: obj.name,
                addess1: obj.addess1,
                addess2: obj.addess2,
                city: obj.city,
                distict: obj.distict,
                phone: obj.phone_no,
                lat: obj.lat,
                lng: obj.lng,
                updatedAt: new Date()
            }
        });
    },
});