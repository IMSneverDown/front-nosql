import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";

// Définition de la mutation GraphQL pour créer un campus
const CREATE_CAMPUS_MUTATION = gql`
  mutation createCampus($name: String!, $city: String!) {
    createCampus(name: $name, city: $city) {
      name
      city
    }
  }
`;

// Requête pour obtenir la liste des campus
const GET_CAMPUSES_QUERY = gql`
  query GetCampuses {
    campuses {
      name
      city
    }
  }
`;

function AddCampus({ show, handleClose, onAdd }) {
  const [campusData, setCampusData] = useState({ name: "", city: "" });
  
  const [createCampus] = useMutation(CREATE_CAMPUS_MUTATION, {
    update(cache, { data: { createCampus } }) {
      // Mettre à jour le cache Apollo après l'ajout d'un nouveau campus
      const { campuses } = cache.readQuery({ query: GET_CAMPUSES_QUERY }) || { campuses: [] };
      cache.writeQuery({
        query: GET_CAMPUSES_QUERY,
        data: { campuses: [...campuses, createCampus] },
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampusData({ ...campusData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createCampus({
        variables: {
          name: campusData.name,
          city: campusData.city,
        },
      });
      if (onAdd) {
        onAdd(data.createCampus); // Appeler la fonction parent avec les données du campus créé
      }
      setCampusData({ name: "", city: "" }); // Réinitialiser le formulaire
      handleClose(); // Fermer le modal
      alert("Campus ajouté avec succès !"); // Afficher un message de confirmation
    } catch (error) {
      console.error("Erreur lors de la création du campus :", error);
      alert(`Erreur : ${error.message}`); // Afficher un message d'erreur
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un Campus</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="campusName">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={campusData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="campusCity" className="mt-3">
            <Form.Label>Ville</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={campusData.city}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Ajouter
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddCampus;