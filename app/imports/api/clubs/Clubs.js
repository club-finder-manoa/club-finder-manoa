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
      website: { type: String, optional: true },
      tags: { type: Array, optional: true },
      'tags.$': { type: String },
      meetingInfo: { type: Array, optional: true },
      'meetingInfo.$': { type: String },
      contactName: { type: String, optional: true },
      contactEmail: { type: String, optional: true },
      photos: { type: Array, optional: true },
      'photos.$': { type: String },
      admins: { type: Array, optional: true },
      'admins.$': { type: String },
    }, { tracker: Tracker });
    // Ensure collection documents obey schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

export const Clubs = new ClubsCollection();
