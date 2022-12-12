import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Image, Row, Col, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Link, useParams } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import swal from 'sweetalert';
import { Plus, X } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { Clubs } from '../../api/clubs/Clubs';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';
import SaveClubModal from '../components/SaveClubModal';
import RemoveClubModal from '../components/RemoveClubModal';
import { interests } from '../utilities/interests';

const AddTagModal = ({ club }) => {
  const [show, setShow] = useState(false);
  const [tag, setTag] = useState('');
  const clubName = club.clubName;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addEm = () => {
    let clubTags = Clubs.collection.find({ clubName }).fetch()[0].tags;
    if (clubTags && clubTags.includes(tag)) {
      // eslint-disable-next-line no-alert
      swal(`Already saved "${tag}" as an interest.`);
    } else if (clubTags) {
      clubTags.push(tag);
    } else {
      clubTags = [tag];
    }
    Meteor.call('updateTags', { clubName, tags: clubTags });
    setTag('');
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
              <h3><b>Add New Tag</b></h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-4">
            <Form.Group controlId="selectInterest">
              <Form.Label>Select a Tag</Form.Label>
              <Form.Control as="select" value={tag} onChange={e => setTag(e.target.value)}>
                {interests.map((inter) => <option key={inter}>{inter}</option>)}
              </Form.Control>
            </Form.Group>
            <br />
            {tag !== '' ? <span>Add <b>{tag}</b> to tags?</span> : ''}
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

AddTagModal.propTypes = {
  club: PropTypes.shape({
    clubName: PropTypes.string,
    adminForClubs: PropTypes.arrayOf(String),
  }).isRequired,
};

// Popup modal to confirm removal of admin status
const RemoveTagModal = ({ club, tagToRemove }) => {
  const [show, setShow] = useState(false);
  const clubName = club.clubName;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const removeInterest = () => {
    const clubTags = Clubs.collection.find({ clubName }).fetch()[0].tags;
    // eslint-disable-next-line no-restricted-syntax
    for (const i in clubTags) {
      if (clubTags[i] === tagToRemove) {
        clubTags.splice(i, 1);
      }
    }
    Meteor.call('updateTags', { clubName, tags: clubTags });
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
              <h3><b>Remove Tag</b></h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove <b>{tagToRemove}</b> from your interests?
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

RemoveTagModal.propTypes = {
  club: PropTypes.shape({
    clubName: PropTypes.string,
  }).isRequired,
  tagToRemove: PropTypes.string.isRequired,
};

const ClubPage = () => {
  const { _id } = useParams();

  const { ready, club, user, clubSaved } = useTracker(() => {
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(Users.userPublicationName);
    const oneClub = Clubs.collection.find({ _id: _id }).fetch()[0];
    const usr = Users.collection.find({ email: Meteor.user()?.username }).fetch()[0];
    const saved = usr ? usr.savedClubs?.includes(oneClub?.clubName) : false;
    return {
      ready: sub1.ready() && sub2.ready(),
      club: oneClub,
      user: usr,
      clubSaved: saved,
    };
  }, false);

  function updateTitleAndCheck() {
    if (club) {
      document.title = `Club Finder Mānoa - ${club.clubName}`;
    } else {
      document.title = 'Club Finder Mānoa - Page Not Found';
    }
  }

  return ready ? (
    <Container className="my-3" id="club-info-page">
      {updateTitleAndCheck()}
      {club ? (
        <div>
          <Row className="align-middle text-center mb-3">
            <Col>
              <Row className="my-3">
                <Col>
                  <Image src={club.mainPhoto} width={200} />
                </Col>
              </Row>
              <Row>
                <Col>
                  {clubSaved ?
                    <div>Remove from <i>My Clubs:</i>&nbsp;&nbsp;<RemoveClubModal buttonText="Remove" clubName={club.clubName} email={Meteor.user()?.username} /></div> :
                    <div>Save to <i>My Clubs:</i>&nbsp;&nbsp;<SaveClubModal clubName={club.clubName} email={Meteor.user()?.username} /></div>}
                </Col>
              </Row>
            </Col>

            <Col xs={8} className="d-flex flex-column justify-content-center">
              <h2><b>{club.clubName}</b></h2>
              <h3 className="mb-3">{club.clubType} Club</h3>
              <h5 className="mb-3">Visit us at {club.website}</h5>
              <h5 className="text-start">About us:</h5>
              <p className="text-start">{club.description}</p>
            </Col>
          </Row>
          {(Roles.userIsInRole(Meteor.userId(), 'admin') || user.adminForClubs?.includes(club.clubName)) ? (
            <Row className="mt-2 mb-4">
              <p>Tags</p>
              <Col className="d-flex">
                {club.tags ? club.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="rounded-pill"
                    style={{ fontSize: '20px', fontWeight: 600, paddingTop: '0px', paddingBottom: '0px', paddingStart: '15px', paddingEnd: '15px' }}
                    bg="secondary"
                  >&nbsp;{tag} <RemoveTagModal tagToRemove={tag} club={club} />
                  </Badge>
                )) : ''}
                <AddTagModal club={club} />
              </Col>
            </Row>
          ) : (
            <Row className="mt-2 mb-4">
              <h5>Club Tags</h5>
              <Col className="d-flex">
                {club.tags ? club.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="rounded-pill"
                    style={{ fontSize: '20px', fontWeight: 600, paddingTop: '1px', paddingBottom: '3px', paddingStart: '15px', paddingEnd: '15px' }}
                    bg="secondary"
                  >&nbsp;{tag}
                  </Badge>
                )) : ''}
              </Col>
            </Row>
          )}
          <h5><b>Meeting Times and Location</b></h5>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sunday</td>
                <td>{club.meetingTimeSunday}</td>
                <td>{club.meetingLocationSunday}</td>
              </tr>
              <tr>
                <td>Monday</td>
                <td>{club.meetingTimeMonday}</td>
                <td>{club.meetingLocationMonday}</td>
              </tr>
              <tr>
                <td>Tuesday</td>
                <td>{club.meetingTimeTuesday}</td>
                <td>{club.meetingLocationTuesday}</td>
              </tr>
              <tr>
                <td>Wednesday</td>
                <td>{club.meetingTimeWednesday}</td>
                <td>{club.meetingLocationWednesday}</td>
              </tr>
              <tr>
                <td>Thursday</td>
                <td>{club.meetingTimeThursday}</td>
                <td>{club.meetingLocationThursday}</td>
              </tr>
              <tr>
                <td>Friday</td>
                <td>{club.meetingTimeFriday}</td>
                <td>{club.meetingLocationFriday}</td>
              </tr>
              <tr>
                <td>Saturday</td>
                <td>{club.meetingTimeSaturday}</td>
                <td>{club.meetingLocationSaturday}</td>
              </tr>
            </tbody>
          </Table>

          <h5><b>Contact</b></h5>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{club.contactName}</td>
                <td>{club.contactEmail}</td>
              </tr>
            </tbody>
          </Table>
          {(Roles.userIsInRole(Meteor.userId(), 'admin') || user.adminForClubs?.includes(club.clubName)) ? (
            <Row>
              <Col className="d-flex justify-content-center py-3">
                <Link to={`/edit-club/${club._id}`} className="btn btn-primary" id="edit-profile-btn">Edit Club</Link>
              </Col>
            </Row>
          ) : ''}
        </div>
      ) : (
        <Col className="text-center mt-3">
          <h3><b>Page Not Found</b></h3>
          <br />
          <Image className="mt-2" src="https://i.kym-cdn.com/photos/images/newsfeed/001/042/619/4ea.jpg" />
        </Col>
      )}

    </Container>
  ) : <LoadingSpinner />;
};

export default ClubPage;
