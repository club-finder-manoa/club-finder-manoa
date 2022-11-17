import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Encapsulates state and variable values for this collection. */
class ClubsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'ClubsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      clubName: { type: String, index: true, unique: true },
      clubType: { type: String, optional: true },
      mainPhoto: { type: String, optional: true },
      description: { type: String, optional: true },
      tags: { type: [String], optional: true },
      relevantMajors: { type: [String], optional: true },
      meetingInfo: { type: [String], optional: true },
      contactName: { type: String, optional: true },
      contactEmail: { type: String, optional: true },
      photos: { type: [String], optional: true },
      admins: { type: [String], optional: true },
    }, { tracker: Tracker });
    // Ensure collection documents obey schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

export const Clubs = new ClubsCollection();
