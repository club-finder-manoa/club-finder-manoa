import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { Button, Container, Modal } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

const RemoveClubModal = ({ clubName, email, buttonText }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const removeClub = () => {
    Meteor.call('removeClub', { email, clubName });
    swal('Removed', `${clubName} removed from "My Clubs"`, 'success');
    handleClose();
  };

  const removeClubStyleX = {
    padding: 0,
    background: 'transparent',
    color: '#C6C6C6',
    borderWidth: 0,
    fontSize: '20px',
    fontWeight: 600,
  };

  const removeClubStyle = {
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
      <Button style={buttonText ? removeClubStyle : removeClubStyleX} onClick={handleShow}>
        {buttonText || <X />}
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Container className="mt-2">
          <Modal.Header closeButton>
            <Modal.Title>
              <h3><b>Remove Club</b></h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-4">
            Remove <b>{clubName}</b> from your saved clubs?
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button variant="light" onClick={handleClose}>
              Back
            </Button>
            <Button variant="danger" onClick={() => removeClub()}>
              Remove
            </Button>
          </Modal.Footer>
        </Container>
      </Modal>
    </>
  );
};

RemoveClubModal.propTypes = {
  email: PropTypes.string.isRequired,
  clubName: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default RemoveClubModal;
