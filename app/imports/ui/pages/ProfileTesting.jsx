import React from 'react';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';

/* A simple static component to render some text for the landing page. */
const ProfileTesting = () => {
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
    </Container>
  ) : <LoadingSpinner />);
};

export default ProfileTesting;
