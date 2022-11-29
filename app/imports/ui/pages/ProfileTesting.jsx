import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Users } from '../../api/users/Users';
import ProfileData from '../components/ProfileData';
import LoadingSpinner from '../components/LoadingSpinner';

/* A simple static component to render some text for the landing page. */
const ProfileTesting = () => {
  const { ready, userProfile } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Users.userPublicationName);
    const rdy = sub1.ready();
    const userData = Users.collection.find({}).fetch();
    return {
      userProfile: userData,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container fluid className="py-3 backgroundImageTop">
      <Row>
        <Col>
          {userProfile.map((profile) => (<Col key={profile._id}><ProfileData profile={profile} /></Col>))}
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ProfileTesting;
