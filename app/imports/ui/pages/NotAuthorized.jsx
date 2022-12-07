import React from 'react';
import { Col, Container, Row, Image } from 'react-bootstrap';

/* Render a Not Authorized page if the user enters a URL that doesn't match any route. */
const NotAuthorized = () => {
  document.title = 'Club Finder Mānoa - Not Authorized';

  return (
    <div className="backgroundImageTop">
      <Container>
        <Row className="justify-content-center mt-3">
          <Col className="text-center">
            <h2>
              <b>Not Authorized</b>
            </h2>
            <Image className="mt-3" src="https://media.tenor.com/wDawKwVafzAAAAAC/conan-o-brien-window.gif" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotAuthorized;
