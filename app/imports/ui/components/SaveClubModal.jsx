import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { Button, Container, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SaveClubModal = ({ clubName, email }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const saveClub = () => {
    Meteor.call('saveClub', { email, clubName }, (error) => {
      if (error) {
        swal('Error', 'Unable to save club. Please try again in a few moments.', 'error');
      } else {
        swal('Saved', `${clubName} saved to "My Clubs"`, 'success');
        handleClose();
      }
    });
  };

  const saveButtonStyle = {
    padding: 0,
    paddingBottom: '3px',
    margin: 0,
    background: 'transparent',
    color: '#18678F',
    borderWidth: 0,
    fontWeight: 600,
  };

  return (
    <>
      <Button style={saveButtonStyle} onClick={handleShow} id="save-club-btn">
        Save
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Container className="mt-2">
          <Modal.Header closeButton>
            <Modal.Title>
              <h3><b>Save Club</b></h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-4">
            Add <b>{clubName}</b> to your saved clubs?
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button variant="light" onClick={handleClose}>
              Back
            </Button>
            <Button id="save-btn" onClick={() => saveClub()}>
              Save
            </Button>
          </Modal.Footer>
        </Container>
      </Modal>
    </>
  );
};

SaveClubModal.propTypes = {
  email: PropTypes.string.isRequired,
  clubName: PropTypes.string.isRequired,
};

export default SaveClubModal;
