import React from 'react';
import { Badge, Card, Col, Container, Image, Row } from 'react-bootstrap';
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

  return (ready ? (
    <Container fluid className="py-3 backgroundImageTop">
      <Row>
        <Col className="d-flex justify-content-center">
          {/* Picture */}
          <Image id="imgProfile" roundedCircle src={userProfile.picture} width="300px" />
        </Col>
      </Row>
      <Row>
        <Card id="cardProfile" className="pb-3">
          <Col className="text-center pt-3">
            <h1 id="profileName">{userProfile.displayName}</h1>
            <p>{userProfile.email}</p>
            <hr />
            <span className="small">About Me:</span>
            <Row className="my-2">
              <p>{userProfile.aboutMe}</p>
            </Row>
            <hr />
            <span className="small">Interests:</span>
            <br />
            <Row className="mt-2 mb-4">
              <Col>
                {userProfile.interests ?
                  userProfile.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      className="rounded-pill"
                      style={{ fontSize: '15px', fontWeight: 600, paddingTop: '6px', paddingBottom: '6px' }}
                      bg="secondary"
                    >{interest}
                    </Badge>
                  ))
                  : ''}
              </Col>
            </Row>
          </Col>
        </Card>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ProfileAdmin;
