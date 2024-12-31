// DegreeDetails.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DegreeDetails = ({ degree, onClose }) => {
  return (
    <Modal show={!!degree} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Détails du Diplôme</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Nom: {degree?.name}</h5>
        <p>Code: {degree?.code}</p>
        <p>Crédits: {degree?.credits}</p>
        <p>Places Offertes: {degree?.offered_places}</p>
        <p>Note de Couverture: {degree?.mark_cut_off}</p>
        <p>Nombre de candidature : {degree?.applications}</p>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DegreeDetails;