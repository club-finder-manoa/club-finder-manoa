import { Meteor } from 'meteor/meteor';
import { Clubs } from '../../api/clubs/Clubs';
import { Users } from '../../api/users/Users';

/* eslint-disable no-console */

Meteor.methods({
  insertUser: function ({ email, major }) {
    return Users.collection.insert({ email, major });
  },

  updateUser: function ({ email, firstName, lastName, aboutMe, major, picture, interests }) {
    return Users.collection.update({ email: email }, { $set: { firstName, lastName, aboutMe, major, picture, interests } });
  },

  removeUser: function ({ email }) {
    return Users.collection.remove({ email });
  },

  removeAccount: function ({ email }) {
    return Meteor.users.remove({ username: email });
  },

  updatePermissions: function ({ email, adminArray }) {
    return Users.collection.update({ email: email }, { $set: { adminForClubs: adminArray } });
  },
});

function addClub({ clubName, clubType, mainPhoto, description, tags, relevantMajors, meetingInfo, contactName, contactEmail, photos, admins }) {
  Clubs.collection.insert({ clubName, clubType, mainPhoto, description, tags, relevantMajors, meetingInfo, contactName, contactEmail, photos, admins });
}

function addUserToCollection({ firstName, lastName, email, aboutMe, picture, savedClubs, interests, major, adminForClubs }) {
  console.log(`  Defining user data: ${email}`);
  Users.collection.insert({ firstName, lastName, email, aboutMe, picture, savedClubs, interests, major, adminForClubs });
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
  if (Meteor.settings.loadAssetsFile) {
    console.log('Loading clubs...');
    const clubData = JSON.parse(Assets.getText('clubs.json'));
    clubData.clubs.map(club => addClub(club));
    console.log(`Loaded ${clubData.clubs.length} clubs!`);
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
