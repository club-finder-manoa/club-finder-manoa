import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

const majors = ['Accounting', 'Architecture', 'Art', 'Business', 'Chemistry', 'Computer Science', 'Computer Engineering', 'Economics', 'Engineering', 'Finance',
  'Marketing', 'Mathematics', 'Music', 'Nursing', 'Philosophy', 'Physics', 'Political Science', 'Psychology', 'Social Work', 'Other']; // TODO add more later?

const interests = ['First Interest', 'Second Interest'];

// Create the form schema for uniforms. Need to determine all interests and projects for muliselect list.
/* const allInterests = _.pluck(UsersCollection.collection.find().fetch(), 'name');
const allInterests = ''; */

/** Encapsulates state and variable values for this collection. */
class UsersCollection {
  constructor() {
    // The name of this collection.
    this.name = 'UsersCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);

    this.collection.allow({
      update: function (userId, doc, [email, firstName, lastName, aboutMe, major, picture, interests], { $set }) {
        return doc.owner === userId;
      },
    });

    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      email: { type: String, unique: 1, optional: true },
      aboutMe: { type: String, optional: true },
      major: { type: String, optional: true, allowedValues: majors },
      picture: { type: String, optional: true },
      savedClubs: { type: Array, optional: true },
      'savedClubs.$': { type: String },
      interests: { type: Array, label: 'Interests', optional: true, allowedValues: majors},
      'interests.$': { type: String },
      adminForClubs: { type: Array, optional: true }, // list of clubs that the user is an admin for
      'adminForClubs.$': { type: String },
    }, { tracker: Tracker });
    // Ensure collection documents obey schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

export const Users = new UsersCollection();
