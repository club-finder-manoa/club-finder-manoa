import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const UserListItem = ({ user }) => {

  /* eslint-disable no-console */
  const removeItem = (email) => {
    Meteor.call('removeUser', { email });
    console.log(`${email} removed from Users collection`);
    Meteor.call('removeAccount', { email });
    console.log(`${email} removed from Accounts collection`);
  };
  return (
    <tr>
      <td>{user.email}</td>
      <td>
        {user.email !== 'admin@hawaii.edu' ? (
          <Col>
            <Link className="me-2" to={`/edit/${user.email}`}><PencilSquare /></Link>
            {user.adminForClubs ? user.adminForClubs : 'None'}
          </Col>
        ) : ''}
      </td>
      <td>
        <Link to={`/edit/${user.email}`}>Reset</Link>
      </td>
      <td>
        {user.email !== 'admin@hawaii.edu' ?
          <Button variant="danger" onClick={() => removeItem(user.email)}><Trash className="me-2" />Delete</Button>
          : '' }
      </td>
    </tr>
  );
};

// Require a document to be passed to this component.
UserListItem.propTypes = {
  user: PropTypes.shape({
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
            <h2>Users</h2>
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
