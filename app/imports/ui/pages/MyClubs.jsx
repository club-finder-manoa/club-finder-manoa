import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Image, Row, Col, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import { Clubs } from '../../api/clubs/Clubs';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

/* Component for club card. */
const MakeCard = ({ club }) => {
  const expandDescButtonStyle = {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'grey',
    fontSize: '18px',
    padding: 2,
  };

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
      <Card className="h-100" id="my-clubs-page">
        <a style={{ color: 'black', textDecoration: 'none' }} href="/TempClubPage">
          <Card.Header id="myclubs-club-header">
            {club.mainPhoto ? <Image src={club.mainPhoto} width={50} /> : ''}
            <Card.Title className="pt-1"><b>{club.clubName}</b></Card.Title>
            <Card.Subtitle><span className="date">{club.clubType}</span></Card.Subtitle>
            {club.tags ? club.tags.map((tag, index) => <Badge key={index} className="mt-2 rounded-pill" bg="info">{tag}</Badge>) : ''}
          </Card.Header>
        </a>
        <Card.Body className="p-2">
          <Row className="mx-2">
            {expandedDesc ? club.description : shortDesc()}
          </Row>
          {shortDesc().length < club.description.length ? (
            <Row className="mx-2 align-text-bottom">
              <Button className="text-end" style={expandDescButtonStyle} onClick={() => (expandedDesc ? setExpandedDesc(false) : setExpandedDesc(true))}>
                {expandedDesc ? <ChevronUp /> : <ChevronDown />}
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

/* Renders the Clubs Collection as a set of Cards. */
const MyClubs = () => {

  const { ready, clubs } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    let loaded = false;
    const sub = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(Users.userPublicationName);
    const clubList = [];
    if (sub.ready() && sub2.ready()) {
      const myClubs = (Users.collection.find({ email: Meteor.user().username }).fetch())[0].savedClubs;
      // eslint-disable-next-line no-restricted-syntax
      for (const club of myClubs) {
        clubList.push(Clubs.collection.find({ clubName: club }).fetch()[0]);
      }
      loaded = true;
    }
    return {
      ready: loaded,
      clubs: clubList,
    };
  }, []);
  // There is a potential race condition. We might not be ready at this point.
  // Need to ensure that getProfileData doesn't throw an error on line 18.
  return ready ? (
    <div className="backgroundImageTop">
      <Container id={PageIDs.profilesPage} style={pageStyle}>
        <Row className="align-middle text-center">
          <Col className="d-flex flex-column justify-content-center">
            <h1>
              <b>My Clubs</b>
            </h1>
          </Col>
        </Row>
        <Row xs={1} md={2} lg={4} className="g-2">
          {clubs.map((club, index) => <MakeCard key={index} club={club} />)}
        </Row>
      </Container>
    </div>
  ) : <LoadingSpinner />;
};

export default MyClubs;
