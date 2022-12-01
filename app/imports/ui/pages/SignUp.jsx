import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { KeyFill, EnvelopeFill, Check, X } from 'react-bootstrap-icons';
import { Meteor } from 'meteor/meteor';
import { ComponentIDs, PageIDs } from '../utilities/ids';

/*
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const SignUp = () => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [minReqs, setMinReqs] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inputPassword, setInputPassword] = useState(false); // to only display password warnings after changed pw

  const schema = new SimpleSchema({
    email: String,
    password: String,
    confirmPassword: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /* Handle SignUp submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = (doc) => {
    const { email } = doc;
    if (email.substring(email.length - 11, email.length) !== '@hawaii.edu') {
      setError('Please enter a valid UH email.');
      setInvalidEmail(true);
    } else {
      Accounts.createUser({ email, username: email, password }, (err) => {
        if (err) {
          setError(err.reason);
        } else {
          setError('');
          const accountID = Meteor.users.find().fetch()[0]._id;
          Meteor.call('insertUser', { accountID, email });
          setRedirectToRef(true);
        }
      });
    }
  };

  const handleFormChange = (key, value) => {
    if (key === 'password') {
      setMinReqs(value.length >= 6);
      setPassword(value);
      setPasswordsMatch(value === confirmPassword);
    }
    if (key === 'confirmPassword') {
      setConfirmPassword(value);
      setPasswordsMatch(value === password);
    }
  };

  function checkEmail(email) {
    if (email && email.substring(email.length - 11, email.length) !== '@hawaii.edu') {
      setInvalidEmail(true);
    } else {
      setInvalidEmail(false);
    }
  }

  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return (<Navigate to="/profile" />);
  }
  return (
    <div id={PageIDs.signUpPage} className="backgroundImageTop">
      <Container>
        <Row className="justify-content-center mb-3">
          <Col xs={5}>
            <AutoForm schema={bridge} onSubmit={data => submit(data)} onChange={(key, value) => handleFormChange(key, value)}>
              <Card className="mt-4" style={{ backgroundColor: '#256546', color: 'white' }}>
                <Card.Body>
                  <Col className="text-center mb-3">
                    <h3><b>Sign Up</b></h3>
                    {invalidEmail ? (
                      <p className="small" style={{ color: 'yellow' }}>
                        A valid UH email is required to create an account.
                      </p>
                    ) : (
                      <p className="small">
                        A valid UH email is required to create an account.
                      </p>
                    )}
                  </Col>
                  <Row className="mt-4">
                    <Col className="col-1 mt-1 ms-1">
                      <EnvelopeFill style={{ fontSize: '25px', color: 'lightskyblue' }} />
                    </Col>
                    <Col className="mx-2">
                      <TextField
                        id={ComponentIDs.signUpFormEmail}
                        name="email"
                        placeholder="UH Email"
                        label=""
                        onBlur={(e) => checkEmail(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="col-1 mt-1 ms-1">
                      <KeyFill style={{ fontSize: '25px', color: 'gold' }} />
                    </Col>
                    <Col className="mx-2">
                      <TextField id={ComponentIDs.signUpFormPassword} name="password" placeholder="Password" type="password" label="" onBlur={() => setInputPassword(true)} />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="col-1 mt-1 ms-1" />
                    <Col className="mx-2">
                      <TextField id={ComponentIDs.signUpFormConfirmPassword} name="confirmPassword" placeholder="Confirm Password" type="password" label="" />
                    </Col>
                  </Row>
                  {inputPassword ? (
                    <Row>
                      <Col className="col-1 mt-1 ms-1" />
                      <Col className="small" style={minReqs ? { color: 'white' } : { color: 'yellow' }}>
                        {minReqs ? <Check /> : <X />} Password must be at least 6 characters long
                      </Col>
                    </Row>
                  )
                    : '' }
                  {inputPassword ? (
                    <Row className="mb-2">
                      <Col className="col-1 mt-1 ms-1" />
                      <Col className="small" style={passwordsMatch ? { color: 'white' } : { color: 'yellow' }}>
                        {passwordsMatch ? <Check /> : <X />} Passwords must match
                      </Col>
                    </Row>
                  )
                    : '' }
                  <ErrorsField className="mt-2" />
                  <Col className="d-flex justify-content-center">
                    <SubmitField id={ComponentIDs.signUpFormSubmit} className="my-2" value="Sign Up" disabled={!(passwordsMatch && minReqs)} />
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
