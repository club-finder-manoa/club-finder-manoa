import React from 'react';
import { AutoForm, TextField, LongTextField, SelectField, SubmitField, ErrorsField, HiddenField } from 'uniforms-bootstrap5';
import { Container, Col, Card, Row } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import swal from 'sweetalert';
import { Users } from '../../api/users/Users';
import { Clubs } from '../../api/clubs/Clubs';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';

/* Create a schema to specify the structure of the data to appear in the form. */
const bridge = new SimpleSchema2Bridge(Users.schema);

/* Renders the EditProfile Page: what appears after the user logs in. */
const EditProfile = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();

  const { doc, ready, firstName2, lastName2, aboutMe2, picture2, interests2 } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Users.userPublicationName);
    const sub2 = Meteor.subscribe(Clubs.userPublicationName);
    const document = Users.collection.findOne(_id);
    let loaded = false;
    let firstNameTemp;
    let lastNameTemp;
    let aboutMeTemp;
    let pictureTemp;
    let interestsTemp;
    if (sub1.ready() && sub2.ready()) {
      if (Users.collection.find({ email: Meteor.user().username })) {
        firstNameTemp = (Users.collection.find({ email: Meteor.user().username }).fetch())[0].firstName;
        lastNameTemp = (Users.collection.find({ email: Meteor.user().username }).fetch())[0].lastName;
        aboutMeTemp = (Users.collection.find({ email: Meteor.user().username }).fetch())[0].aboutMe;
        pictureTemp = (Users.collection.find({ email: Meteor.user().username }).fetch())[0].picture;
        interestsTemp = (Users.collection.find({ email: Meteor.user().username }).fetch())[0].interests;
      }
      loaded = true;
    }

    return {
      doc: document,
      ready: loaded,
      firstName2: firstNameTemp,
      lastName2: lastNameTemp,
      aboutMe2: aboutMeTemp,
      picture2: pictureTemp,
      interests2: interestsTemp,
    };
  }, [_id]);

  /* On submit, insert the data. */
  const submit = (data) => {
    const { email, firstName, lastName, aboutMe, picture, interests } = data;
    if (Meteor.call('updateUser', { email, firstName, lastName, aboutMe, picture, interests })) {
      swal('Error', 'Something went wrong.', 'error');
    } else {
      swal('Success', 'Profile updated successfully', 'success');
    }
  };
  // Now create the model with all the user information.
  return ready ? (
    <div className="backgroundImageTop">
      <Container id={PageIDs.homePage} className="justify-content-center" style={pageStyle}>
        <Col>
          <Col className="justify-content-center text-center"><h2>Your Profile</h2></Col>
          <AutoForm model={doc} schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={6}><TextField id={ComponentIDs.homeFormFirstName} name="firstName" showInlineError placeholder={firstName2} /></Col>
                  <Col xs={6}><TextField id={ComponentIDs.homeFormLastName} name="lastName" showInlineError placeholder={lastName2} /></Col>
                </Row>
                <LongTextField id={ComponentIDs.homeFormBio} name="aboutMe" placeholder={aboutMe2} />
                <Row>
                  <Col xs={6}><TextField name="picture" showInlineError placeholder={picture2} /></Col>
                </Row>
                <Row>
                  <Col xs={6}><SelectField name="interests" showInlineError multiple placeholder={interests2} /></Col>
                </Row>
                <SubmitField value="Update" />
                <ErrorsField />
                <HiddenField name="savedClubs" />
                <HiddenField name="adminForClubs" />
                <HiddenField name="email" />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Container>
    </div>
  ) : <LoadingSpinner />;
};

export default EditProfile;
