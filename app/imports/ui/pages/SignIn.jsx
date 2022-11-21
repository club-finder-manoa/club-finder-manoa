import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { EnvelopeFill, KeyFill } from 'react-bootstrap-icons';
import { ComponentIDs, PageIDs } from '../utilities/ids';

/*
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
const SignIn = () => {
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const schema = new SimpleSchema({
    email: String,
    password: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  // Handle Signin submission using Meteor's account mechanism.
  const submit = (doc) => {
    // console.log('submit', doc, redirect);
    const { email, password } = doc;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setRedirect(true);
      }
    });
    // console.log('submit2', email, password, error, redirect);
  };

  // Render the signin form.
  // console.log('render', error, redirect);
  // if correct authentication, redirect to page instead of login screen
  if (redirect) {
    return (<Navigate to="/my-clubs" />);
  }
  // Otherwise return the Login form.
  return (
    <div id={PageIDs.signInPage}>
      <Container>
        <Row className="justify-content-center mb-3">
          <Col xs={5}>
            <AutoForm schema={bridge} onSubmit={data => submit(data)}>
              <Card className="mt-4" style={{ backgroundColor: '#256546', color: 'white' }}>
                <Card.Body>
                  <Col className="text-center">
                    <h3><b>Login To Your Account</b></h3>
                  </Col>
                  <Row className="mt-4">
                    <Col className="col-1 mt-1 ms-1">
                      <EnvelopeFill style={{ fontSize: '25px', color: 'lightskyblue' }} />
                    </Col>
                    <Col className="mx-2">
                      <TextField id={ComponentIDs.signInFormEmail} name="email" placeholder="UH Email" label="" />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="col-1 mt-1 ms-1">
                      <KeyFill style={{ fontSize: '25px', color: 'gold' }} />
                    </Col>
                    <Col className="mx-2">
                      <TextField id={ComponentIDs.signInFormPassword} name="password" placeholder="Password" type="password" label="" />
                    </Col>
                  </Row>
                  <ErrorsField />
                  <Col className="d-flex justify-content-center">
                    <SubmitField id={ComponentIDs.signInFormSubmit} className="my-2" value="Sign In" />
                  </Col>
                </Card.Body>
              </Card>
            </AutoForm>
            <Alert variant="secondary">
              Not a member?&nbsp;
              <Link to="/signup">Click here to Register</Link>
            </Alert>
            {error === '' ? (
              ''
            ) : (
              <Alert variant="danger">
                <Alert.Heading>Login was not successful</Alert.Heading>
                {error}
              </Alert>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignIn;
