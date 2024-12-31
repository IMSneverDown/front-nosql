import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";

// Définition de la mutation GraphQL pour créer une école
const CREATE_SCHOOL_MUTATION = gql`
  mutation CreateSchool($name: String!, $foundation: BigInt!, $web: String) {
    createSchool(name: $name, foundation: $foundation, web: $web) {
      name
      foundation
      web
    }
  }
`;

// Requête pour obtenir la liste des écoles
const GET_SCHOOLS_QUERY = gql`
  query GetSchools {
    schools {
      name
      foundation
      web
    }
  }
`;

function AddSchool({ show, handleClose, onAdd }) {
  const [schoolData, setSchoolData] = useState({ name: "", web: "", foundation: "" });
  
  const [createSchool] = useMutation(CREATE_SCHOOL_MUTATION, {
    update(cache, { data: { createSchool } }) {
      // Mettre à jour le cache Apollo après l'ajout d'une nouvelle école
      const { schools } = cache.readQuery({ query: GET_SCHOOLS_QUERY });
      cache.writeQuery({
        query: GET_SCHOOLS_QUERY,
        data: { schools: [...schools, createSchool] },
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchoolData({ ...schoolData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createSchool({
        variables: {
          name: schoolData.name,
          foundation: Number(schoolData.foundation), // Convertir en BigInt
          web: schoolData.web || null, // Assurez-vous que web peut être null
        },
      });
      if (onAdd) {
        onAdd(data.createSchool); // Appeler la fonction parent avec les données de l'école créée
      }
      setSchoolData({ name: "", web: "", foundation: "" }); // Réinitialiser le formulaire
      handleClose(); // Fermer le modal
    } catch (error) {
      console.error("Erreur lors de la création de l'école :", error);
      alert(`Erreur : ${error.message}`); // Afficher un message d'erreur
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une École</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="schoolName">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={schoolData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="schoolWeb" className="mt-3">
            <Form.Label>Site Web</Form.Label>
            <Form.Control
              type="url"
              name="web"
              value={schoolData.web}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="schoolFoundation" className="mt-3">
            <Form.Label>Année de Fondation</Form.Label>
            <Form.Control
              type="number"
              name="foundation"
              value={schoolData.foundation}
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

export default AddSchool;