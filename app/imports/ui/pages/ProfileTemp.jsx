import React from 'react';
import { Col, Container, Image, Row, Card } from 'react-bootstrap';

/* A simple static component to render some text for the landing page. */
const ProfileTemp = () => (
  <Container id="profileTempBg" fluid className="py-3">
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
  </Container>
);

export default ProfileTemp;
