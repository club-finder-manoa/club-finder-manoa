import React from 'react';
import swal from 'sweetalert';
import { AutoForm, TextField, LongTextField, SelectField, SubmitField, ErrorsField } from 'uniforms-bootstrap5';
import { Container, Col, Card, Row } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Clubs } from '../../api/clubs/Clubs';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

const bridge = new SimpleSchema2Bridge(Clubs.schema);

const EditClub = () => {

  const { _id } = useParams();

  const { ready, doc } = useTracker(() => {
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    const club1 = Clubs.collection.find({ _id: _id }).fetch();
    return {
      doc: club1[0],
      ready: sub1.ready(),
    };
  }, []);

  const submit = (data) => {
    const { clubName, clubType, mainPhoto, description, tags, relevantMajors, contactName, contactEmail, photos } = data;
    Clubs.collection.update(_id, { $set: { clubName, clubType, mainPhoto, description, tags, relevantMajors, contactName, contactEmail, photos } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'EditProfile updated successfully', 'success')));
  };

  return ready ? (
    <div className="backgroundImageTop">
      <Container id={PageIDs.homePage} className="justify-content-center" style={pageStyle}>
        <Col>
          <Col className="justify-content-center text-center"><h2>Your Club</h2></Col>
          <AutoForm model={doc} schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={4}><TextField name="clubName" showInlineError placeholder="Club Name" /></Col>
                  <Col xs={4}><TextField name="clubType" showInlineError placeholder="Club Type" /></Col>
                  <Col xs={4}><TextField name="mainPhoto" showInlineError placeholder="Main Photo" /></Col>
                </Row>
                <LongTextField name="description" placeholder="This is a description" />
                <Row>
                  <Col xs={6}><SelectField name="tags" placeholder="tags" /></Col>
                  <Col xs={6}><SelectField name="relevantMajors" placeholder="Relavent Majors" /> </Col>
                </Row>
                <Row>
                  <Col xs={4}><TextField name="contactName" showInlineError placeholder="Contact Name" /> </Col>
                  <Col xs={4}><TextField name="contactEmail" showInlineError placeholder="Contact Email" /> </Col>
                  <Col xs={4}><TextField name="photos" showInlineError placeholder="Extra Photos" /> </Col>
                </Row>
                <SubmitField value="Update" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Container>
    </div>
  ) : <LoadingSpinner />;
};

export default EditClub;
