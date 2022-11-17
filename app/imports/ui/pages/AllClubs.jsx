import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Image, Row, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Clubs } from '../../api/clubs/Clubs';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

/* Component for layout out a club Card. */
const MakeCard = ({ club }) => (
  <Col>
    <Card className="h-100">
      <Card.Header>
        <Image src={club.picture} width={50} />
        <Card.Title>{club.clubName}</Card.Title>
        <Card.Subtitle><span className="date">{club.clubType}</span></Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          {club.tags.map((tag, index) => <Badge key={index} bg="info">{tag}</Badge>)}
        </Card.Text>
        <Card.Text>
          <a style={{ color: 'black' }} href="/TempClubPage">Click Here For More Information</a>
        </Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

MakeCard.propTypes = {
  club: PropTypes.shape({
    picture: PropTypes.string,
    clubName: PropTypes.string,
    clubType: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Renders the Profile Collection as a set of Cards. */
const AllClubs = () => {

  const { ready, clubs } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub = Meteor.subscribe(Clubs.userPublicationName);
    const clubList = Clubs.collection.find().fetch();
    return {
      ready: sub.ready(),
      clubs: clubList,
    };
  }, []);
  // There is a potential race condition. We might not be ready at this point.
  // Need to ensure that getProfileData doesn't throw an error on line 18.
  return ready ? (
    <Container id={PageIDs.profilesPage} style={pageStyle}>
      <Row className="align-middle text-center">
        <Col className="d-flex flex-column justify-content-center">
          <h1>
            All Clubs
          </h1>
        </Col>
      </Row>
      <Row xs={1} md={2} lg={4} className="g-2">
        {clubs.map((club, index) => <MakeCard key={index} club={club} />)}

      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default AllClubs;
