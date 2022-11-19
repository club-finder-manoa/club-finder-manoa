import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Image, Row, Col, Button } from 'react-bootstrap';
import { List, Grid } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Clubs } from '../../api/clubs/Clubs';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

/* Component for layout out a club Card. */
const MakeCard = ({ club }) => (
  <Col>
    <a style={{ color: 'black', textDecoration: 'none' }} href="/TempClubPage">
      <Card className="h-100">
        <Card.Body>
          {club.mainPhoto ? <Image src={club.mainPhoto} width={50} /> : ''}
          <Card.Title><b>{club.clubName}</b></Card.Title>
          <Card.Subtitle><span className="date">{club.clubType}</span></Card.Subtitle>
          {club.tags ? club.tags.map((tag, index) => <Badge key={index} className="mt-2" bg="info">{tag}</Badge>) : ''}
        </Card.Body>
      </Card>
    </a>
  </Col>
);

const viewButtonStyleSelected = {
  backgroundColor: '#388a60',
  borderWidth: 0,
  borderRadius: '25px',
  color: 'white',
};

const viewButtonStyle = {
  backgroundColor: 'white',
  borderWidth: 0,
  color: 'grey',
};

MakeCard.propTypes = {
  club: PropTypes.shape({
    mainPhoto: PropTypes.string,
    clubName: PropTypes.string,
    clubType: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Renders the Profile Collection as a set of Cards. */
const AllClubs = () => {
  const [cardView, setCardView] = useState(true);

  const { ready, clubs } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub = Meteor.subscribe(Clubs.userPublicationName);
    const clubList = Clubs.collection.find().fetch();
    return {
      ready: sub.ready(),
      clubs: clubList,
    };
  }, []);

  function displayClubs() {
    if (cardView) {
      return (
        <Row xs={1} md={2} lg={4} className="g-2">
          {clubs.map((club, index) => <MakeCard key={index} club={club} />)}
        </Row>
      );
    }
    return 'hi there';
  }

  return (
    <Container id={PageIDs.profilesPage} style={pageStyle}>
      <Row className="align-middle text-center">
        <Col />
        <Col className="d-flex flex-column justify-content-center">
          <h1>
            <b>All Clubs</b>
          </h1>
        </Col>
        <Col className="text-end my-auto">
          <Button style={cardView ? viewButtonStyle : viewButtonStyleSelected} onClick={() => setCardView(false)}>
            <List /> List View
          </Button>
          <Button style={cardView ? viewButtonStyleSelected : viewButtonStyle} onClick={() => setCardView(true)}>
            <Grid /> Card View
          </Button>
        </Col>
      </Row>
      {ready ? displayClubs() : <LoadingSpinner />}
    </Container>
  );
};

export default AllClubs;
