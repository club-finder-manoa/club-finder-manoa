import React, { useState } from 'react';
import { Badge, Button, Card, Col, Container, Form, Image, Modal, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Link, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import { Plus, X } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import LoadingSpinner from '../components/LoadingSpinner';
import ChangePwModal from '../components/ChangePwModal';
import { Users } from '../../api/users/Users';
import { PageIDs } from '../utilities/ids';
import { interests } from '../utilities/interests';

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
      <Button id="add-interest-btn" style={plusButtonStyle} onClick={handleShow}>
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
            <Button id="confirm-add-interest" variant="success" onClick={() => addEm()}>
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

const Profile = () => {
  const { _id } = useParams();

  const { ready, userProfile } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Users.userPublicationName);
    const rdy = sub1.ready();
    const userData = _id ? Users.collection.findOne({ _id }) : Users.collection.findOne({ email: Meteor.user()?.username });
    return {
      userProfile: userData,
      ready: rdy,
    };
  }, []);

  document.title = 'Club Finder Mānoa - User Profile';

  return (ready ? (
    <Container id={PageIDs.profilePage} fluid className="py-3 backgroundImageTop">
      <Row>
        <Col className="d-flex justify-content-center">
          {/* Picture */}
          <Image id="imgProfile" roundedCircle src={userProfile.picture} width="300px" />
        </Col>
      </Row>
      <Row>
        <Card id="cardProfile" className="pb-3">
          <Col className="text-center pt-3">
            <h1 id="profileName">{userProfile.displayName}</h1>
            <p>{userProfile.email}</p>
            <hr />
            <span className="small">About Me:</span>
            <Row className="my-2">
              <p>{userProfile.aboutMe}</p>
            </Row>
            <hr />
            <span className="small">Interests:</span>
            <br />

            <Row className="mt-2 mb-4">
              <Col className="justify-content-center d-flex">
                {userProfile.interests ?
                  userProfile.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      className="rounded-pill"
                      style={{ fontSize: '14px', fontWeight: 600, paddingTop: '1px', paddingBottom: 0, paddingStart: '15px', paddingEnd: '8px' }}
                      bg="secondary"
                    >&nbsp;{interest} <RemoveInterestModal interestToRemove={interest} user={userProfile} />
                    </Badge>
                  ))
                  : ''}
                <AddInterestModal user={userProfile} />
              </Col>
            </Row>
          </Col>
        </Card>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center py-3">
          <Link to="/edit-profile" className="btn btn-primary" id="edit-profile-btn">Edit Profile</Link>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center pb-3">
          <ChangePwModal />
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default Profile;
