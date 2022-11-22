import React from 'react';
import { AutoForm, TextField, LongTextField, SelectField, SubmitField } from 'uniforms-bootstrap5';
import { Container, Col, Card, Row } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Users } from '../../api/users/Users';
import { Clubs } from '../../api/clubs/Clubs';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';

/* Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests, allProjects) => new SimpleSchema({
  email: { type: String, label: 'Email', optional: true },
  firstName: { type: String, label: 'First', optional: true },
  lastName: { type: String, label: 'Last', optional: true },
  bio: { type: String, label: 'Biographical statement', optional: true },
  title: { type: String, label: 'Title', optional: true },
  picture: { type: String, label: 'Picture URL', optional: true },
  interests: { type: Array, label: 'Interests', optional: true },
  'interests.$': { type: String, allowedValues: allInterests },
  projects: { type: Array, label: 'Projects', optional: true },
  'projects.$': { type: String, allowedValues: allProjects },
});

/* Renders the EditProfile Page: what appears after the user logs in. */
const EditProfile = () => {

  /* On submit, insert the data. */
  const submit = () => {
    /*
    Meteor.call(updateProfileMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'EditProfile updated successfully', 'success');
      }
    });

     */
  };

  const { ready, email } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Users.userPublicationName);
    const sub2 = Meteor.subscribe(Clubs.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready(),
      email: Meteor.user()?.username,
    };
  }, []);
  // Create the form schema for uniforms. Need to determine all interests and projects for muliselect list.
  const allInterests = _.pluck(Users.collection.find().fetch(), 'name');
  const allProjects = '';
  const formSchema = makeSchema(allInterests, allProjects);
  const bridge = new SimpleSchema2Bridge(formSchema);
  // Now create the model with all the user information.
  const projects = '';
  const interests = '';
  const profile = Clubs.collection.findOne({ email });
  const model = _.extend({}, profile, { interests, projects });
  return ready ? (
    <div className="backgroundImageTop">
      <Container id={PageIDs.homePage} className="justify-content-center" style={pageStyle}>
        <Col>
          <Col className="justify-content-center text-center"><h2>Your Profile</h2></Col>
          <AutoForm model={model} schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={4}><TextField id={ComponentIDs.homeFormFirstName} name="firstName" showInlineError placeholder="First Name" /></Col>
                  <Col xs={4}><TextField id={ComponentIDs.homeFormLastName} name="lastName" showInlineError placeholder="Last Name" /></Col>
                  <Col xs={4}><TextField name="email" showInlineError placeholder="email" disabled /></Col>
                </Row>
                <LongTextField id={ComponentIDs.homeFormBio} name="bio" placeholder="Write a little bit about yourself." />
                <Row>
                  <Col xs={6}><TextField name="title" showInlineError placeholder="Title" /></Col>
                  <Col xs={6}><TextField name="picture" showInlineError placeholder="URL to picture" /></Col>
                </Row>
                <Row>
                  <Col xs={6}><SelectField name="interests" showInlineError multiple /></Col>
                  <Col xs={6}><SelectField name="projects" showInlineError multiple /></Col>
                </Row>
                <SubmitField id={ComponentIDs.homeFormSubmit} value="Update" />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Container>
    </div>
  ) : <LoadingSpinner />;
};

export default EditProfile;
