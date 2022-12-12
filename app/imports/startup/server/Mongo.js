import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Clubs } from '../../api/clubs/Clubs';
import { Users } from '../../api/users/Users';

/* eslint-disable no-console */

Meteor.methods({
  insertUser: function ({ accountID, email }) {
    const picture = 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg';
    const displayName = 'Click "Edit Profile" at the Bottom to Change Your Name';
    const aboutMe = 'Write a little about yourself!';
    return Users.collection.insert({ accountID, displayName, email, picture, aboutMe });
  },

  saveClub: function ({ email, clubName }) {
    let clubArray = Users.collection.find({ email: email }).fetch()[0].savedClubs;
    console.log(`save email is ${email}`);
    console.log(`save clubName is ${clubName}`);
    if (clubArray) {
      clubArray.push(clubName);
    } else {
      clubArray = [clubName];
    }
    return Users.collection.update({ email: email }, { $set: { savedClubs: clubArray } });
  },

  removeClub: function ({ email, clubName }) {
    const clubArray = Users.collection.find({ email: email }).fetch()[0].savedClubs;
    console.log(`remove email is ${email}`);
    console.log(`remove clubName is ${clubName}`);
    // eslint-disable-next-line no-restricted-syntax
    for (const i in clubArray) {
      if (clubArray[i] === clubName) {
        console.log('Club found');
        clubArray.splice(i, 1);
      }
    }
    return Users.collection.update({ email: email }, { $set: { savedClubs: clubArray } });
  },

  updateUser: function ({ email, displayName, aboutMe, picture }) {
    const pic = picture || 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg';
    return Users.collection.update({ email: email }, { $set: { displayName, aboutMe, picture: pic } });
  },

  // eslint-disable-next-line max-len
  updateClub: function ({ _id, clubName, clubType, mainPhoto, description, website, meetingTimeSunday, meetingLocationSunday, meetingTimeMonday, meetingLocationMonday, meetingTimeTuesday, meetingLocationTuesday, meetingTimeWednesday, meetingLocationWednesday, meetingTimeThursday, meetingLocationThursday, meetingTimeFriday, meetingLocationFriday, meetingTimeSaturday, meetingLocationSaturday, contactName, contactEmail }) {
    // eslint-disable-next-line max-len
    return Clubs.collection.update({ _id: _id }, { $set: { clubName, clubType, mainPhoto, description, website, meetingTimeSunday, meetingLocationSunday, meetingTimeMonday, meetingLocationMonday, meetingTimeTuesday, meetingLocationTuesday, meetingTimeWednesday, meetingLocationWednesday, meetingTimeThursday, meetingLocationThursday, meetingTimeFriday, meetingLocationFriday, meetingTimeSaturday, meetingLocationSaturday, contactName, contactEmail } });
  },

  updateInterests: function ({ email, interests }) {
    return Users.collection.update({ email: email }, { $set: { interests } });
  },

  updateTags: function ({ clubName, tags }) {
    return Clubs.collection.update({ clubName: clubName }, { $set: { tags } });
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

  resetPw: function ({ userId }) {
    const newPassword = 'changeme';
    return Accounts.setPassword(userId, newPassword);
  },
});

// eslint-disable-next-line max-len
function addClubInit({ clubName, clubType, mainPhoto, description, website, tags, meetingTimeSunday, meetingLocationSunday, meetingTimeMonday, meetingLocationMonday, meetingTimeTuesday, meetingLocationTuesday, meetingTimeWednesday, meetingLocationWednesday, meetingTimeThursday, meetingLocationThursday, meetingTimeFriday, meetingLocationFriday, meetingTimeSaturday, meetingLocationSaturday, contactName, contactEmail, admins, interestedUsers }) {
  // eslint-disable-next-line max-len
  Clubs.collection.insert({ clubName, clubType, mainPhoto, description, website, tags, meetingTimeSunday, meetingLocationSunday, meetingTimeMonday, meetingLocationMonday, meetingTimeTuesday, meetingLocationTuesday, meetingTimeWednesday, meetingLocationWednesday, meetingTimeThursday, meetingLocationThursday, meetingTimeFriday, meetingLocationFriday, meetingTimeSaturday, meetingLocationSaturday, contactName, contactEmail, admins, interestedUsers });
}

/** Init clubs in DB */
if (Clubs.collection.find().count() === 0) {
  if (Meteor.settings.loadAssetsFile) {
    console.log('Loading clubs...');
    const clubData = JSON.parse(Assets.getText('clubs.json'));
    clubData.clubs.map(club => addClubInit(club));
    console.log(`Loaded ${clubData.clubs.length} clubs!`);
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
