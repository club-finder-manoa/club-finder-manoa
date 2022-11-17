import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import UserListItem from '../components/UserListItem';
import { Users } from '../../api/users/Users';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const Admin = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, users } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Users.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const user = Users.collection.find({}).fetch();
    return {
      users: user,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>Club Admin List</h2>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Admin Status</th>
                <th>Change Password</th>
                <th>Delete Account</th>
                <th>Change Admin Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => <UserListItem key={user._id} stuff={user} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default Admin;
