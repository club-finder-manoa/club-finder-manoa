import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Image, Row, Col, Table, FormSelect, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate, useParams } from 'react-router-dom';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { Plus, X } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { Clubs } from '../../api/clubs/Clubs';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';
import { ComponentIDs, PageIDs } from '../utilities/ids';
import { interests } from '../utilities/interests';

const bridge = new SimpleSchema2Bridge(Clubs.schema);

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

const EditClub = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const clubTypes = ['Academic/Professional', 'Ethnic/Cultural', 'Fraternity/Sorority', 'Honorary Society', 'Leisure/Recreational', 'Political', 'Service', 'Spiritual/Religious', 'Sports/Leisure', 'Student Affairs'];
  const [clubType, setClubType] = useState('');

  const { ready, club, oldClubName } = useTracker(() => {
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(Users.userPublicationName);
    const oneClub = Clubs.collection.find({ _id: _id }).fetch()[0];
    const origClubName = oneClub.clubName;
    return {
      ready: sub1.ready() && sub2.ready(),
      club: oneClub,
      oldClubName: origClubName,
    };
  }, false);

  function updateTitleAndCheck() {
    if (club) {
      document.title = `Club Finder Mānoa - ${club.clubName}`;
    } else {
      document.title = 'Club Finder Mānoa - Page Not Found';
    }
  }

  /* On submit, insert the data. */
  const submit = (data) => {
    // eslint-disable-next-line max-len
    const { clubName, mainPhoto, description, website, meetingTimeSunday, meetingLocationSunday, meetingTimeMonday, meetingLocationMonday, meetingTimeTuesday, meetingLocationTuesday, meetingTimeWednesday, meetingLocationWednesday, meetingTimeThursday, meetingLocationThursday, meetingTimeFriday, meetingLocationFriday, meetingTimeSaturday, meetingLocationSaturday, contactName, contactEmail } = data;

    // HELP
    Object.values(club.interestedUsers).forEach(intUser => {
      Meteor.call('removeClub', { email: intUser, clubName: oldClubName });
    });
    Object.values(club.interestedUsers).forEach(intUser => {
      Meteor.call('saveClub', { email: intUser, clubName: clubName });
    });
    // END HELP

    // eslint-disable-next-line max-len
    if (Meteor.call('updateClub', { _id, clubName, clubType, mainPhoto, description, website, meetingTimeSunday, meetingLocationSunday, meetingTimeMonday, meetingLocationMonday, meetingTimeTuesday, meetingLocationTuesday, meetingTimeWednesday, meetingLocationWednesday, meetingTimeThursday, meetingLocationThursday, meetingTimeFriday, meetingLocationFriday, meetingTimeSaturday, meetingLocationSaturday, contactName, contactEmail })) {
      swal('Error', 'Something went wrong.', 'error');
    } else {
      swal('Success', 'Profile updated successfully', 'success');
      navigate(`/club/${club._id}`);
    }
  };

  return ready ? (
    <Container id={PageIDs.editClubPage} className="my-3">
      {updateTitleAndCheck()}
      {club ? (
        <div>
          <AutoForm model={club} schema={bridge} onSubmit={data => submit(data)}>
            <Row className="align-middle text-center mb-3">
              <Col>
                <Row className="my-3">
                  <Col>
                    {oldClubName}
                    <Image src={club.mainPhoto} width={200} />
                    <TextField id={ComponentIDs.mainPhoto} name="mainPhoto" showInlineError placeholder={club.mainPhoto} />
                  </Col>
                </Row>
              </Col>
              <Col xs={8} className="d-flex flex-column justify-content-center">
                <TextField id={ComponentIDs.clubName} name="clubName" showInlineError placeholder={club.clubName} />
                Current Club Type : {club.clubType}
                <FormSelect
                  id={ComponentIDs.clubType}
                  as="select"
                  name="clubType"
                  onChange={(e) => setClubType(e.target.value)}
                >
                  {clubTypes.map((type, key) => <option value={type} key={key}>{type}</option>)}
                </FormSelect>
                <TextField className="pt-3" name="website" showInlineError placeholder={club.website} />
                <LongTextField id={ComponentIDs.clubDescription} name="description" showInlineError placeholder={club.description} />
              </Col>
            </Row>
            <Row className="mt-2 mb-4">
              <p>Tags</p>
              <Col className="d-flex">
                {club.tags ? club.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="rounded-pill"
                    style={{ fontSize: '16px', fontWeight: 600, paddingTop: '1px', paddingBottom: '3px', paddingStart: '15px', paddingEnd: '15px' }}
                    bg="secondary"
                  >&nbsp;{tag} <RemoveTagModal tagToRemove={tag} club={club} />
                  </Badge>
                ))
                  : ''}
                <AddTagModal club={club} />
              </Col>
            </Row>
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
                  <td>
                    <TextField name="meetingTimeSunday" showInlineError placeholder={club.meetingTimeSunday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationSunday" showInlineError placeholder={club.meetingLocationSunday} />
                  </td>
                </tr>
                <tr>
                  <td>Monday</td>
                  <td>
                    <TextField name="meetingTimeMonday" showInlineError placeholder={club.meetingTimeMonday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationMonday" showInlineError placeholder={club.meetingLocationMonday} />
                  </td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>
                    <TextField name="meetingTimeTuesday" showInlineError placeholder={club.meetingTimeTuesday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationTuesday" showInlineError placeholder={club.meetingLocationTuesday} />
                  </td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>
                    <TextField name="meetingTimeWednesday" showInlineError placeholder={club.meetingTimeWednesday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationWednesday" showInlineError placeholder={club.meetingLocationWednesday} />
                  </td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>
                    <TextField name="meetingTimeThursday" showInlineError placeholder={club.meetingTimeThursday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationThursday" showInlineError placeholder={club.meetingLocationThursday} />
                  </td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>
                    <TextField name="meetingTimeFriday" showInlineError placeholder={club.meetingTimeFriday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationFriday" showInlineError placeholder={club.meetingLocationFriday} />
                  </td>
                </tr>
                <tr>
                  <td>Saturday</td>
                  <td>
                    <TextField name="meetingTimeSaturday" showInlineError placeholder={club.meetingTimeSaturday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationSaturday" showInlineError placeholder={club.meetingLocationSaturday} />
                  </td>
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
                  <td><TextField id={ComponentIDs.clubContactName} name="contactName" showInlineError placeholder={club.contactName} /></td>
                  <td><TextField id={ComponentIDs.clubContactEmail} name="contactEmail" showInlineError placeholder={club.contactEmail} /></td>
                </tr>
              </tbody>
            </Table>
            <Col className="d-flex justify-content-center">
              <SubmitField id="save-changes-btn" value="Save Changes" />
            </Col>
            <ErrorsField />
          </AutoForm>
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

export default EditClub;
