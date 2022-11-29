import React from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Image, Row, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/* A simple static component to render some text for the landing page. */
const ProfileData = ({ profile }) => (
  <Container>
    <Row>
      <Col className="d-flex justify-content-center">
        {/* Picture */}
        <Image id="imgProfile" roundedCircle src={profile.picture} width="300px" />
      </Col>
    </Row>
    <Row>
      <Card id="cardProfile">
        <Col className="text-center pt-3">
          <h1 id="profileName">{profile.firstName} {profile.lastName}</h1>
          <h5>{profile.major}</h5>
          <p>{profile.email}</p>
          <hr />
          <p>{profile.aboutMe}</p>
          <hr />
          <p>Interests: {profile.interests}</p>

        </Col>
      </Card>
    </Row>
    <Row>
      <Col className="d-flex justify-content-center py-3">
        <Link to={`/edit-profile/${profile._id}`} className="btn btn-primary">Edit Profile</Link>
      </Col>
    </Row>
  </Container>
);

// Require a document to be passed to this component.
ProfileData.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    aboutMe: PropTypes.string,
    major: PropTypes.string,
    picture: PropTypes.string,
    interests: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default ProfileData;
