import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Table } from "react-bootstrap";

// Requête GraphQL pour récupérer les facultés
const FACULTIES_QUERY = gql`
  query {
    faculties {
      name
      web
      foundation
    }
  }
`;

function Faculty({ searchTerm }) {
  const { loading, error, data } = useQuery(FACULTIES_QUERY);

  if (loading) return <p>Chargement des facultés...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  // Filtrer les facultés en fonction du terme de recherche
  const filteredFaculties = data.faculties.filter((faculty) =>
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h2>Liste des Facultés</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Web</th>
            <th>Fondation</th>
          </tr>
        </thead>
        <tbody>
          {filteredFaculties.map((faculty, index) => (
            <tr key={index}>
              <td>{faculty.name}</td>
              <td>{faculty.web}</td>
              <td>{faculty.foundation}</td>
             
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Faculty;
