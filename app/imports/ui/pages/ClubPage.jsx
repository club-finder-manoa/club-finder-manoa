import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Image, Row, Col, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

function getProfileInfo(email) {
  const data = Profiles.collection.findOne({ email });
  const interests = _.pluck(ProfilesInterests.collection.find({ profile: email }).fetch(), 'interest');
  const projects = _.pluck(ProfilesProjects.collection.find({ profile: email }).fetch(), 'project');
  const projectPictures = projects.map(project => Projects.collection.findOne({ name: project })?.picture);
  // console.log(_.extend({ }, data, { interests, projects: projectPictures }));
  return _.extend({}, data, { interests, projects: projectPictures });
}

const MakePage = ({ profile }) => (
  <Container id="landing-page" fluid className="py-3">
    <Row className="align-middle text-center">
      <Col xs={4}>
        <Image src={profile.picture} width={50} />
      </Col>

      <Col xs={8} className="d-flex flex-column justify-content-center">
        <h1>{profile.clubName}</h1>
        <p>{profile.clubType}</p>
        <p>{profile.description}</p>
      </Col>
    </Row>

    <h3>Meeting Times and Location</h3>
    <Table striped bordered hover size="sm">
      <thead>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Location</th>
        <th>Meeting Description</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Monday, November 21, 2022</td>
        <td>6:00 PM to 7:00 PM</td>
        <td>HL 003F</td>
        <td>General Meeting</td>
      </tr>
      <tr>
        <td>Monday, November 28, 2022</td>
        <td>6:00 PM to 7:00 PM</td>
        <td>HL 003F</td>
        <td>General meeting</td>
      </tr>
      <tr>
        <td>Monday, December 5, 2022</td>
        <td>6:00 PM to 7:00 PM</td>
        <td>HL 003F</td>
        <td>General meeting</td>
      </tr>
      </tbody>
    </Table>

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
        <td>{profile.contactName}</td>
        <td>{profile.contactEmail}</td>
      </tr>
      </tbody>
    </Table>

  </Container>
);

/* A simple static component to render some text for the landing page. */
const ClubPage = () => {
  const { ready } = useTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Profiles.userPublicationName);
  const sub2 = Meteor.subscribe(ProfilesInterests.userPublicationName);
  const sub3 = Meteor.subscribe(ProfilesProjects.userPublicationName);
  const sub4 = Meteor.subscribe(Projects.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
  };
}, []);
const emails = _.pluck(Profiles.collection.find().fetch(), 'email');
// There is a potential race condition. We might not be ready at this point.
// Need to ensure that getProfileData doesn't throw an error on line 18.
const profileInfo = emails.map(email => getProfileInfo(email));
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
      {profileInfo.map((profile, index) => <MakePage key={index} profile={profile} />)}
    </Row>
  </Container>
) : <LoadingSpinner />;
};

export default ClubPage;
