import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Image, Row, Col, Button, Table, Accordion, FormSelect } from 'react-bootstrap';
import { List, Grid, ChevronDown, ChevronUp, CaretUpFill, CaretDownFill, Check } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Clubs } from '../../api/clubs/Clubs';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from '../utilities/pageStyles';
import { interests } from '../utilities/interests';
import { PageIDs } from '../utilities/ids';
import SaveClubModal from '../components/SaveClubModal';

const viewButtonStyleSelected = {
  backgroundColor: '#2d8259',
  borderWidth: 0,
  color: 'white',
};

const viewButtonStyle = {
  backgroundColor: 'transparent',
  borderWidth: 0,
  color: 'grey',
};

const expandDescButtonStyle = {
  backgroundColor: 'transparent',
  borderWidth: 0,
  color: 'grey',
  fontSize: '18px',
  padding: 2,
};

const textBoxStyle = {
  borderRadius: '8px',
  borderWidth: '1.5px',
  borderColor: 'lightgrey',
  paddingLeft: '8px',
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingRight: '8px',
};

const sortListButtonStyle = {
  backgroundColor: 'transparent',
  borderWidth: 0,
  color: 'grey',
  fontSize: '14px',
  padding: 0,
};

/* Component for club card. */
const MakeCard = ({ club, user }) => {
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
        <Card.Header id="club-header" style={{ backgroundColor: 'white' }}>
          <a style={{ color: 'black', textDecoration: 'none' }} href={`/club/${club._id}`}>
            <Col style={{ height: '100px' }} className="d-flex justify-content-center my-2">
              {club.mainPhoto ? <Image style={{ maxWidth: '90%', maxHeight: '100%' }} className="my-auto" src={club.mainPhoto} /> : ''}
            </Col>
            <Card.Title className="pt-1"><b>{club.clubName}</b></Card.Title>
          </a>
          <Card.Subtitle className="mb-1"><span className="date">{club.clubType}</span></Card.Subtitle>
          {club.tags ? club.tags.map((tag, index) => <Badge key={index} className="rounded-pill" bg="secondary">{tag}</Badge>) : ''}
          <Row className="mt-2 mb-1">
            <Col>
              <a style={{ textDecoration: 'none', fontWeight: 600 }} href={`/club/${club._id}`}>More info</a>
            </Col>
            <Col className="text-end">
              {user.savedClubs?.includes(club.clubName) ?
                <span style={{ color: '#256546' }}><Check /> Saved</span> :
                <SaveClubModal clubName={club.clubName} email={user.email} />}
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-2" style={{ backgroundColor: '#F6F6F6' }}>
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
    _id: PropTypes.string,
    mainPhoto: PropTypes.string,
    clubName: PropTypes.string,
    clubType: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    savedClubs: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Component for club table item */
const ClubTableItem = ({ club, user }) => {
  const [expandedDesc, setExpandedDesc] = useState(false);

  const shortDesc = () => {
    // eslint-disable-next-line for-direction
    for (let i = 0; i < club.description.length; i++) {
      if ((club.description[i] === ' ' || club.description[i] === ',') && i > 50) {
        return `${club.description.substring(0, i)}...`;
      }
    }
    return club.description;
  };

  return (
    <tr>
      <td>
        <Col className="d-flex justify-content-center">
          <Link to={`/club/${club._id}`} style={{ textDecoration: 'none', color: 'black' }}>
            {club.mainPhoto ? <Image src={club.mainPhoto} width="75px" /> : ''}
          </Link>
        </Col>
      </td>
      <td>
        <Row>
          <Col>
            <Row>
              <Col>
                <Link to={`/club/${club._id}`} style={{ textDecoration: 'none', color: 'black', fontWeight: 600 }}>
                  {club.clubName}
                </Link>
              </Col>
              <Col className="text-end col-2">
                {user.savedClubs.includes(club.clubName) ?
                  <span style={{ color: '#256546' }}><Check /> Saved</span> :
                  <SaveClubModal clubName={club.clubName} email={user.email} />}
              </Col>
            </Row>
            <Row>
              <Col>
                {expandedDesc ? club.description : shortDesc()}
              </Col>
              {shortDesc().length < club.description.length ? (
                <Col className="col-1 d-flex justify-content-end">
                  <Button style={expandDescButtonStyle} onClick={() => (expandedDesc ? setExpandedDesc(false) : setExpandedDesc(true))}>
                    {expandedDesc ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </Col>
              ) : '' }
              {expandedDesc ? <a style={{ textDecoration: 'none', fontWeight: 600 }} href={`/club/${club._id}`}>More info</a> : ''}
            </Row>
          </Col>
        </Row>
      </td>
      <td>{club.clubType}</td>
      <td>
        {club.tags ? club.tags.map((tag, index) => <Badge key={index} className="my-auto rounded-pill" bg="secondary">{tag}</Badge>) : ''}
      </td>
    </tr>
  );
};

ClubTableItem.propTypes = {
  club: PropTypes.shape({
    _id: PropTypes.string,
    mainPhoto: PropTypes.string,
    clubName: PropTypes.string,
    clubType: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    savedClubs: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Renders the EditProfile Collection as a set of Cards. */
const AllClubs = () => {
  const [cardView, setCardView] = useState(true);
  const [interest, setInterest] = useState('');
  const [clubType, setClubType] = useState('');
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [filteredClubs, setFilteredClubs] = useState([]);

  // values: na = name ascending
  //         nd = name descending
  //         ta = type ascending
  //         td = type descending
  const [sortBy, setSortBy] = useState('na');

  const { ready, clubs, user } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(Users.userPublicationName);
    const clubList = Clubs.collection.find().fetch();
    const usr = Users.collection.find({ email: Meteor.user()?.username }).fetch()[0];
    return {
      ready: sub1.ready() && sub2.ready(),
      clubs: clubList,
      user: usr,
    };
  }, []);

  const clubTypes = ['Any', 'Academic/Professional', 'Ethnic/Cultural', 'Fraternity/Sorority', 'Honorary Society', 'Leisure/Recreational',
    'Political', 'Service', 'Spiritual/Religious', 'Sports/Leisure', 'Student Affairs'];

  // set clubs in filteredClubs when finished loading, set page title
  useEffect(() => {
    if (ready) {
      setFilteredClubs(clubs);
    }
  }, [ready]);

  // for filtering
  useEffect(() => {
    let filtered = clubs;
    switch (sortBy) {
    case 'nd':
      filtered = _.sortBy(filtered, 'clubName').reverse();
      break;
    case 'ta':
      filtered = _.sortBy(filtered, 'clubType');
      break;
    case 'td':
      filtered = _.sortBy(filtered, 'clubType').reverse();
      break;
    default:
      filtered = _.sortBy(filtered, 'clubName');
      break;
    }
    if (clubName) {
      filtered = filtered.filter(function (obj) { return obj.clubName.toLowerCase().includes(clubName.toLowerCase()); });
    }
    if (description) {
      filtered = filtered.filter(function (obj) { return obj.description.toLowerCase().includes(description.toLowerCase()); });
    }
    if (interest && interest !== 'Any') {
      filtered = filtered.filter(function (obj) {
        if (obj.tags) {
          return obj.tags.some(tag => tag.includes(interest));
        }
        return obj.tags != null;
      });
    }
    if (clubType && clubType !== 'Any') {
      filtered = filtered.filter(function (obj) { return obj.clubType.includes(clubType); });
    }
    setFilteredClubs(filtered);
  }, [clubName, description, interest, clubType, sortBy]);

  document.title = 'Club Finder Mānoa - All Clubs';

  // displays clubs as cards or as a list
  function displayClubs() {
    if (cardView) {
      return (
        <Row xs={1} md={2} lg={4} className="g-2">
          {filteredClubs.map((club, index) => <MakeCard key={index} club={club} user={user} />)}
        </Row>
      );
    }
    return (
      <Table striped bordered style={{ tableLayout: 'fixed' }}>
        <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
          <tr>
            <th style={{ width: '100px' }}>
              Image
            </th>
            <th style={{ width: '55%' }}>
              <Row className="ms-0">
                Name
                <Col>
                  <Button style={sortListButtonStyle} onClick={() => (sortBy === 'na' ? setSortBy('nd') : setSortBy('na'))}>
                    {sortBy === 'nd' ? <CaretUpFill /> : <CaretDownFill />}
                  </Button>
                </Col>
              </Row>
            </th>
            <th>
              <Row className="ms-0">
                Type
                <Col>
                  <Button style={sortListButtonStyle} onClick={() => (sortBy === 'ta' ? setSortBy('td') : setSortBy('ta'))}>
                    {sortBy === 'td' ? <CaretUpFill /> : <CaretDownFill />}
                  </Button>
                </Col>
              </Row>
            </th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {filteredClubs.map((club) => <ClubTableItem key={club._id} club={club} user={user} />)}
        </tbody>
      </Table>
    );
  }

  return (
    <Container id={PageIDs.allClubsPage} style={pageStyle}>
      <Row className="align-middle text-center">
        <Col />
        <Col className="d-flex flex-column justify-content-center mb-3">
          <h1 style={{ color: '#16211b' }} className="my-2"><b>All Clubs</b></h1>
          {`${filteredClubs.length} club`}{filteredClubs.length === 1 ? '' : 's'}
        </Col>
        <Col className="text-end my-auto">
          <Button style={cardView ? viewButtonStyleSelected : viewButtonStyle} onClick={() => setCardView(true)} id="card-view-btn">
            <Grid /> Card View
          </Button>
          <Button style={cardView ? viewButtonStyle : viewButtonStyleSelected} onClick={() => setCardView(false)} id="list-view-btn">
            <List /> List View
          </Button>
        </Col>
      </Row>
      <Accordion className="mb-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header id="search-option-drpdwn">
            Search Options
          </Accordion.Header>
          <Accordion.Body>
            <Row className="px-3 pb-3">
              <Col className="d-flex justify-content-center">
                <label htmlFor="Search by name">
                  <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
                    Name
                  </Col>
                  <div id="search-by-name">
                    <input
                      type="text"
                      style={textBoxStyle}
                      placeholder="Enter Club Name"
                      onChange={e => setClubName(e.target.value)}
                    />
                  </div>
                </label>
              </Col>
              <Col className="d-flex justify-content-center">
                <label htmlFor="Search by description">
                  <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
                    Description
                  </Col>
                  <input
                    type="text"
                    style={textBoxStyle}
                    placeholder="Enter Club Description"
                    onChange={e => setDescription(e.target.value)}
                  />
                </label>
              </Col>
              <Col className="d-flex justify-content-center">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="Search by type">
                  <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
                    Type
                  </Col>
                  <FormSelect
                    id="filterDropdown"
                    className="px-2"
                    variant="secondary"
                    title={clubType === '' ? 'Select a Club Type' : clubType}
                    onChange={(e) => setClubType(e.target.value)}
                  >
                    {clubTypes.map((type, key) => <option value={type} key={key}>{type}</option>)}
                  </FormSelect>
                </label>
              </Col>
              <Col className="d-flex justify-content-center">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="Search by interest">
                  <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
                    Interests
                  </Col>
                  <FormSelect
                    id="filterDropdown"
                    className="px-2"
                    variant="secondary"
                    title={interest === '' ? 'Select an Interest' : interest}
                    onChange={(e) => setInterest(e.target.value)}
                  >
                    {interests.map((inter, key) => <option value={inter} key={key}>{inter}</option>)}
                  </FormSelect>
                </label>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {ready ? displayClubs() : <LoadingSpinner />}
    </Container>
  );
};

export default AllClubs;
