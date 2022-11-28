import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Button, Col, Container, Row, Table, Modal, Form } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { PlusCircleFill, XCircleFill } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { Users } from '../../api/users/Users';
import { Clubs } from '../../api/clubs/Clubs';
import LoadingSpinner from '../components/LoadingSpinner';

const RemoveAdminStatusModal = ({ user, clubToRemove }) => {
  const [show, setShow] = useState(false);
  const email = user.email;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const removeEm = () => {
    const adminArray = Users.collection.find({ email }).fetch()[0].adminForClubs;
    adminArray.pop(clubToRemove);
    Meteor.call('updatePermissions', { email, adminArray });
    handleClose();
  };

  const xButtonStyle = {
    padding: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  };

  return (
    <>
      <Button style={xButtonStyle} onClick={handleShow}>
        <XCircleFill style={{ paddingBottom: '6px', fontSize: '20px' }} />
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Container className="mt-2">
          <Modal.Header closeButton>
            <Modal.Title>
              <h3><b>Remove Permissions</b></h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove <b>{email}</b>&apos;s admin permissions for <b>{clubToRemove}</b>?
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button variant="light" onClick={handleClose}>
              Back
            </Button>
            <Button variant="danger" onClick={() => removeEm()}>
              Remove
            </Button>
          </Modal.Footer>
        </Container>
      </Modal>
    </>
  );
};

RemoveAdminStatusModal.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    adminForClubs: PropTypes.arrayOf(String),
  }).isRequired,
  clubToRemove: PropTypes.string.isRequired,
};

const AddAdminStatusModal = ({ user }) => {
  const [show, setShow] = useState(false);
  const [adminClub, setAdminClub] = useState('');
  const email = user.email;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const clubs = Clubs.collection.find().fetch();

  const addEm = () => {
    let adminArray = Users.collection.find({ email }).fetch()[0].adminForClubs;
    if (adminArray && adminArray.includes(adminClub)) {
      // eslint-disable-next-line no-alert
      alert(`User ${email} is already an admin for "${adminClub}".`);
    } else if (adminArray) {
      adminArray.push(adminClub);
      Meteor.call('updatePermissions', { email, adminArray });
      setAdminClub('');
      handleClose();
    } else {
      adminArray = [adminClub];
      Meteor.call('updatePermissions', { email, adminArray });
      setAdminClub('');
      handleClose();
    }
  };

  const plusButtonStyle = {
    borderWidth: 0,
    fontSize: '15px',
    fontWeight: 500,
    borderRadius: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingLeft: '15px',
  };

  return (
    <>
      <Button style={plusButtonStyle} onClick={handleShow}>
        Add&nbsp;<PlusCircleFill style={{ paddingBottom: '4px', fontSize: '18px' }} />
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Container className="mt-2">
          <Modal.Header closeButton>
            <Modal.Title>
              <h3><b>Add Permissions</b></h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-4">
            <Form.Group controlId="selectClub">
              <Form.Label>Select a club</Form.Label>
              <Form.Control as="select" value={adminClub} onChange={e => setAdminClub(e.target.value)}>
                {clubs.map((club) => <option key={club.clubName}>{club.clubName}</option>)}
              </Form.Control>
            </Form.Group>
            <br />
            {adminClub !== '' ? <span>Assign <b>{email}</b> admin permissions for <b>{adminClub}</b>?</span> : ''}
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

AddAdminStatusModal.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    adminForClubs: PropTypes.arrayOf(String),
  }).isRequired,
};

const DeleteUserModal = ({ email }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /* eslint-disable no-console */
  const deleteUser = () => {
    Meteor.call('removeUser', { email });
    console.log(`${email} removed from Users collection`);
    Meteor.call('removeAccount', { email });
    console.log(`${email} removed from users`);
    handleClose();
  };

  const deleteStyle = {
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
    color: 'red',
  };

  return (
    <>
      <Button style={deleteStyle} onClick={handleShow}>
        <u>Delete</u>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Container className="mt-2">
          <Modal.Header closeButton>
            <Modal.Title>
              <h3><b>Delete Account</b></h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-4">
            Are you sure you want to delete the user <b>{email}</b>?<br /><br />
            This action cannot be undone.
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button variant="light" onClick={handleClose}>
              Back
            </Button>
            <Button variant="danger" onClick={() => deleteUser()}>
              Delete
            </Button>
          </Modal.Footer>
        </Container>
      </Modal>
    </>
  );
};

DeleteUserModal.propTypes = {
  email: PropTypes.string.isRequired,
};

const UserListItem = ({ user }) => {
  const resetPw = () => {
    // eslint-disable-next-line no-alert
    alert('Password reset! (not really, still need to figure this out)');
  };

  const badgeStyle = {
    fontSize: '15px',
    fontWeight: 500,
    paddingTop: '5px',
    paddingBottom: '3px',
    paddingLeft: '15px',
    borderRadius: '10px',
  };

  const resetStyle = {
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
    color: '#0878A9',
  };

  function clubNameShortened(club) {
    for (let i = 0; i < club.length; i++) {
      if ((club[i] === ' ' || club[i] === ',') && i > 40) {
        return `${club.substring(0, i)}...`;
      }
    }
    return club;
  }

  return (
    <tr>
      <td>{user.email}</td>
      <td>
        {user.email !== 'admin@hawaii.edu' ? (
          <Col>
            {user.adminForClubs && user.adminForClubs.length > 0 ? user.adminForClubs.map((club, index) => (
              <Row className="mb-1" key={index}>
                <Col>
                  <Badge id="adminClubBadge" key={index} bg="secondary" className="me-2" style={badgeStyle}>
                    {clubNameShortened(club)}&nbsp;<RemoveAdminStatusModal user={user} clubToRemove={club} />
                  </Badge>
                </Col>
              </Row>
            )) : ''}
            <AddAdminStatusModal key={user._id} user={user} />
          </Col>
        ) : 'All'}
      </td>
      <td>
        <Button style={resetStyle} onClick={() => resetPw(user.email)}><u>Reset</u></Button>
      </td>
      <td>
        {user.email !== 'admin@hawaii.edu' ?
          <DeleteUserModal email={user.email} />
          : '' }
      </td>
    </tr>
  );
};

UserListItem.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
    adminForClubs: PropTypes.arrayOf(String),
  }).isRequired,
};

const Admin = () => {
  const { ready, users } = useTracker(() => {
    const subscription = Meteor.subscribe(Users.userPublicationName);
    Meteor.subscribe(Clubs.userPublicationName);
    const rdy = subscription.ready();
    const user = Users.collection.find({}).fetch();
    return {
      users: user,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2><b>Users</b></h2>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>Admin Permissions</th>
                <th>Reset Password</th>
                <th>Delete Account</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => <UserListItem key={user._id} user={user} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default Admin;
