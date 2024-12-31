import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Table } from "react-bootstrap";

// Requête GraphQL pour récupérer les écoles
const SCHOOLS_QUERY = gql`
  query {
    schools {
      name
      web
      foundation
    }
  }
`;

function School({ searchTerm }) {
  const { loading, error, data } = useQuery(SCHOOLS_QUERY);

  if (loading) return <p>Chargement des écoles...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  // Filtrer les écoles en fonction du terme de recherche
  const filteredSchools = data.schools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h2>Liste des Écoles</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Localisation</th>
            <th>Fondation</th>
          </tr>
        </thead>
        <tbody>
          {filteredSchools.map((school, index) => (
            <tr key={index}>
              <td>{school.name}</td>
              <td>{school.web}</td>
              <td>{school.foundation}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default School;
