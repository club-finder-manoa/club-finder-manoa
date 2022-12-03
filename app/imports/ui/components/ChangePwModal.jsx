// Popup modal to confirm reset password
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import swal from 'sweetalert';
import { Button, Container, Modal } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Check, X } from 'react-bootstrap-icons';
import { ComponentIDs } from '../utilities/ids';

const ChangePwModal = () => {
  const schema = new SimpleSchema({
    oldPassword: String,
    newPassword: String,
    confirmNewPassword: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  const [show, setShow] = useState(false);
  const [minReqs, setMinReqs] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmNewPw, setConfirmNewPw] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const changePw = () => {
    Accounts.changePassword(oldPw, newPw, (error) => {
      if (error) {
        swal('Error', 'Current password incorrect', 'error');
      } else {
        handleClose();
        swal('Success', 'Password successfully updated', 'success');
        setOldPw('');
        setNewPw('');
        setConfirmNewPw('');
        setMinReqs(false);
        setPasswordsMatch(false);
      }
    });
  };

  const handleFormChange = (key, value) => {
    if (key === 'newPassword') {
      setMinReqs(value.length >= 6);
      setNewPw(value);
      setPasswordsMatch(value === confirmNewPw);
    }
    if (key === 'confirmNewPassword') {
      setConfirmNewPw(value);
      setPasswordsMatch(value === newPw);
    }
    if (key === 'oldPassword') {
      setOldPw(value);
    }
  };

  const changeStyle = {
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
    color: '#0878A9',
  };

  return (
    <>
      <Button style={changeStyle} onClick={handleShow}>
        <u>Change Password</u>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Container className="mt-2">
          <Modal.Header closeButton>
            <Modal.Title>
              <h3><b>Change Password</b></h3>
            </Modal.Title>
          </Modal.Header>
          <AutoForm schema={bridge} onSubmit={changePw} onChange={(key, value) => handleFormChange(key, value)}>
            <Modal.Body>
              <TextField
                id={ComponentIDs.changePwOldPw}
                name="oldPassword"
                placeholder="Current Password"
                label="Current Password"
                type="password"
              />
              <TextField
                id={ComponentIDs.changePwNewPw}
                name="newPassword"
                placeholder="New Password"
                label="New Password"
                type="password"
              />
              <TextField
                id={ComponentIDs.changePwConfirmPw}
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                label="Confirm New Password"
                type="password"
              />
              <div className="small" style={minReqs ? { color: 'green' } : { color: 'red' }}>
                {minReqs ? <Check /> : <X />} Password must be at least 6 characters long
              </div>
              <div className="small" style={passwordsMatch ? { color: 'green' } : { color: 'red' }}>
                {passwordsMatch ? <Check /> : <X />} Passwords must match
              </div>
            </Modal.Body>
            <ErrorsField />
            <Modal.Footer className="text-center">
              <Button variant="light" onClick={handleClose}>
                Back
              </Button>
              <SubmitField id={ComponentIDs.changePwSubmit} className="my-2" value="Update" disabled={!(passwordsMatch && minReqs)} />
            </Modal.Footer>
          </AutoForm>
        </Container>
      </Modal>
    </>
  );
};

export default ChangePwModal;
