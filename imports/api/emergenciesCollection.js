import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Emergencies = new Mongo.Collection('emergencies');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('emergencies', function emergenciesPublication() {
    return Emergencies.find();
  });
  // For API to access, below should be nessesary
  Emergencies.allow({
    'insert': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true;
    }
  });
}

Meteor.methods({
  'emergencies.insert'(obj) {
    Emergencies.insert({
      fire : obj.fire,
      ambulance : obj.ambulance,
      police : obj.police,
      reason : obj.reason,
      casualities : obj.casualities,
      location : obj.location,
      name : obj.name,
      phone : obj.phone,
      createdAt: new Date()
    });
  },
  'emergencies.remove'(emergencyId) {
    check(emergencyId, String);

    Emergencies.remove(emergencyId);
  },
  'emergencies.update'(emergencyId, obj) {
    check(emergencyId, String);

    Emergencies.update(emergencyId, { $set: {
      fire : obj.fire,
      ambulance : obj.ambulance,
      police : obj.police,
      reason : obj.reason,
      casualities : obj.casualities,
      location : obj.location,
      name : obj.name,
      phone : obj.phone,
      createdAt: new Date()
    } });
  },
  'emergencies.setPrivate'(emergencyId, setToPrivate) {
    check(emergencyId, String);
    check(setToPrivate, Boolean);

    const emergency = Emergencies.findOne(emergencyId);

    // Make sure only the task owner can make a task private
    if (emergency.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Emergencies.update(emergencyId, { $set: { private: setToPrivate } });
  },
});