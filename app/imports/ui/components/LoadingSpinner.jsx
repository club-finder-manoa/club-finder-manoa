import React from 'react';
import { Container, Row, Spinner } from 'react-bootstrap';

const LoadingSpinner = () => (
  <div className="backgroundImageTop" style={{ height: '25vh' }}>
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Spinner animation="border" className="me-2 mb-2" />
        Loading
      </Row>
    </Container>
  </div>
);

export default LoadingSpinner;
