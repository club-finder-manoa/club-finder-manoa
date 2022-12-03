import React from 'react';
import { AutoForm, TextField, LongTextField, SelectField, SubmitField, ErrorsField, HiddenField } from 'uniforms-bootstrap5';
import { Container, Col, Card, Row, Image, Button } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';
import ChangePwModal from '../components/ChangePwModal';
import { ComponentIDs, PageIDs } from '../utilities/ids';

/* Create a schema to specify the structure of the data to appear in the form. */
const bridge = new SimpleSchema2Bridge(Users.schema);

/* Renders the EditProfile Page: what appears after the user logs in. */
const EditProfile = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const navigate = useNavigate();

  document.title = 'Club Finder Mānoa - Profile';

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
      navigate('/profile');
    }
  };

  // Now create the model with all the user information.
  return ready ? (
    <Container id={PageIDs.editProfilePage} fluid className="py-3 backgroundImageTop">
      <Row>
        <Col className="d-flex justify-content-center">
          {/* Picture */}
          <Image id="imgProfile" roundedCircle src={user.picture} width="300px" />
        </Col>
      </Row>
      <Card id="cardProfile">
        <AutoForm model={user} schema={bridge} onSubmit={data => submit(data)}>

          <Row>
            <Col className="text-center pt-3 justify-content-center d-flex">
              <TextField id={ComponentIDs.homeFormFirstName} name="displayName" showInlineError placeholder={user.displayName} />
            </Col>
          </Row>
          <Row>
            <Col className="text-center d-flex justify-content-center">
              <TextField name="picture" showInlineError placeholder={user.picture} />
            </Col>
          </Row>
          <Row className="text-center mx-5">
            <LongTextField id={ComponentIDs.homeFormBio} name="aboutMe" placeholder={user.aboutMe} />
          </Row>
          <Row className="text-center mx-5">
            <SelectField name="interests" showInlineError multiple placeholder={user.interests} />
          </Row>
          <Row className="py-3">
            <Col className="d-flex justify-content-end">
              <Button id="backButton" onClick={() => navigate('/profile')}>
                Discard Changes
              </Button>
            </Col>
            <Col className="d-flex justify-content-start">
              <SubmitField value="Save Changes" />
            </Col>
            <ErrorsField />
            <HiddenField name="savedClubs" />
            <HiddenField name="adminForClubs" />
            <HiddenField name="email" />
          </Row>
        </AutoForm>

      </Card>

      <Row>
        <Col className="d-flex justify-content-center pb-3">
          <ChangePwModal />
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default EditProfile;
