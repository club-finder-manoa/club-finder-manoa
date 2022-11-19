import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { NavLink } from 'react-router-dom';
import { Col, Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import { ComponentIDs } from '../utilities/ids';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);
  const menuStyle = { marginBottom: '0px' };
  return (
    <Navbar expand="lg" style={menuStyle} className="bg-dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="align-items-center">
          <span><Image src="/images/uh-rainbow.png" width={70} style={{ marginBottom: 3 }} /></span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={ComponentIDs.basicNavbarNav} />
        <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>
          <Nav className="me-auto justify-content-start">
            {currentUser ? (
              [<Nav.Link as={NavLink} id={ComponentIDs.profilesMenuItem} className="ms-4" style={{ fontWeight: 600 }} to="/account" key="account">Profile</Nav.Link>,
                <Nav.Link as={NavLink} id={ComponentIDs.addProjectMenuItem} className="ms-4" style={{ fontWeight: 600 }} to="/all-clubs" key="allClubs">All Clubs</Nav.Link>,
                <Nav.Link as={NavLink} id={ComponentIDs.filterMenuItem} className="ms-4" style={{ fontWeight: 600 }} to="/my-clubs" key="myClubs">My Clubs</Nav.Link>]
            ) : ''}
            {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
              <Nav.Link as={NavLink} id="admin-page" className="ms-4" to="/admin" key="admin"><b>Admin</b></Nav.Link>
            ) : ''}
          </Nav>
          {!currentUser ? (
            <Col className="justify-content-center text-center my-2 me-2">
              <span style={{ fontWeight: 500, fontSize: '30px' }}><b>Club Finder Mānoa</b></span>
            </Col>
          )
            : '' }
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown align="end" id={ComponentIDs.loginDropdown} title="Login">
                <NavDropdown.Item id={ComponentIDs.loginDropdownSignIn} as={NavLink} to="/signin">
                  <PersonFill className="me-2 mb-1" />Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id={ComponentIDs.loginDropdownSignUp} as={NavLink} to="/signup">
                  <PersonPlusFill className="me-2 mb-1" />Sign up
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown align="end" id={ComponentIDs.currentUserDropdown} title={currentUser}>
                <NavDropdown.Item id={ComponentIDs.currentUserDropdownProfile} as={NavLink} to="/profile">
                  <PersonFill className="me-2 mb-1" />Profile
                </NavDropdown.Item>
                <NavDropdown.Item id={ComponentIDs.currentUserDropdownSignOut} as={NavLink} to="/signout">
                  <BoxArrowRight className="me-2 mb-1" />Sign out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
