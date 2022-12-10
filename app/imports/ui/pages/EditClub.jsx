import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Image, Row, Col, Table, FormSelect } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate, useParams } from 'react-router-dom';
import { AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { Clubs } from '../../api/clubs/Clubs';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';
import { ComponentIDs, PageIDs } from '../utilities/ids';

const bridge = new SimpleSchema2Bridge(Clubs.schema);

const EditClub = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const clubTypes = ['Academic/Professional', 'Ethnic/Cultural', 'Fraternity/Sorority', 'Honorary Society', 'Leisure/Recreational', 'Political', 'Service', 'Spiritual/Religious', 'Sports/Leisure', 'Student Affairs'];
  const [clubType, setClubType] = useState('');

  const { ready, club } = useTracker(() => {
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(Users.userPublicationName);
    const oneClub = Clubs.collection.find({ _id: _id }).fetch()[0];
    return {
      ready: sub1.ready() && sub2.ready(),
      club: oneClub,
    };
  }, false);

  function updateTitleAndCheck() {
    if (club) {
      document.title = `Club Finder Mānoa - ${club.clubName}`;
    } else {
      document.title = 'Club Finder Mānoa - Page Not Found';
    }
  }

  /* On submit, insert the data. */
  const submit = (data) => {
    const { mainPhoto, clubName, description, contactName, contactEmail } = data;
    if (Meteor.call('updateClub', { _id, mainPhoto, clubName, clubType, description, contactName, contactEmail })) {
      swal('Error', 'Something went wrong.', 'error');
    } else {
      swal('Success', 'Profile updated successfully', 'success');
      navigate(`/club/${club._id}`);
    }
  };

  return ready ? (
    <Container id={PageIDs.editClubPage} className="my-3">
      {updateTitleAndCheck()}
      {club ? (
        <div>
          <AutoForm model={club} schema={bridge} onSubmit={data => submit(data)}>
            <Row className="align-middle text-center mb-3">
              <Col>
                <Row className="my-3">
                  <Col>
                    <Image src={club.mainPhoto} width={200} />
                    <TextField id={ComponentIDs.mainPhoto} name="mainPhoto" showInlineError placeholder={club.mainPhoto} />
                  </Col>
                </Row>
              </Col>
              <Col xs={8} className="d-flex flex-column justify-content-center">
                <TextField id={ComponentIDs.clubName} name="clubName" showInlineError placeholder={club.clubName} />
                Current Club Type : {club.clubType}
                <FormSelect
                  id={ComponentIDs.clubType}
                  as="select"
                  name="clubType"
                  onChange={(e) => setClubType(e.target.value)}
                >
                  {clubTypes.map((type, key) => <option value={type} key={key}>{type}</option>)}
                </FormSelect>
                <LongTextField id={ComponentIDs.clubDescription} className="py-3" name="description" showInlineError placeholder={club.description} />
              </Col>
            </Row>

            <h5><b>Meeting Times and Location</b></h5>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sunday</td>
                  <td><TextField id={ComponentIDs.mainPhoto} name="meetingTimes[]" showInlineError placeholder={club.meetingTimes[0]} /></td>
                  <td>{club.meetingLocations[0]}</td>
                </tr>
                <tr>
                  <td>Monday</td>
                  <td>{club.meetingTimes[1]}</td>
                  <td>{club.meetingLocations[1]}</td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>{club.meetingTimes[2]}</td>
                  <td>{club.meetingLocations[2]}</td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>{club.meetingTimes[3]}</td>
                  <td>{club.meetingLocations[3]}</td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>{club.meetingTimes[4]}</td>
                  <td>{club.meetingLocations[4]}</td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>{club.meetingTimes[5]}</td>
                  <td>{club.meetingLocations[5]}</td>
                </tr>
                <tr>
                  <td>Saturday</td>
                  <td>{club.meetingTimes[6]}</td>
                  <td>{club.meetingLocations[6]}</td>
                </tr>
              </tbody>
            </Table>

            <h5><b>Contact</b></h5>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><TextField id={ComponentIDs.clubContactName} name="contactName" showInlineError placeholder={club.contactName} /></td>
                  <td><TextField id={ComponentIDs.clubContactEmail} name="contactEmail" showInlineError placeholder={club.contactEmail} /></td>
                </tr>
              </tbody>
            </Table>
            <Col className="d-flex justify-content-center">
              <SubmitField id="save-changes-btn" value="Save Changes" />
            </Col>
            <ErrorsField />
            <HiddenField name="tags" />
          </AutoForm>
        </div>
      ) : (
        <Col className="text-center mt-3">
          <h3><b>Page Not Found</b></h3>
          <br />
          <Image className="mt-2" src="https://i.kym-cdn.com/photos/images/newsfeed/001/042/619/4ea.jpg" />
        </Col>
      )}

    </Container>
  ) : <LoadingSpinner />;
};

export default EditClub;
