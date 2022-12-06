import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Button, Col, Container, Row, Table, Modal, Form, Image } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { X } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Users } from '../../api/users/Users';
import { Clubs } from '../../api/clubs/Clubs';
import LoadingSpinner from '../components/LoadingSpinner';
import { PageIDs, ComponentIDs } from '../utilities/ids';

// Popup modal to confirm removal of admin status
const RemoveAdminStatusModal = ({ user, clubToRemove }) => {
  const [show, setShow] = useState(false);
  const email = user.email;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const removeEm = () => {
    const adminArray = Users.collection.find({ email }).fetch()[0].adminForClubs;
    // eslint-disable-next-line no-restricted-syntax
    for (const i in adminArray) {
      if (adminArray[i] === clubToRemove) {
        adminArray.splice(i, 1);
      }
    }
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
      <Button id="remove-admin-btn" style={xButtonStyle} onClick={handleShow}>
        <X style={{ paddingBottom: '4px', fontSize: '24px' }} />
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
            <Button id="confirm-remove-admin" variant="danger" onClick={() => removeEm()}>
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

// Popup modal to confirm adding admin status for user
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
    padding: 0,
    backgroundColor: 'transparent',
    color: '#0878A9',
  };

  return (
    <>
      <Button id="admin-add-club" style={plusButtonStyle} onClick={handleShow}>
        <u>Add</u>
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
              <Form.Control id="admin-form-select" as="select" value={adminClub} onChange={e => setAdminClub(e.target.value)}>
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
            <Button id="confirm-add-club" variant="success" onClick={() => addEm()}>
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

// Popup modal to confirm deletion of user account
const DeleteUserModal = ({ email }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteUser = () => {
    Meteor.call('removeUser', { email });
    Meteor.call('removeAccount', { email });
    swal('User successfully deleted.', 'Success');
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
      <Button id="delete-user-btn" style={deleteStyle} onClick={handleShow}>
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
            <b style={{ color: 'red' }}>This action is permanent and cannot be undone.</b>
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button variant="light" onClick={handleClose}>
              Back
            </Button>
            <Button id="confirm-user-delete" variant="danger" onClick={() => deleteUser()}>
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

// Popup modal to confirm reset password
const ResetPwModal = ({ userId, email }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetPw = () => {
    Meteor.call('resetPw', { userId });
    swal('Password has been reset.', 'User\'s password reset to: changeme\n\nPlease alert user of password reset.');
    handleClose();
  };

  const resetStyle = {
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
    color: '#0878A9',
  };

  return (
    <>
      <Button id="reset-password-btn" style={resetStyle} onClick={handleShow}>
        <u>Reset</u>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Container className="mt-2">
          <Modal.Header closeButton>
            <Modal.Title>
              <h3><b>Reset Password</b></h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-4">
            Are you sure you want to reset the password for <b>{email}</b>?<br /><br />
            The user&apos;s old password will be lost. The new password will be set to <b>changeme</b>
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button variant="light" onClick={handleClose}>
              Back
            </Button>
            <Button id="confirm-reset-password" variant="danger" onClick={() => resetPw()}>
              Reset
            </Button>
          </Modal.Footer>
        </Container>
      </Modal>
    </>
  );
};

ResetPwModal.propTypes = {
  userId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

// User item for table. Includes email, admin status, reset pw button, and delete account button
const UserListItem = ({ user }) => {
  const badgeStyle = {
    fontSize: '15px',
    fontWeight: 500,
    paddingTop: '5px',
    paddingBottom: '3px',
    paddingLeft: '15px',
    borderRadius: '10px',
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
      <td>
        <a href={`/profile/${user._id}`} style={{ textDecoration: 'none', color: 'black' }}>
          <Row>
            <Col className="col-3 d-flex justify-content-center">
              <Image roundedCircle src={user.picture} height="60px" />
            </Col>
            <Col>
              <b>{user.displayName}</b>
              <br />
              {user.email}
            </Col>
          </Row>
        </a>
      </td>
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
            <AddAdminStatusModal id={ComponentIDs.addAdminPermsBtn} key={user._id} user={user} />
          </Col>
        ) : 'All'}
      </td>
      <td>
        <ResetPwModal userId={user.accountID} email={user.email} />
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
    accountID: PropTypes.string,
    email: PropTypes.string,
    displayName: PropTypes.string,
    picture: PropTypes.string,
    adminForClubs: PropTypes.arrayOf(String),
  }).isRequired,
};

// Admin page
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

  document.title = 'Club Finder Mānoa - Admin Dashboard';

  return (ready ? (
    <Container id={PageIDs.adminPage} className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2><b>Edit Users</b></h2>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name/Email</th>
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
