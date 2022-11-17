import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Clubs } from '../../api/clubs/Clubs';
import { Users } from '../../api/users/Users';

/* eslint-disable no-console */

/** Define a user in the Meteor accounts package. This enables login. Username is the email address. */
function createUser(email, role) {
  const userID = Accounts.createUser({ username: email, email, password: 'foo' });
  if (role === 'admin') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'admin');
  }
}

/** Defines a new user and associated profile. Error if user already exists. */
function addClub({ clubName, clubType, mainPhoto, description, tags, relevantMajors, meetingInfo, contactName, contactEmail, photos, admins }) {
  console.log(`Defining club: ${clubName}`);
  // Create the profile.
  Clubs.collection.insert({ clubName, clubType, mainPhoto, description, tags, relevantMajors, meetingInfo, contactName, contactEmail, photos, admins });
}

function addUserToCollection({ email, savedClubs, interests, major, adminForClubs }) {
  console.log(`Defining user data: ${email}`);
  // Create the profile.
  Users.collection.insert({ email, savedClubs, interests, major, adminForClubs });
}

/** Initialize DB if it appears to be empty (i.e. no users defined.) */
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultUserData) {
    console.log('Loading user data');
    Meteor.settings.defaultAccounts.map(profile => createUser(profile));
    Meteor.settings.defaultUserData.map(profile => addUserToCollection(profile));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}

/** Init clubs in DB */
if (Clubs.collection.find().count() === 0) {
  if (Meteor.settings.clubs) {
    console.log('Loading clubz');
    Meteor.settings.clubs.map(club => addClub(club));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
