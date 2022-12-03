import React from 'react';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users } from '../../api/users/Users';

const ProfileAdmin = () => {
  const { _id } = useParams();

  const { ready, userProfile } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Users.userPublicationName);
    const rdy = sub1.ready();
    const userData = Users.collection.find({ _id: _id }).fetch()[0];
    return {
      userProfile: userData,
      ready: rdy,
    };
  }, []);
  document.title = 'Club Finder Mānoa - User Profile';

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
            <h1 id="profileName">{userProfile.displayName}</h1>
            <p>{userProfile.email}</p>
            <hr />
            <p>{userProfile.aboutMe}</p>
            <hr />
            <p>Interests: {interestsString(userProfile.interests)}</p>
          </Col>
        </Card>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ProfileAdmin;
