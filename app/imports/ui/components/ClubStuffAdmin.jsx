import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const ClubStuffAdmin = ({ stuff, collection }) => {
  const removeItem = (docID) => {
    console.log(`The item to remove is ${docID}`);
    collection.remove(docID);
  };
  return (
    <tr>
      <td>{stuff.name}</td>
      <td>{stuff.owner}</td>
      <td>{stuff.adminStatus}</td>
      <td>
        <Link to={`/edit/${stuff._id}`}>Edit</Link>
      </td>
      <td>
        <td><Button variant="danger" onClick={() => removeItem(stuff._id)}><Trash /></Button></td>
      </td>
      <td>
        <Link to={`/edit/${stuff._id}`}>Edit</Link>
      </td>
    </tr>
  );
};

// Require a document to be passed to this component.
ClubStuffAdmin.propTypes = {
  stuff: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.string,
    adminStatus: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  collection: PropTypes.object.isRequired,
};

export default ClubStuffAdmin;
