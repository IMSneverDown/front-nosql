import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Form, Modal } from "react-bootstrap";

// Mutation GraphQL pour mettre à jour un diplôme
const UPDATE_DEGREE_MUTATION = gql`
  mutation UpdateDegree(
    $code: ID!
    $offered_places: BigInt
    $mark_cut_off: Float
    $name: String
    $credits: BigInt
    $applications: BigInt
    $students_first_year_2013: BigInt
  ) {
    updateDegree(
      code: $code
      offered_places: $offered_places
      mark_cut_off: $mark_cut_off
      name: $name
      credits: $credits
      applications: $applications
      students_first_year_2013: $students_first_year_2013
    ) {
      code
      name
      offered_places
      mark_cut_off
      credits
      applications
      students_first_year_2013
    }
  }
`;

function EditDegreeForm({ show, onClose, degree, updateDegreeList }) {
  const [name, setName] = useState(degree?.name || "");
  const [offered_places, setOfferedPlaces] = useState(degree?.offered_places || 0);
  const [mark_cut_off, setMarkCutOff] = useState(degree?.mark_cut_off || 0);
  const [credits, setCredits] = useState(degree?.credits || 0);
  const [applications, setApplications] = useState(degree?.applications || 0);
  const [students_first_year_2013, setStudentsFirstYear2013] = useState(degree?.students_first_year_2013 || 0);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const [updateDegree, { loading, error }] = useMutation(UPDATE_DEGREE_MUTATION, {
    optimisticResponse: {
      updateDegree: {
        __typename: "Degree",
        code: degree.code,
        name,
        offered_places,
        mark_cut_off,
        credits,
        applications,
        students_first_year_2013,
      },
    },
    onCompleted: () => {
      setConfirmationMessage("Diplôme mis à jour avec succès !");
      onClose(); // Ferme le modal après l'enregistrement
    },
    onError: (err) => {
      console.error("Erreur lors de la mise à jour:", err);
      setConfirmationMessage("Erreur lors de la mise à jour du diplôme.");
    }
  });

  useEffect(() => {
    if (degree) {
      setName(degree.name);
      setOfferedPlaces(degree.offered_places || 0);
      setMarkCutOff(degree.mark_cut_off || 0);
      setCredits(degree.credits || 0);
      setApplications(degree.applications || 0);
      setStudentsFirstYear2013(degree.students_first_year_2013 || 0);
    }
  }, [degree]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDegree({
        variables: {
          code: degree.code,
          name,
          offered_places,
          mark_cut_off,
          credits,
          applications,
          students_first_year_2013,
        },
      });

      // Mettre à jour la liste des diplômes dans le composant parent
      updateDegreeList({
        code: degree.code,
        name,
        offered_places,
        mark_cut_off,
        credits,
        applications,
        students_first_year_2013,
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <Modal show={show} onHide={onClose}>
      <Modal .Header closeButton>
        <Modal.Title>Modifier le diplôme</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p style={{ color: "red" }}>Erreur : {error.message}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="degreeName">
            <Form.Label>Nom du diplôme</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="degreeOfferedPlaces">
            <Form.Label>Places offertes</Form.Label>
            <Form.Control
              type="number"
              value={offered_places}
              onChange={(e) => setOfferedPlaces(Number(e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group controlId="degreeMarkCutOff">
            <Form.Label>Note de coupure</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={mark_cut_off}
              onChange={(e) => setMarkCutOff(Number(e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group controlId="degreeCredits">
            <Form.Label>Crédits</Form.Label>
            <Form.Control
              type="number"
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group controlId="degreeApplications">
            <Form.Label>Applications</Form.Label>
            <Form.Control
              type="number"
              value={applications}
              onChange={(e) => setApplications(Number(e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group controlId="degreeStudentsFirstYear2013">
            <Form.Label>Étudiants en première année 2013</Form.Label>
            <Form.Control
              type="number"
              value={students_first_year_2013}
              onChange={(e) => setStudentsFirstYear2013(Number(e.target.value))}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Mettre à jour
          </Button>
        </Form>
        {confirmationMessage && <p style={{ color: "green" }}>{confirmationMessage}</p>}
      </Modal.Body>
    </Modal>
  );
}

export default EditDegreeForm;