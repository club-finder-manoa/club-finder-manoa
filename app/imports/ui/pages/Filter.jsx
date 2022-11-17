import React from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Container, Card, Image, Badge, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { AutoForm, SelectField, SubmitField } from 'uniforms-bootstrap5';
import { Users } from '../../api/users/Users';
import { Clubs } from '../../api/clubs/Clubs';
import LoadingSpinner from '../components/LoadingSpinner';
import { useStickyState } from '../utilities/StickyState';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';

/* Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests) => new SimpleSchema({
  interests: { type: Array, label: 'Interests', optional: true },
  'interests.$': { type: String, allowedValues: allInterests },
});

/* Component for layout out a Profile Card. */
const MakeCard = ({ profile }) => (
  <Col>
    <Card className="h-100">
      <Card.Header><Image src={profile.picture} width={50} /></Card.Header>
      <Card.Body>
        <Card.Title>{profile.firstName} {profile.lastName}</Card.Title>
        <Card.Subtitle><span className="date">{profile.title}</span></Card.Subtitle>
        <Card.Text>{profile.bio}</Card.Text>
      </Card.Body>
      <Card.Body>
        {profile.interests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}
      </Card.Body>
      <Card.Footer>
        <h5>Projects</h5>
        {profile.projects.map((project, index) => <Image key={index} src={project} width={50} />)}
      </Card.Footer>
    </Card>
  </Col>
);

/* Properties */
MakeCard.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    picture: PropTypes.string,
    title: PropTypes.string,
    bio: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
    projects: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Renders the Profile Collection as a set of Cards. */
const Filter = () => {
  const [interests, setInterests] = useStickyState('interests', []);

  const { ready, interestDocs } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(Users.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready(),
      interestDocs: Users.collection.find().fetch(),
    };
  }, []);

  const submit = (data) => {
    setInterests(data.interests || []);
  };

  const allInterests = _.pluck(interestDocs, 'name');
  const formSchema = makeSchema(allInterests);
  const bridge = new SimpleSchema2Bridge(formSchema);
  const transform = (label) => ` ${label}`;

  return ready ? (
    <Container id={PageIDs.filterPage} style={pageStyle}>
      <AutoForm schema={bridge} onSubmit={data => submit(data)} model={{ interests }}>
        <Card>
          <Card.Body id={ComponentIDs.filterFormInterests}>
            <SelectField name="interests" multiple placeholder="Users" checkboxes transform={transform} />
            <SubmitField id={ComponentIDs.filterFormSubmit} value="Submit" />
          </Card.Body>
        </Card>
      </AutoForm>
    </Container>
  ) : <LoadingSpinner />;
};

export default Filter;
