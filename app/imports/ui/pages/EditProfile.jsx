import React, { useState } from 'react';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField, HiddenField } from 'uniforms-bootstrap5';
import { Container, Col, Card, Row, Image, Button, Badge, Modal, Form } from 'react-bootstrap';
import { X, Plus } from 'react-bootstrap-icons';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';
import ChangePwModal from '../components/ChangePwModal';
import { ComponentIDs, PageIDs } from '../utilities/ids';
import { interests } from '../utilities/interests';

/* Create a schema to specify the structure of the data to appear in the form. */
const bridge = new SimpleSchema2Bridge(Users.schema);

const AddInterestModal = ({ user }) => {
  const [show, setShow] = useState(false);
  const [interest, setInterest] = useState('');
  const email = user.email;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addEm = () => {
    let ints = Users.collection.find({ email }).fetch()[0].interests;
    if (ints && ints.includes(interest)) {
      // eslint-disable-next-line no-alert
      swal(`Already saved "${interest}" as an interest.`);
    } else if (ints) {
      ints.push(interest);
    } else {
      ints = [interest];
    }
    Meteor.call('updateInterests', { email, interests: ints });
    setInterest('');
    handleClose();
  };

  const plusButtonStyle = {
    borderWidth: 0,
    fontSize: '15px',
    fontWeight: 500,
    borderRadius: '20px',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '6px',
    paddingRight: '6px',
  };

  return (
    <>
      <Button style={plusButtonStyle} onClick={handleShow}>
          &nbsp;&nbsp;Add<Plus style={{ paddingBottom: '2px', fontSize: '24px' }} />
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Container className="mt-2">
          <Modal.Header closeButton>
            <Modal.Title>
              <h3><b>Add New Interest</b></h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-4">
            <Form.Group controlId="selectInterest">
              <Form.Label>Select an interest</Form.Label>
              <Form.Control as="select" value={interest} onChange={e => setInterest(e.target.value)}>
                {interests.map((inter) => <option key={inter}>{inter}</option>)}
              </Form.Control>
            </Form.Group>
            <br />
            {interest !== '' ? <span>Add <b>{interest}</b> to interests?</span> : ''}
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button variant="light" onClick={handleClose}>
              Back
            </Button>
            <Button variant="success" onClick={() => addEm()}>
              Confirm
            </Button>
          </Modal.Footer>
        </Container>
      </Modal>
    </>
  );
};

AddInterestModal.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    adminForClubs: PropTypes.arrayOf(String),
  }).isRequired,
};

// Popup modal to confirm removal of admin status
const RemoveInterestModal = ({ user, interestToRemove }) => {
  const [show, setShow] = useState(false);
  const email = user.email;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const removeInterest = () => {
    const ints = Users.collection.find({ email }).fetch()[0].interests;
    // eslint-disable-next-line no-restricted-syntax
    for (const i in ints) {
      if (ints[i] === interestToRemove) {
        ints.splice(i, 1);
      }
    }
    Meteor.call('updateInterests', { email, interests: ints });
    handleClose();
  };

  const xButtonStyle = {
    padding: 0,
    fontSize: '20px',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingBottom: '5px',
  };

  return (
    <>
      <Button style={xButtonStyle} onClick={handleShow}>
        <X />
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Container className="mt-2">
          <Modal.Header closeButton>
            <Modal.Title>
              <h3><b>Remove Interest</b></h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove <b>{interestToRemove}</b> from your interests?
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button variant="light" onClick={handleClose}>
              Back
            </Button>
            <Button variant="danger" onClick={() => removeInterest()}>
              Remove
            </Button>
          </Modal.Footer>
        </Container>
      </Modal>
    </>
  );
};

RemoveInterestModal.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
  interestToRemove: PropTypes.string.isRequired,
};

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
              <Col className="justify-content-center d-flex">
                {user.interests ?
                  user.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      className="rounded-pill"
                      style={{ fontSize: '14px', fontWeight: 600, paddingTop: '1px', paddingBottom: 0, paddingStart: '15px', paddingEnd: '8px' }}
                      bg="secondary"
                    >&nbsp;{interest} <RemoveInterestModal interestToRemove={interest} user={user} />
                    </Badge>
                  ))
                  : ''}
                <AddInterestModal user={user} />
              </Col>
            </Row>
            <Row className="py-3">
              <Col className="d-flex justify-content-end">
                <Button id="backButton" onClick={() => navigate('/profile')}>
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
