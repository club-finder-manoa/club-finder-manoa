import React from 'react';
import { Col, Container, Image, Row, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/* A simple static component to render some text for the landing page. */
const Profile = () => {
  const goTo = useNavigate();
  const goToPath = () => {
    goTo('/edit-profile');
  };

  return (
    <Container fluid className="py-3 backgroundImageTop">
      <Row>
        <Col className="d-flex justify-content-center">
          {/* Picture */}
          <Image id="imgProfile" roundedCircle src="https://github.com/philipmjohnson.png" width="300px" />
        </Col>
      </Row>
      <Row>
        <Card id="cardProfile">
          <Col className="text-center pt-3">
            <h1 id="profileName">Philip Johnson</h1>
            {/* Title */}
            <h5>Professor</h5>
            <hr />
            {/* Bio */}
            <p>I am a Professor and like to paddle outrigger canoes.</p>
            <hr />
            {/* Users */}
            <p>Interests: Software Engineering, Climate Change</p>
            <hr />
            {/* Major */}
            <p>Major: Computer Science</p>
          </Col>
        </Card>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center py-3">
          <Button color="primary" className="px-4" onClick={goToPath}>
            Edit Profile
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
