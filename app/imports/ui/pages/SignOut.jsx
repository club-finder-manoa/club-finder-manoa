import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col } from 'react-bootstrap';
import { PageIDs } from '../utilities/ids';

/* After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => {
  Meteor.logout();

  document.title = 'Club Finder Mānoa - Sign Out';

  return (
    <div className="backgroundImageTop" style={{ height: '25vh' }}>
      <Col id={PageIDs.signOutPage} className="text-center mt-3"><h2><b>You are signed out.</b></h2></Col>
    </div>
  );
};

export default SignOut;
