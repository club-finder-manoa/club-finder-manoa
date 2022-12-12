import React from 'react';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField, HiddenField } from 'uniforms-bootstrap5';
import { Container, Col, Card, Row, Image, Button, Badge } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
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
    const { email, displayName, aboutMe, picture } = data;
    if (Meteor.call('updateUser', { email, displayName, aboutMe, picture })) {
      swal('Error', 'Something went wrong.', 'error');
    } else {
      swal('Success', 'Profile updated successfully', 'success');
      if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
        navigate(`/admin-profile/${_id}`);
      } else {
        navigate(`/profile/${_id}`);
      }
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
          <Col className="text-center">

            <Row>
              <Col className="text-center pt-3 justify-content-center d-flex small">
                <TextField id={ComponentIDs.homeFormFirstName} name="displayName" showInlineError placeholder={user.displayName} />
              </Col>
            </Row>
            <Row>
              <Col className="text-center d-flex justify-content-center small">
                <TextField id="profile-picture" name="picture" showInlineError placeholder={user.picture} />
              </Col>
            </Row>
            <hr />
            <Row className="text-center mx-5 small">
              <LongTextField id={ComponentIDs.homeFormBio} name="aboutMe" placeholder={user.aboutMe} />
            </Row>
            <hr />
            <span className="small text-center">Interests:</span>
            <br />
            <Row className="mt-2 mb-4">
              <Col>
                {user.interests ?
                  user.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      className="rounded-pill"
                      style={{ fontSize: '15px', fontWeight: 600, paddingTop: '6px', paddingBottom: '6px' }}
                      bg="secondary"
                    >{interest}
                    </Badge>
                  ))
                  : ''}
              </Col>
            </Row>
            <Row className="py-3">
              <Col className="d-flex justify-content-end">
                <Button id="backButton" onClick={() => navigate(`/profile/${_id}`)}>
                  Discard Changes
                </Button>
              </Col>
              <Col className="d-flex justify-content-start">
                <SubmitField id="save-changes-btn" value="Save Changes" />
              </Col>
              <ErrorsField />
              <HiddenField name="savedClubs" />
              <HiddenField name="adminForClubs" />
              <HiddenField name="email" />
            </Row>
          </Col>
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
