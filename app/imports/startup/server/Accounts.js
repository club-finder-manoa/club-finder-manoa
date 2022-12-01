import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '../../api/users/Users';

/* eslint-disable no-console */
const createUser = (email, password, role) => {
  console.log(`  Creating user ${email}`);
  const userID = Accounts.createUser({
    username: email,
    email: email,
    password: password,
  });
  if (role === 'admin') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'admin');
  }
};

function addUserToCollection({ firstName, lastName, email, aboutMe, picture, savedClubs, interests, adminForClubs }, accountID) {
  console.log(`  Defining user data for ${email}`);
  Users.collection.insert({ accountID, firstName, lastName, email, aboutMe, picture, savedClubs, interests, adminForClubs });
}

// When running app for first time, pass a settings file to set up a default user account.
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default users...');
    let i = 0;
    Meteor.settings.defaultAccounts.forEach(({ email, password, role }) => {
      createUser(email, password, role);
      const accountID = Meteor.users.find({ username: email }).fetch()[0]._id;
      addUserToCollection(Meteor.settings.defaultUserData[i], accountID);
      i++;
    });
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
