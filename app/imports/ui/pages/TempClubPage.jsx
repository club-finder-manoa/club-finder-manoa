import React from 'react';
import { Col, Container, Image, Row, Table } from 'react-bootstrap';

/* A simple static component to render some text for the landing page. */
const TempClubPage = () => (
  <div className="backgroundImageTop">
    <Container id="landing-page" fluid className="py-3">
      <Row className="align-middle text-center">
        <Col xs={4}>
          <Image roundedCircle src="https://images.squarespace-cdn.com/content/v1/5f2371858296275165c4fed8/1598171416577-93L1YDJ9YHL3W7F5AMCA/New-AC-Logo-1024x1024.png?format=1500w" width="150px" />
        </Col>

        <Col xs={8} className="d-flex flex-column justify-content-center">
          <h1>Accounting Club</h1>
          <p>Academic/Professional</p>
          <p>
            In cooperation with the School of Accountancy, we provide additional perspectives and supplemental information concerning public, private, and governmental accounting.
            Our main goal is to promote the professional and personal development of our members through socials, community service, professional interactions, workshops, and office
            tours. We continue to rank high among the largest student organizations within the Shidler College of Business and welcome students from all academic disciplines.
          </p>
        </Col>
      </Row>

      <h3>Meeting Times and Location</h3>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Meeting Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Monday, November 21, 2022</td>
            <td>6:00 PM to 7:00 PM</td>
            <td>HL 003F</td>
            <td>General Meeting</td>
          </tr>
          <tr>
            <td>Monday, November 28, 2022</td>
            <td>6:00 PM to 7:00 PM</td>
            <td>HL 003F</td>
            <td>General meeting</td>
          </tr>
          <tr>
            <td>Monday, December 5, 2022</td>
            <td>6:00 PM to 7:00 PM</td>
            <td>HL 003F</td>
            <td>General meeting</td>
          </tr>
        </tbody>
      </Table>

      <h3>Contact Us!</h3>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rana Mejes</td>
            <td>mejesrs@hawaii.edu</td>
          </tr>
        </tbody>
      </Table>

    </Container>
  </div>
);

export default TempClubPage;
