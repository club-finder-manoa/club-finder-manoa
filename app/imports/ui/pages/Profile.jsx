import React, { useState } from 'react';
import { Button, Card, Col, Container, Image, Modal, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';

// Popup modal to confirm reset password
const ChangePwModal = ({ userId }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const changePw = (newPw) => {
    Meteor.call('changePw', { userId, newPw });
    handleClose();
    // eslint-disable-next-line no-alert
    alert('Password successfully updated.');
  };

  const changeStyle = {
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
    color: '#0878A9',
  };

  return (
    <>
      <Button style={changeStyle} onClick={handleShow}>
        <u>Change Password</u>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Container className="mt-2">
          <Modal.Header closeButton>
            <Modal.Title>
              <h3><b>Change Password</b></h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-4">
            Old password:
            New password:
            Confirm new password:
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button variant="light" onClick={handleClose}>
              Back
            </Button>
            <Button variant="info" onClick={() => changePw()}>
              Save
            </Button>
          </Modal.Footer>
        </Container>
      </Modal>
    </>
  );
};

ChangePwModal.propTypes = {
  userId: PropTypes.string.isRequired,
};

const Profile = () => {
  const { ready, userProfile } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Users.userPublicationName);
    const rdy = sub1.ready();
    const userData = Users.collection.find({ email: Meteor.user()?.username }).fetch()[0];
    return {
      userProfile: userData,
      ready: rdy,
    };
  }, []);

  const interestsString = (interests) => {
    let interestsFormatted = 'None Saved';
    if (interests) {
      interestsFormatted = '';
      // eslint-disable-next-line no-restricted-syntax
      for (const interest of interests) {
        interestsFormatted += `${interest}, `;
      }
      interestsFormatted = interestsFormatted.substring(0, interestsFormatted.length - 2);
    }
    return interestsFormatted;
  };

  return (ready ? (
    <Container fluid className="py-3 backgroundImageTop">
      <Row>
        <Col className="d-flex justify-content-center">
          {/* Picture */}
          <Image id="imgProfile" roundedCircle src={userProfile.picture} width="300px" />
        </Col>
      </Row>
      <Row>
        <Card id="cardProfile">
          <Col className="text-center pt-3">
            <h1 id="profileName">{userProfile.firstName} {userProfile.lastName}</h1>
            <h5>{userProfile.major}</h5>
            <p>{userProfile.email}</p>
            <hr />
            <p>{userProfile.aboutMe}</p>
            <hr />
            <p>Interests: {interestsString(userProfile.interests)}</p>
          </Col>
        </Card>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center py-3">
          <Link to={`/edit-profile/${userProfile._id}`} className="btn btn-primary">Edit Profile</Link>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center pb-3">
          <ChangePwModal userId={userProfile.accountID} />
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default Profile;
