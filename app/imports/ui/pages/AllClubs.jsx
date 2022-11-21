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

const expandDescButtonStyle = {
  backgroundColor: 'white',
  borderWidth: 0,
  color: 'grey',
  fontSize: '16px',
  padding: 0,
};

/* Component for club card. */
const MakeCard = ({ club }) => {
  const [expandedDesc, setExpandedDesc] = useState(false);

  const shortDesc = () => {
    // eslint-disable-next-line for-direction
    for (let i = 0; i < club.description.length; i++) {
      if ((club.description[i] === ' ' || club.description[i] === ',') && i > 70) {
        return `${club.description.substring(0, i)}...`;
      }
    }
    return club.description;
  };

  return (
    <Col>
      <Card className="h-100">
        <a style={{ color: 'black', textDecoration: 'none' }} href="/TempClubPage">
          <Card.Header>
            {club.mainPhoto ? <Image src={club.mainPhoto} width={50} /> : ''}
            <Card.Title className="pt-1"><b>{club.clubName}</b></Card.Title>
            <Card.Subtitle><span className="date">{club.clubType}</span></Card.Subtitle>
            {club.tags ? club.tags.map((tag, index) => <Badge key={index} className="mt-2" bg="info">{tag}</Badge>) : ''}
          </Card.Header>
        </a>
        <Card.Body className="p-2">
          <Row className="mx-2">
            {expandedDesc ? club.description : shortDesc()}
          </Row>
          {shortDesc().length < club.description.length ? (
            <Row className="mx-2 align-text-bottom">
              <Button className="text-end" style={expandDescButtonStyle} onClick={() => (expandedDesc ? setExpandedDesc(false) : setExpandedDesc(true))}>
                <b>{expandedDesc ? '-' : '+'}</b>
              </Button>
            </Row>
          )
            : ''}
        </Card.Body>
      </Card>
    </Col>
  );
};

MakeCard.propTypes = {
  club: PropTypes.shape({
    mainPhoto: PropTypes.string,
    clubName: PropTypes.string,
    clubType: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
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
