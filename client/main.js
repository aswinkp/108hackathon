import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '../imports/startup/accounts-config.js'
import '../imports/ui/body.js';

Meteor.startup(function() {
  GoogleMaps.load({
    key: 'AIzaSyCQFxD0Q4KUzW20VlX4DhAeEuhXhCPjuH8',
    libraries: 'places'  // also accepts an array if you need more than one
  });
});

