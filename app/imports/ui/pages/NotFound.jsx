import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';

/* Render a Not Found page if the user enters a URL that doesn't match any route. */
const NotFound = () => {
  document.title = 'Club Finder Mānoa - Page Not Found';

  return (
    <Container>
      <Row className="justify-content-center">
        <Col className="text-center mt-3">
          <h3><b>Page Not Found</b></h3>
          <br />
          <Image className="mt-2" src="https://i.kym-cdn.com/photos/images/newsfeed/001/042/619/4ea.jpg" />
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
