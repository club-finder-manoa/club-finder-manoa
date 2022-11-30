import { Meteor } from 'meteor/meteor';
import { Clubs } from '../../api/clubs/Clubs';
import { Users } from '../../api/users/Users';

/* eslint-disable no-console */

Meteor.methods({
  insertUser: function ({ email, major }) {
    return Users.collection.insert({ email, major, picture: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg' });
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
