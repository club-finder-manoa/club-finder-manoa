import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Image, Row, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Clubs } from '../../api/clubs/Clubs';
import { ProfilesInterests } from '../../api/clubs/ProfilesInterests';
import { ProfilesProjects } from '../../api/clubs/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

/* Returns the Profile and associated Projects and Users associated with the passed user email. */
function getProfileData(email) {
  const data = Clubs.collection.findOne({ email });
  const interests = _.pluck(ProfilesInterests.collection.find({ profile: email }).fetch(), 'interest');
  const projects = _.pluck(ProfilesProjects.collection.find({ profile: email }).fetch(), 'project');
  const projectPictures = projects.map(project => Projects.collection.findOne({ name: project })?.picture);
  // console.log(_.extend({ }, data, { interests, projects: projectPictures }));
  return _.extend({}, data, { interests, projects: projectPictures });
}

/* Component for layout out a Profile Card. */
const MakeCard = ({ profile }) => (
  <Col>
    <Card className="h-100">
      <Card.Header>
        <Image src={profile.picture} width={50} />
        <Card.Title>{profile.clubName}</Card.Title>
        <Card.Subtitle><span className="date">{profile.clubType}</span></Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          {profile.description}
        </Card.Text>
        <Card.Text>
          {profile.interests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}
        </Card.Text>
        <h6>Contact Info</h6>
        <Card.Text>
          {/* {profile.projects.map((project, index) => <Image key={index} src={project} width={50} />)} */}
          {profile.contactName}<br />
          {profile.contactEmail}
        </Card.Text>
        <Card.Text>
          <a style={{ color: 'black' }} href="/TempClubPage">Click Here For More Information</a>
        </Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

MakeCard.propTypes = {
  profile: PropTypes.shape({
    picture: PropTypes.string,
    clubName: PropTypes.string,
    clubType: PropTypes.string,
    description: PropTypes.string,
    contactName: PropTypes.string,
    contactEmail: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
    projects: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Renders the Profile Collection as a set of Cards. */
const AllClubs = () => {

  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(ProfilesInterests.userPublicationName);
    const sub3 = Meteor.subscribe(ProfilesProjects.userPublicationName);
    const sub4 = Meteor.subscribe(Projects.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
    };
  }, []);
  const emails = _.pluck(Clubs.collection.find().fetch(), 'email');
  // There is a potential race condition. We might not be ready at this point.
  // Need to ensure that getProfileData doesn't throw an error on line 18.
  const profileData = emails.map(email => getProfileData(email));
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
        {profileData.map((profile, index) => <MakeCard key={index} profile={profile} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default AllClubs;
