import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Image, Row, Col, Table, Badge } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Clubs } from '../../api/clubs/Clubs';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';
import { ComponentIDs, PageIDs } from '../utilities/ids';

const EditClub = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const clubTypes = ['Academic/Professional', 'Ethnic/Cultural', 'Fraternity/Sorority', 'Honorary Society', 'Leisure/Recreational',
    'Political', 'Service', 'Spiritual/Religious', 'Sports/Leisure', 'Student Affairs'];

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

  const schema = new SimpleSchema({
    clubName: String,
    clubType: { type: String, allowedValues: clubTypes },
    mainPhoto: String,
    description: String,
    website: { type: String, optional: true },
    meetingTimeSunday: { type: String, optional: true },
    meetingLocationSunday: { type: String, optional: true },
    meetingTimeMonday: { type: String, optional: true },
    meetingLocationMonday: { type: String, optional: true },
    meetingTimeTuesday: { type: String, optional: true },
    meetingLocationTuesday: { type: String, optional: true },
    meetingTimeWednesday: { type: String, optional: true },
    meetingLocationWednesday: { type: String, optional: true },
    meetingTimeThursday: { type: String, optional: true },
    meetingLocationThursday: { type: String, optional: true },
    meetingTimeFriday: { type: String, optional: true },
    meetingLocationFriday: { type: String, optional: true },
    meetingTimeSaturday: { type: String, optional: true },
    meetingLocationSaturday: { type: String, optional: true },
    contactName: String,
    contactEmail: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /* On submit, insert the data. */
  const submit = (data) => {
    // eslint-disable-next-line max-len
    const { clubName, clubType, mainPhoto, description, website, meetingTimeSunday, meetingLocationSunday, meetingTimeMonday, meetingLocationMonday,
      meetingTimeTuesday, meetingLocationTuesday, meetingTimeWednesday, meetingLocationWednesday, meetingTimeThursday, meetingLocationThursday,
      meetingTimeFriday, meetingLocationFriday, meetingTimeSaturday, meetingLocationSaturday, contactName, contactEmail } = data;

    Object.values(club.interestedUsers).forEach(intUser => {
      Meteor.call('removeClub', { email: intUser, clubName: oldClubName });
    });

    // eslint-disable-next-line max-len
    Meteor.call('updateClub', { _id, clubName, clubType, mainPhoto, description, website, meetingTimeSunday, meetingLocationSunday,
      meetingTimeMonday, meetingLocationMonday, meetingTimeTuesday, meetingLocationTuesday, meetingTimeWednesday, meetingLocationWednesday,
      meetingTimeThursday, meetingLocationThursday, meetingTimeFriday, meetingLocationFriday, meetingTimeSaturday, meetingLocationSaturday,
      contactName, contactEmail });

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
    <Container id={PageIDs.editClubPage} className="my-4">
      {updateTitleAndCheck()}
      {club ? (
        <div className="my-2">
          <AutoForm model={club} schema={bridge} onSubmit={data => submit(data)}>
            <Row className="align-middle text-center mb-3">
              <Col className="d-flex flex-column justify-content-center">
                <TextField id={ComponentIDs.clubName} name="clubName" showInlineError placeholder={club.clubName} />
                <SelectField
                  id={ComponentIDs.clubType}
                  as="select"
                  name="clubType"
                >
                  {clubTypes.map((type, key) => <option value={type} key={key}>{type}</option>)}
                </SelectField>
                <TextField id={ComponentIDs.clubLink} className="pt-3" name="website" showInlineError placeholder={club.website} />
                <LongTextField id={ComponentIDs.clubDescription} name="description" showInlineError placeholder={club.description} />
              </Col>
              <Col className="col-3">
                <Row className="my-3">
                  <Col>
                    <Image src={club.mainPhoto} width={200} />
                    <TextField id={ComponentIDs.mainPhoto} name="mainPhoto" showInlineError placeholder={club.mainPhoto} />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-2 mb-4">
              <p>Tags</p>
              <Col className="d-flex">
                {club.tags ? club.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="rounded-pill"
                    style={{ fontSize: '16px', fontWeight: 600, paddingTop: '8px', paddingBottom: '8px' }}
                    bg="secondary"
                  >{tag}
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
                    <TextField id="meeting-sunday-time" name="meetingTimeSunday" showInlineError placeholder={club.meetingTimeSunday} label="" />
                  </td>
                  <td>
                    <TextField id="meeting-sunday-location" name="meetingLocationSunday" showInlineError placeholder={club.meetingLocationSunday} label="" />
                  </td>
                </tr>
                <tr>
                  <td>Monday</td>
                  <td>
                    <TextField id="meeting-monday-time" name="meetingTimeMonday" showInlineError placeholder={club.meetingTimeMonday} label="" />
                  </td>
                  <td>
                    <TextField id="meeting-monday-location" name="meetingLocationMonday" showInlineError placeholder={club.meetingLocationMonday} label="" />
                  </td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>
                    <TextField id="meeting-tuesday-time" name="meetingTimeTuesday" showInlineError placeholder={club.meetingTimeTuesday} label="" />
                  </td>
                  <td>
                    <TextField id="meeting-tuesday-location" name="meetingLocationTuesday" showInlineError placeholder={club.meetingLocationTuesday} label="" />
                  </td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>
                    <TextField id="meeting-wednesday-time" name="meetingTimeWednesday" showInlineError placeholder={club.meetingTimeWednesday} label="" />
                  </td>
                  <td>
                    <TextField id="meeting-wednesday-location" name="meetingLocationWednesday" showInlineError placeholder={club.meetingLocationWednesday} label="" />
                  </td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>
                    <TextField id="meeting-thursday-time" name="meetingTimeThursday" showInlineError placeholder={club.meetingTimeThursday} label="" />
                  </td>
                  <td>
                    <TextField id="meeting-thursday-location" name="meetingLocationThursday" showInlineError placeholder={club.meetingLocationThursday} label="" />
                  </td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>
                    <TextField id="meeting-friday-time" name="meetingTimeFriday" showInlineError placeholder={club.meetingTimeFriday} label="" />
                  </td>
                  <td>
                    <TextField id="meeting-friday-location" name="meetingLocationFriday" showInlineError placeholder={club.meetingLocationFriday} label="" />
                  </td>
                </tr>
                <tr>
                  <td>Saturday</td>
                  <td>
                    <TextField id="meeting-saturday-time" name="meetingTimeSaturday" showInlineError placeholder={club.meetingTimeSaturday} label="" />
                  </td>
                  <td>
                    <TextField id="meeting-saturday-location" name="meetingLocationSaturday" showInlineError placeholder={club.meetingLocationSaturday} label="" />
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
