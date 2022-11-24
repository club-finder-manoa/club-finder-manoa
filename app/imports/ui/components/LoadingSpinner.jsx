import React from 'react';
import { Container, Row, Spinner } from 'react-bootstrap';

const LoadingSpinner = () => (
  <Container>
    <Row className="justify-content-md-center mt-5">
      <Spinner animation="border" className="me-2 mb-2" />
      Loading
    </Row>
  </Container>
);

export default LoadingSpinner;
