import React from 'react';
import { AutoForm, TextField, LongTextField, SelectField, SubmitField, ErrorsField, HiddenField } from 'uniforms-bootstrap5';
import { Container, Col, Card, Row } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import swal from 'sweetalert';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';

/* Create a schema to specify the structure of the data to appear in the form. */
const bridge = new SimpleSchema2Bridge(Users.schema);

/* Renders the EditProfile Page: what appears after the user logs in. */
const EditProfile = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();

  document.title = 'Club Finder Mānoa - Edit Profile';

  const { user, ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub = Meteor.subscribe(Users.userPublicationName);
    const document = Users.collection.findOne({ _id });

    return {
      ready: sub.ready(),
      user: document,
    };
  }, []);

  /* On submit, insert the data. */
  const submit = (data) => {
    const { email, displayName, aboutMe, picture, interests } = data;
    if (Meteor.call('updateUser', { email, displayName, aboutMe, picture, interests })) {
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
          <AutoForm model={user} schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={6}><TextField id={ComponentIDs.homeFormFirstName} name="displayName" showInlineError placeholder={user.displayName} /></Col>
                </Row>
                <LongTextField id={ComponentIDs.homeFormBio} name="aboutMe" placeholder={user.aboutMe} />
                <Row>
                  <Col xs={6}><TextField name="picture" showInlineError placeholder={user.picture} /></Col>
                </Row>
                <Row>
                  <Col xs={6}><SelectField name="interests" showInlineError multiple placeholder={user.interests} /></Col>
                </Row>
                <SubmitField value="Save" />
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
