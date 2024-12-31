import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Form, Button, Modal } from "react-bootstrap";

const CREATE_DEGREE_MUTATION = gql`
  mutation CreateDegree(
    $offered_places: BigInt,
    $mark_cut_off: Float,
    $name: String!,
    $credits: BigInt!,
    $applications: BigInt,
    $code: ID!,
    $students_first_year_2013: BigInt
  ) {
    createDegree(
      offered_places: $offered_places,
      mark_cut_off: $mark_cut_off,
      name: $name,
      credits: $credits,
      applications: $applications,
      code: $code,
      students_first_year_2013: $students_first_year_2013
    ) {
      code
      name
    }
  }
`;

const GET_DEGREES_QUERY = gql`
  query GetDegrees {
    degrees {
      code
      name
      credits
      offered_places
      mark_cut_off
      applications
      students_first_year_2013
    }
  }
`;

function AddDegree({ show, handleClose }) {
  const [newDegree, setNewDegree] = useState({
    code: "",
    name: "",
    credits: "",
    offered_places: "",
    mark_cut_off: "",
    applications: "",
    students_first_year_2013: "",
  });

  const [createDegree] = useMutation(CREATE_DEGREE_MUTATION, {
    update(cache, { data: { createDegree } }) {
      try {
        const { degrees } = cache.readQuery({ query: GET_DEGREES_QUERY }) || { degrees: [] }; // Valeur par défaut si null
        cache.writeQuery({
          query: GET_DEGREES_QUERY,
          data: { degrees: [...degrees, createDegree] },
        });
      } catch (error) {
        console.error("Erreur lors de la lecture du cache :", error);
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDegree({ ...newDegree, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newDegree.code || !newDegree.name || !newDegree.credits) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const formattedDegree = {
      code: newDegree.code.trim(),
      name: newDegree.name.trim(),
      credits: Number(newDegree.credits),
      offered_places: newDegree.offered_places ? Number(newDegree.offered_places) : null,
      mark_cut_off: parseFloat(newDegree.mark_cut_off),
      applications: newDegree.applications ? Number(newDegree.applications) : null,
      students_first_year_2013: newDegree.students_first_year_2013 ? Number(newDegree.students_first_year_2013) : null,
    };

    console.log("Données envoyées à la mutation :", formattedDegree);

    createDegree({ variables: formattedDegree })
      .then(() => {
        alert("Diplôme ajouté avec succès !");
        handleClose();
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout :", error);
        alert(`Erreur lors de l'ajout du diplôme : ${error.message}`);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un Diplôme</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Code</Form.Label>
            <Form.Control
              type="text"
              name="code"
              value={newDegree.code}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newDegree.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Crédits</Form.Label>
            <Form.Control
              type="number"
              name="credits"
              value={newDegree.credits}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Places Offertes</Form.Label>
            <Form.Control
              type="number"
              name="offered_places"
              value={newDegree.offered_places}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Note de Coupure</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="mark_cut_off"
              value={newDegree.mark_cut_off}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Applications</Form.Label>
            <Form.Control
              type="number"
              name="applications"
              value={newDegree.applications}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Étudiants Première Année (2013)</Form.Label>
            <Form.Control
              type="number"
              name="students_first_year_2013"
              value={newDegree.students_first_year_2013}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Enregistrer
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddDegree;