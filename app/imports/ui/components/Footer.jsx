import React from 'react';
import { Col, Container } from 'react-bootstrap';

/* The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="footer mt-auto py-3 bg-dark">
    <Container>
      <Col className="text-center small" style={{ color: 'white' }}>
        Club Finder Mānoa
        <br />
        University of Hawaii
        <br />
        <a style={{ color: 'white' }} href="https://club-finder-manoa.github.io">https://club-finder-manoa.github.io</a>
      </Col>
    </Container>
  </footer>
);

export default Footer;
