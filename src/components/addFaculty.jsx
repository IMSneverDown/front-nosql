import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";

// Définition de la mutation GraphQL pour créer une faculté
const CREATE_FACULTY_MUTATION = gql`
  mutation createFaculty($name: String!, $foundation: BigInt!, $web: String) {
    createFaculty(name: $name, foundation: $foundation, web: $web) {
      name
      foundation
      web
    }
  }
`;

// Requête pour obtenir la liste des facultés
const GET_FACULTIES_QUERY = gql`
  query GetFaculties {
    faculties {
      name
      foundation
      web
    }
  }
`;

function AddFaculty({ show, handleClose, onAdd }) {
  const [facultyData, setFacultyData] = useState({ name: "", web: "", foundation: "" });
  const [createFaculty] = useMutation(CREATE_FACULTY_MUTATION, {
    update(cache, { data: { createFaculty } }) {
      const { faculties } = cache.readQuery({ query: GET_FACULTIES_QUERY }) || { faculties: [] };
      cache.writeQuery({
        query: GET_FACULTIES_QUERY,
        data: { faculties: [...faculties, createFaculty] },
      });
    },
  });

  const [confirmationMessage, setConfirmationMessage] = useState(""); // État pour le message de confirmation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacultyData({ ...facultyData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createFaculty({
        variables: {
          name: facultyData.name,
          foundation: Number(facultyData.foundation), // Convertir en BigInt
          web: facultyData.web,
        },
      });
      if (onAdd) {
        onAdd(data.createFaculty); // Appeler la fonction parent avec les données de la faculté créée
      }
      setFacultyData({ name: "", web: "", foundation: "" }); // Réinitialiser le formulaire
      setConfirmationMessage("Faculté ajoutée avec succès !"); // Mettre à jour le message de confirmation
      handleClose(); // Fermer le modal
    } catch (error) {
      console.error("Erreur lors de la création de la faculté :", error);
      alert(`Erreur : ${error.message}`); // Afficher un message d'erreur
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une Faculté</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="facultyName">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={facultyData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="facultyWeb" className="mt-3">
            <Form.Label>Site Web</Form.Label>
            <Form.Control
              type="url"
              name="web"
              value={facultyData.web}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="facultyFoundation" className="mt-3">
            <Form.Label>Année de Fondation</Form.Label>
            <Form.Control
              type="number"
              name="foundation"
              value={facultyData.foundation}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Ajouter
          </Button>
        </Form>
        {confirmationMessage && (
          <div className="mt-3 text-success">{confirmationMessage}</ div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default AddFaculty;