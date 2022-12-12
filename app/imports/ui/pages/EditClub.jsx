import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Image, Row, Col, Table, FormSelect, Badge } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate, useParams } from 'react-router-dom';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
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

  const { ready, club, oldClubName } = useTracker(() => {
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(Users.userPublicationName);
    const oneClub = Clubs.collection.find({ _id: _id }).fetch()[0];
    const origClubName = oneClub.clubName;
    return {
      ready: sub1.ready() && sub2.ready(),
      club: oneClub,
      oldClubName: origClubName,
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
    // eslint-disable-next-line max-len
    const { clubName, mainPhoto, description, website, meetingTimeSunday, meetingLocationSunday, meetingTimeMonday, meetingLocationMonday, meetingTimeTuesday, meetingLocationTuesday, meetingTimeWednesday, meetingLocationWednesday, meetingTimeThursday, meetingLocationThursday, meetingTimeFriday, meetingLocationFriday, meetingTimeSaturday, meetingLocationSaturday, contactName, contactEmail } = data;

    Object.values(club.interestedUsers).forEach(intUser => {
      Meteor.call('removeClub', { email: intUser, clubName: oldClubName });
    });

    // eslint-disable-next-line max-len
    Meteor.call('updateClub', { _id, clubName, clubType, mainPhoto, description, website, meetingTimeSunday, meetingLocationSunday, meetingTimeMonday, meetingLocationMonday, meetingTimeTuesday, meetingLocationTuesday, meetingTimeWednesday, meetingLocationWednesday, meetingTimeThursday, meetingLocationThursday, meetingTimeFriday, meetingLocationFriday, meetingTimeSaturday, meetingLocationSaturday, contactName, contactEmail });

    if (Object.values(club.interestedUsers).forEach(intUser => {
      Meteor.call('saveClub', { email: intUser, clubName: clubName });
    })) {
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
                <TextField className="pt-3" name="website" showInlineError placeholder={club.website} />
                <LongTextField id={ComponentIDs.clubDescription} name="description" showInlineError placeholder={club.description} />
              </Col>
            </Row>
            <Row className="mt-2 mb-4">
              <p>Tags</p>
              <Col className="d-flex">
                {club.tags ? club.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="rounded-pill"
                    style={{ fontSize: '20px', fontWeight: 600, paddingTop: '1px', paddingBottom: '3px', paddingStart: '15px', paddingEnd: '15px' }}
                    bg="secondary"
                  >&nbsp;{tag}
                  </Badge>
                )) : ''}
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
                  <td>
                    <TextField name="meetingTimeSunday" showInlineError placeholder={club.meetingTimeSunday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationSunday" showInlineError placeholder={club.meetingLocationSunday} />
                  </td>
                </tr>
                <tr>
                  <td>Monday</td>
                  <td>
                    <TextField name="meetingTimeMonday" showInlineError placeholder={club.meetingTimeMonday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationMonday" showInlineError placeholder={club.meetingLocationMonday} />
                  </td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>
                    <TextField name="meetingTimeTuesday" showInlineError placeholder={club.meetingTimeTuesday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationTuesday" showInlineError placeholder={club.meetingLocationTuesday} />
                  </td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>
                    <TextField name="meetingTimeWednesday" showInlineError placeholder={club.meetingTimeWednesday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationWednesday" showInlineError placeholder={club.meetingLocationWednesday} />
                  </td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>
                    <TextField name="meetingTimeThursday" showInlineError placeholder={club.meetingTimeThursday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationThursday" showInlineError placeholder={club.meetingLocationThursday} />
                  </td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>
                    <TextField name="meetingTimeFriday" showInlineError placeholder={club.meetingTimeFriday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationFriday" showInlineError placeholder={club.meetingLocationFriday} />
                  </td>
                </tr>
                <tr>
                  <td>Saturday</td>
                  <td>
                    <TextField name="meetingTimeSaturday" showInlineError placeholder={club.meetingTimeSaturday} />
                  </td>
                  <td>
                    <TextField name="meetingLocationSaturday" showInlineError placeholder={club.meetingLocationSaturday} />
                  </td>
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
