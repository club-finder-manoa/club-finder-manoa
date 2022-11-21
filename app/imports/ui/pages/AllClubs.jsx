import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Image, Row, Col, Button, Table, DropdownButton, Dropdown } from 'react-bootstrap';
import { List, Grid } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Clubs } from '../../api/clubs/Clubs';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

const viewButtonStyleSelected = {
  backgroundColor: '#2d8259',
  borderWidth: 0,
  color: 'white',
};

const viewButtonStyle = {
  backgroundColor: 'white',
  borderWidth: 0,
  color: 'grey',
};

const expandDescButtonStyle = {
  backgroundColor: 'white',
  borderWidth: 0,
  color: 'grey',
  fontSize: '16px',
  padding: 0,
};

const textBoxStyle = {
  borderRadius: '10px',
  borderWidth: '1px',
  paddingLeft: '8px',
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingRight: '8px',
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
  const [interest, setInterest] = useState('');
  const [clubType, setClubType] = useState('');
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [filteredClubs, setFilteredClubs] = useState([]);

  const { ready, clubs } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub = Meteor.subscribe(Clubs.userPublicationName);
    const clubList = Clubs.collection.find().fetch();
    return {
      ready: sub.ready(),
      clubs: clubList,
    };
  }, []);

  // set clubs in filteredClubs when finished loading
  useEffect(() => {
    if (ready) {
      setFilteredClubs(clubs);
    }
  }, [ready]);

  // for filtering
  useEffect(() => {
    let filtered = clubs;
    if (clubName) {
      filtered = filtered.filter(function (obj) { return obj.clubName.toLowerCase().includes(clubName.toLowerCase()); });
    }
    if (description) {
      filtered = filtered.filter(function (obj) { return obj.description.toLowerCase().includes(description.toLowerCase()); });
    }
    if (interest) {
      filtered = filtered.filter(function (obj) {
        if (obj.tags) {
          return obj.tags.some(tag => tag.includes(interest));
        }
        return obj.tags != null;
      });
    }
    if (clubType) {
      filtered = filtered.filter(function (obj) { return obj.clubType.includes(clubType); });
    }
    setFilteredClubs(filtered);
  }, [clubName, description, interest, clubType]);

  // displays clubs as cards or as a list
  function displayClubs() {
    if (cardView) {
      return (
        <Row xs={1} md={2} lg={4} className="g-2">
          {filteredClubs.map((club, index) => <MakeCard key={index} club={club} />)}
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
          {filteredClubs.map((club) => <ClubTableItem key={club._id} club={club} />)}
        </tbody>
      </Table>
    );
  }

  return (
    <Container id={PageIDs.profilesPage} style={pageStyle}>
      <Row className="align-middle text-center">
        <Col />
        <Col className="d-flex flex-column justify-content-center">
          <h1><b>All Clubs</b></h1>
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
      <Row className="pt-2 px-3 pb-4">
        <Col className="d-flex justify-content-center">
          <label htmlFor="Search by name">
            <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
              Name
            </Col>
            <input
              type="text"
              className="shadow-sm"
              style={textBoxStyle}
              placeholder="Enter Club Name"
              onChange={e => setClubName(e.target.value)}
            />
          </label>
        </Col>
        <Col className="d-flex justify-content-center">
          <label htmlFor="Search by description">
            <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
              Description
            </Col>
            <input
              type="text"
              className="shadow-sm"
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
            <DropdownButton
              id="filterDropdown"
              variant="secondary"
              title={clubType === '' ? 'Select a Club Type' : clubType}
              onSelect={(e) => setClubType(e)}
            >
              <Dropdown.Item eventKey="">Any</Dropdown.Item>
              <Dropdown.Item eventKey="Academic/Professional">Academic/Professional</Dropdown.Item>
              <Dropdown.Item eventKey="Ethnic/Cultural">Ethnic/Cultural</Dropdown.Item>
              <Dropdown.Item eventKey="Fraternity/Sorority">Fraternity/Sorority</Dropdown.Item>
              <Dropdown.Item eventKey="Honorary Society">Honorary Society</Dropdown.Item>
              <Dropdown.Item eventKey="Leisure/Recreational">Leisure/Recreational</Dropdown.Item>
              <Dropdown.Item eventKey="Political">Political</Dropdown.Item>
              <Dropdown.Item eventKey="Service">Service</Dropdown.Item>
              <Dropdown.Item eventKey="Spiritual/Religious">Spiritual/Religious</Dropdown.Item>
              <Dropdown.Item eventKey="Sports/Leisure">Sports/Leisure</Dropdown.Item>
              <Dropdown.Item eventKey="Student Affairs">Student Affairs</Dropdown.Item>
            </DropdownButton>
          </label>
        </Col>
        <Col className="d-flex justify-content-center">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="Search by interest">
            <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
              Tags
            </Col>
            <DropdownButton
              id="filterDropdown"
              variant="secondary"
              title={interest === '' ? 'Select an Interest' : interest}
              onSelect={(e) => setInterest(e)}
            >
              <Dropdown.Item eventKey="">Any</Dropdown.Item>
              <Dropdown.Item eventKey="Accounting">Accounting</Dropdown.Item>
              <Dropdown.Item eventKey="American Indian">American Indian</Dropdown.Item>
              <Dropdown.Item eventKey="Architecture">Architecture</Dropdown.Item>
              <Dropdown.Item eventKey="Business">Business</Dropdown.Item>
              <Dropdown.Item eventKey="Fitness">Fitness</Dropdown.Item>
              <Dropdown.Item eventKey="Fraternity">Fraternity</Dropdown.Item>
              <Dropdown.Item eventKey="Library">Library</Dropdown.Item>
              <Dropdown.Item eventKey="Marketing">Marketing</Dropdown.Item>
              <Dropdown.Item eventKey="Math">Math</Dropdown.Item>
              <Dropdown.Item eventKey="Politics">Politics</Dropdown.Item>
              <Dropdown.Item eventKey="Science">Science</Dropdown.Item>
              <Dropdown.Item eventKey="Sorority">Sorority</Dropdown.Item>
              <Dropdown.Item eventKey="Sports">Sports</Dropdown.Item>
            </DropdownButton>
          </label>
        </Col>
      </Row>
      {ready ? displayClubs() : <LoadingSpinner />}
    </Container>
  );
};

export default AllClubs;
