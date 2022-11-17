import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '../../api/users/Users';
import { Clubs } from '../../api/clubs/Clubs';

/** Define a publication to publish all interests. */
Meteor.publish(Users.userPublicationName, () => Users.collection.find());

/** Define a publication to publish all profiles. */
Meteor.publish(Clubs.userPublicationName, () => Clubs.collection.find());

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
