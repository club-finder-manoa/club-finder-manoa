import React from 'react';
import { Button, Col, Image, Row, Container } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { NavLink } from 'react-router-dom';
import { PageIDs } from '../utilities/ids';

const Landing = () => {
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);

  return (
    <div id={PageIDs.landingPage} className="p-0 m-0 g-0">
      <Container>
        <Row className="px-0 m-0">
          <Col className="d-flex justify-content-center mt-4">
            <Image src="/images/landing-discover-clubs.png" className="px-0" style={{ width: '40%' }} /><br />
          </Col>
          <h4 className="landingText text-center pt-2 mb-3"><b>@UHM</b></h4>
        </Row>
      </Container>
      <Container className="mt-4 mb-4 px-5 text-center" style={{ fontSize: '18px' }}>
        Club Finder Manoa provides a centralized directory for UH Manoa student clubs. Students can log in to browse a well-organized directory
        of all current student clubs and find brief descriptions, meeting times and locations, contact information, and a few select photos.
      </Container>
      {!currentUser ? (
        <Row className="px-0 m-0 my-4">
          <Col className="d-flex justify-content-center">
            <Button className="mt-4 py-2 px-5" as={NavLink} to="/signup">
              <span style={{ fontSize: '22px', fontWeight: '600' }}>Sign Up</span>
            </Button>
          </Col>
        </Row>
      ) : ''}
      <div id="landingBottom">
        <Container>
          <Row className="px-0 m-0 mt-5">
            <Col className="text-center ms-5">
              <h4><b className="landingText">Browse Club Directory</b></h4>
              Sort and search for clubs based on your interests

            </Col>
            <Col className="text-center">
              <h4><b className="landingText">Find More Information</b></h4>
              Club descriptions, meeting times, contact information, and upcoming events

            </Col>
            <Col className="text-center me-5">
              <h4><b className="landingText">Join and Connect</b></h4>
              Join a club that interests you and connect with other students

            </Col>
          </Row>
          <Row className="px-0 m-0">
            <Col className="d-flex justify-content-center pt-4 ms-5">
              <Image src="/images/landing-think.png" style={{ width: '27%' }} />
            </Col>
            <Col className="d-flex justify-content-center pt-3">
              <Image src="/images/landing-talk.png" style={{ width: '75%' }} />
            </Col>
            <Col className="d-flex justify-content-center me-5">
              <Image src="/images/landing-wave.png" style={{ width: '80%' }} />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Landing;
