import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Container, Row, Col, Nav, Table, Button, Form } from "react-bootstrap";
import Faculty from "./Faculties";
import School from "./Schools";
import Campus from "./Campus";
import "bootstrap/dist/css/bootstrap.min.css";
import DegreeDetails from "./DegreeDetails";
import AddDegree from "./addDegree";
import AddFaculty from "./addFaculty";
import AddSchool from "./addSchool";
import AddCampus from "./addCampus";
import EditDegreeForm from "./updateDegree";

const DEGREES_QUERY = gql`
  query {
    degrees {
      offered_places
      mark_cut_off
      name
      credits
      code
    }
  }
`;


function Degree() {
  const [activeTab, setActiveTab] = useState("degrees");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { loading, error, data, refetch } = useQuery(DEGREES_QUERY);
  

  const filteredDegrees = data?.degrees.filter((degree) =>
    degree.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClose = () => {
    setShowAddModal(false);
    refetch();
  };

  const handleEditDegree = (degree) => {
    setSelectedDegree(degree);
    setIsEditMode(true);
  };

  const handleCloseEditDegree = () => {
    setIsEditMode(false);
    setSelectedDegree(null);
  };

  

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <Container fluid className="p-4">
      <Row>
        {/* Menu de navigation */}
        <Col md={3} className="bg-dark text-light p-4">
          <h4>Menu</h4>
          <Nav className="flex-column">
            <Nav.Link
              className="text-light"
              onClick={() => setActiveTab("degrees")}
            >
              Diplômes
            </Nav.Link>
            <Nav.Link
              className="text-light"
              onClick={() => setActiveTab("faculties")}
            >
              Facultés
            </Nav.Link>
            <Nav.Link
              className="text-light"
              onClick={() => setActiveTab("schools")}
            >
              Écoles
            </Nav.Link>
            <Nav.Link
              className="text-light"
              onClick={() => setActiveTab("campuses")}
            >
              Campus
            </Nav.Link>
          </Nav>
        </Col>

        {/* Contenu principal */}
        <Col md={9}>
          <Row className="mb-3">
            <Col md={8}>
              <Form.Control
                type="text"
                placeholder={`Rechercher ${
                  activeTab === "degrees"
                    ? "un diplôme"
                    : activeTab === "faculties"
                    ? "une faculté"
                    : activeTab === "schools"
                    ? "une école"
                    : "un campus"
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={4} className="text-end">
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                Ajouter
              </Button>
            </Col>
          </Row>

          {/* Affichage des onglets */}
          {activeTab === "degrees" && (
            <>
              <h2>Liste des Diplômes</h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Code</th>
                    <th>Crédits</th>
                    <th>Places Offertes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDegrees?.map((degree) => (
                    <tr key={degree.code}>
                      <td>{degree.name}</td>
                      <td>{degree.code}</td>
                      <td>{degree.credits}</td>
                      <td>{degree.offered_places}</td>
                      <td>
                        <Button
                          variant="info"
                          className="me-2"
                          onClick={() => setSelectedDegree(degree)}
                        >
                          Détails
                        </Button>
                        <Button
                          variant="warning"
                          className="me-2"
                          onClick={() => handleEditDegree(degree)}
                        >
                          Modifier
                        </Button>
                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {activeTab === "faculties" && <Faculty searchTerm={searchTerm} />}
          {activeTab === "schools" && <School searchTerm={searchTerm} />}
          {activeTab === "campuses" && <Campus searchTerm={searchTerm} />}
        </Col>
      </Row>

      {/* Modal d'ajout dynamique */}
      {showAddModal && (
        <>
          {activeTab === "degrees" && (
            <AddDegree show={showAddModal} handleClose={handleAddClose} />
          )}
          {activeTab === "faculties" && (
            <AddFaculty show={showAddModal} handleClose={handleAddClose} />
          )}
          {activeTab === "schools" && (
            <AddSchool show={showAddModal} handleClose={handleAddClose} />
          )}
          {activeTab === "campuses" && (
            <AddCampus show={showAddModal} handleClose={handleAddClose} />
          )}
        </>
      )}

      {/* Modifications */}
      {isEditMode && selectedDegree && (
        <EditDegreeForm
          show={isEditMode}
          onClose={handleCloseEditDegree}
          degree={selectedDegree}
        />
      )}

      {/* Détails */}
      {!isEditMode && selectedDegree && (
        <DegreeDetails
          degree={selectedDegree}
          onClose={() => setSelectedDegree(null)}
        />
      )}
    </Container>
  );
}

export default Degree;
