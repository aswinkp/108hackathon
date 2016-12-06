import { Mongo } from 'meteor/mongo';

export const Markers = new Mongo.Collection('markers');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('markers', function markersPublication() {
    return Markers.find();
  });
  // For API to access, below should be nessesary

}

Meteor.methods({
    'marker.insert'(obj){
        Markers.insert({lat: obj.lat,lng: obj.lng});
    },
    'marker.update'(id,obj){
        console.log(id);
        console.log(obj);
         Markers.update(id, {$set: {
             lat: obj.lat,
             lng: obj.lng
         }});
    }
});