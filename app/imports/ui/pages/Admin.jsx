import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Button, Col, Container, Row, Table, Modal } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Trash, PlusCircleFill, XCircleFill } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';

const RemoveAdminStatusModal = ({ user, clubToRemove }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
            Are you sure you want to remove {user}&apos;s admin permissions for &quot;{clubToRemove}&quot;?
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button variant="light" onClick={handleClose}>
              Back
            </Button>
            <Button variant="danger">
              Remove
            </Button>
          </Modal.Footer>
        </Container>
      </Modal>
    </>
  );
};

RemoveAdminStatusModal.propTypes = {
  user: PropTypes.string.isRequired,
  clubToRemove: PropTypes.string.isRequired,
};

const UserListItem = ({ user }) => {

  /* eslint-disable no-console */
  const removeItem = (email) => {
    Meteor.call('removeUser', { email });
    console.log(`${email} removed from Users collection`);
    Meteor.call('removeAccount', { email });
    console.log(`${email} removed from users`);
  };

  const resetPw = () => {
    // TODO, maybe...
    console.log('Password reset! (not really)');
  };

  const badgeStyle = {
    fontSize: '14px',
    fontWeight: 500,
    paddingTop: '5px',
    paddingBottom: '3px',
    paddingLeft: '15px',
    borderRadius: '10px',
  };

  return (
    <tr>
      <td>{user.email}</td>
      <td>
        {user.email !== 'admin@hawaii.edu' ? (
          <Col>
            {user.adminForClubs ? user.adminForClubs.map((club, index) => (
              <Badge key={index} bg="dark" className="me-2" style={badgeStyle}>
                {club}&nbsp;<RemoveAdminStatusModal user={user.email} clubToRemove={club} />
              </Badge>
            )) : <span className="me-2">None</span>}
            <Link className="me-2" to={`/edit/${user.email}`}><PlusCircleFill /></Link>
          </Col>
        ) : 'All'}
      </td>
      <td>
        <Button onClick={() => resetPw(user.email)}>Reset</Button>
      </td>
      <td>
        {user.email !== 'admin@hawaii.edu' ?
          <Button variant="danger" onClick={() => removeItem(user.email)}><Trash className="me-2" />Delete</Button>
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
