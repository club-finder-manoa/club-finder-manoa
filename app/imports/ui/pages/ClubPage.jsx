import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Image, Row, Col, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import { Clubs } from '../../api/clubs/Clubs';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';
import PropTypes from 'prop-types';

const MakePage = ({ club }) => (
  <Container id="landing-page" fluid className="py-3">
    <Row className="align-middle text-center">
      <Col xs={4}>
        <Image src={club.mainPhoto} width={50} />
      </Col>

      <Col xs={8} className="d-flex flex-column justify-content-center">
        <h1>{club.clubName}</h1>
        <p>{club.clubType}</p>
        <p>{club.description}</p>
      </Col>
    </Row>

    <h3>Meeting Times and Location</h3>
    <p>{club.meetingInfo}</p>

    <h3>Contact Us!</h3>
    <Table striped bordered hover size="sm">
      <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{club.contactName}</td>
        <td>{club.contactEmail}</td>
      </tr>
      </tbody>
    </Table>

  </Container>
);

/* A simple static component to render some text for the landing page. */
const ClubPage = () => {
  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    return {
      ready: sub1.ready()
    };
  }, []);
  const emails = _.pluck(Profiles.collection.find().fetch(), 'email');
// There is a potential race condition. We might not be ready at this point.
// Need to ensure that getProfileData doesn't throw an error on line 18.
  const profileInfo = emails.map(email => getProfileInfo(email));
  return ready ? (
    <Container id={PageIDs.profilesPage} style={pageStyle}>
      {profileInfo.map((profile, index) => <MakePage key={index} profile={profile} />)}
    </Container>
  ) : <LoadingSpinner />;
};

export default ClubPage;

