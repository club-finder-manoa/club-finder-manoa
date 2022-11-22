import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { Users } from '../../api/users/Users';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const UserListItem = ({ user }) => {
  const removeItem = (docID) => {
    console.log(`The item to remove is ${docID}`);
    Users.collection.remove(docID);
  };
  return (
    <tr>
      <td>{user.email}</td>
      <td>{user.adminForClubs}</td>
      <td>
        <Link to={`/edit/${user._id}`}>Edit</Link>
      </td>
      <td>
        <Button variant="danger" onClick={() => removeItem(user._id)}><Trash /></Button>
      </td>
      <td>
        <Link to={`/edit/${user._id}`}>Edit</Link>
      </td>
    </tr>
  );
};

// Require a document to be passed to this component.
UserListItem.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    adminForClubs: PropTypes.arrayOf(String),
    _id: PropTypes.string,
  }).isRequired,
};

export default UserListItem;
