import { Meteor } from 'meteor/meteor';
import { Clubs } from '../../api/clubs/Clubs';
import { Users } from '../../api/users/Users';

/* eslint-disable no-console */

/** Defines a new user and associated profile. Error if user already exists. */
function addClub({ clubName, clubType, mainPhoto, description, tags, relevantMajors, meetingInfo, contactName, contactEmail, photos, admins }) {
  console.log(`  Defining club: ${clubName}`);
  // Create the profile.
  Clubs.collection.insert({ clubName, clubType, mainPhoto, description, tags, relevantMajors, meetingInfo, contactName, contactEmail, photos, admins });
}

function addUserToCollection({ email, savedClubs, interests, major, adminForClubs }) {
  console.log(`  Defining user data: ${email}`);
  // Create the profile.
  Users.collection.insert({ email, savedClubs, interests, major, adminForClubs });
}

/** Initialize users in DB */
if (Users.collection.find().count() === 0) {
  if (Meteor.settings.defaultUserData) {
    console.log('Loading user data...');
    Meteor.settings.defaultUserData.map(profile => addUserToCollection(profile));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}

/** Init clubs in DB */
if (Clubs.collection.find().count() === 0) {
  if (Meteor.settings.clubs) {
    console.log('Loading clubs...');
    Meteor.settings.clubs.map(club => addClub(club));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
