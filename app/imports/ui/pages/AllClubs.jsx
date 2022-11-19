import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Image, Row, Col, Button, Table } from 'react-bootstrap';
import { List, Grid } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Clubs } from '../../api/clubs/Clubs';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

/* Component for club card. */
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

MakeCard.propTypes = {
  club: PropTypes.shape({
    mainPhoto: PropTypes.string,
    clubName: PropTypes.string,
    clubType: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Component for club table item */
const ClubTableItem = ({ club }) => (
  <tr>
    <td style={{ fontWeight: 600 }}>
      <Link to="/TempClubPage" style={{ textDecoration: 'none', color: 'black' }}>
        {club.mainPhoto ? <Image src={club.mainPhoto} width={50} /> : ''}&nbsp;&nbsp;&nbsp;{club.clubName}
      </Link>
    </td>
    <td>{club.clubType}</td>
    <td>
      {club.tags ? club.tags.map((tag, index) => <Badge key={index} className="my-auto" bg="info">{tag}</Badge>) : ''}
    </td>
  </tr>
);

ClubTableItem.propTypes = {
  club: PropTypes.shape({
    mainPhoto: PropTypes.string,
    clubName: PropTypes.string,
    clubType: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

const viewButtonStyleSelected = {
  backgroundColor: '#388a60',
  borderWidth: 0,
  borderRadius: '25px',
  color: 'white',
};

const viewButtonStyle = {
  backgroundColor: 'white',
  borderWidth: 0,
  borderRadius: '25px',
  color: 'grey',
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
    return (
      <Table striped bordered>
        <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {clubs.map((club) => <ClubTableItem key={club._id} club={club} />)}
        </tbody>
      </Table>
    );
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
          <Button style={cardView ? viewButtonStyleSelected : viewButtonStyle} onClick={() => setCardView(true)}>
            <Grid /> Card View
          </Button>
          <Button style={cardView ? viewButtonStyle : viewButtonStyleSelected} onClick={() => setCardView(false)}>
            <List /> List View
          </Button>
        </Col>
      </Row>
      {ready ? displayClubs() : <LoadingSpinner />}
    </Container>
  );
};

export default AllClubs;
