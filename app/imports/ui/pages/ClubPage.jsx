import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Image, Row, Col, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Link, useParams } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Clubs } from '../../api/clubs/Clubs';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';
import SaveClubModal from '../components/SaveClubModal';
import RemoveClubModal from '../components/RemoveClubModal';

const ClubPage = () => {
  const { _id } = useParams();

  const { ready, club, clubSaved } = useTracker(() => {
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(Users.userPublicationName);
    const oneClub = Clubs.collection.find({ _id: _id }).fetch()[0];
    const usr = Users.collection.find({ email: Meteor.user()?.username }).fetch()[0];
    const saved = usr ? usr.savedClubs?.includes(oneClub?.clubName) : false;
    return {
      ready: sub1.ready() && sub2.ready(),
      club: oneClub,
      clubSaved: saved,
    };
  }, false);

  function updateTitleAndCheck() {
    if (club) {
      document.title = `Club Finder Mānoa - ${club.clubName}`;
    } else {
      document.title = 'Club Finder Mānoa - Page Not Found';
    }
  }

  return ready ? (
    <Container className="my-3" id="club-info-page">
      {updateTitleAndCheck()}
      {club ? (
        <div>
          <Row className="align-middle text-center mb-3">
            <Col>
              <Row className="my-3">
                <Col>
                  <Image src={club.mainPhoto} width={200} />
                </Col>
              </Row>
              <Row>
                <Col>
                  {clubSaved ?
                    <div>Remove from <i>My Clubs:</i>&nbsp;&nbsp;<RemoveClubModal buttonText="Remove" clubName={club.clubName} email={Meteor.user()?.username} /></div> :
                    <div>Save to <i>My Clubs:</i>&nbsp;&nbsp;<SaveClubModal clubName={club.clubName} email={Meteor.user()?.username} /></div>}
                </Col>
              </Row>
            </Col>

            <Col xs={8} className="d-flex flex-column justify-content-center">
              <h2><b>{club.clubName}</b></h2>
              <h5 className="mb-3">{club.clubType}</h5>
              <p className="text-start">{club.description}</p>
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
                <td>{club.meetingInfo}</td>
                <td />
                <td />
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
                <td>{club.contactName}</td>
                <td>{club.contactEmail}</td>
              </tr>
            </tbody>
          </Table>
          {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
            <Row>
              <Col className="d-flex justify-content-center py-3">
                <Link to={`/edit-club/${club._id}`} className="btn btn-primary" id="edit-profile-btn">Edit Club</Link>
              </Col>
            </Row>
          ) : ''}
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

export default ClubPage;
