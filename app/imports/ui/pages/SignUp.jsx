import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { MortarboardFill, KeyFill, EnvelopeFill } from 'react-bootstrap-icons';
import { ComponentIDs, PageIDs } from '../utilities/ids';

/*
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const SignUp = () => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);
  const majors = ['Accounting', 'Art', 'Business', 'Chemistry', 'Computer Science', 'Computer Engineering', 'Economics', 'Engineering', 'Finance',
    'Marketing', 'Mathematics', 'Music', 'Nursing', 'Philosophy', 'Physics', 'Political Science', 'Psychology', 'Social Work', 'Other']; // TODO add more later?

  const schema = new SimpleSchema({
    email: String,
    password: String,
    major: { type: String, optional: true, allowedValues: majors },
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /* Handle SignUp submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = (doc) => {
    const { email, password } = doc;
    Accounts.createUser({ email, username: email, password }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToRef(true);
      }
    });
  };

  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return (<Navigate to="/profile" />);
  }
  return (
    <div id={PageIDs.signUpPage} className="backgroundImageTop">
      <Container>
        <Row className="justify-content-center mb-3">
          <Col xs={5}>
            <AutoForm schema={bridge} onSubmit={data => submit(data)}>
              <Card className="mt-4" style={{ backgroundColor: '#256546', color: 'white' }}>
                <Card.Body>
                  <Col className="text-center mb-3">
                    <h3><b>Sign Up</b></h3>
                    <p className="small">A valid UH email is required to create an account.</p>
                  </Col>
                  <Row className="mt-4">
                    <Col className="col-1 mt-1 ms-1">
                      <EnvelopeFill style={{ fontSize: '25px', color: 'lightskyblue' }} />
                    </Col>
                    <Col className="mx-2">
                      <TextField id={ComponentIDs.signUpFormEmail} name="email" placeholder="UH Email" label="" />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="col-1 mt-1 ms-1">
                      <KeyFill style={{ fontSize: '25px', color: 'gold' }} />
                    </Col>
                    <Col className="mx-2">
                      <TextField id={ComponentIDs.signUpFormPassword} name="password" placeholder="Password" type="password" label="" />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="col-1 mt-1 ms-1">
                      <MortarboardFill style={{ fontSize: '25px', color: 'limegreen' }} />
                    </Col>
                    <Col className="mx-2">
                      <SelectField id={ComponentIDs.signUpFormMajor} name="major" placeholder="Major (Optional)" label="" />
                    </Col>
                  </Row>
                  <ErrorsField />
                  <Col className="d-flex justify-content-center">
                    <SubmitField id={ComponentIDs.signUpFormSubmit} className="my-2" value="Sign Up" />
                  </Col>
                </Card.Body>
              </Card>
            </AutoForm>
            <Alert variant="secondary">
              Already have an account? Log in&nbsp;
              <Link to="/signin">here</Link>.
            </Alert>
            {error === '' ? (
              ''
            ) : (
              <Alert variant="danger">
                <Alert.Heading>Registration was not successful</Alert.Heading>
                {error}
              </Alert>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUp;
