import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Table } from "react-bootstrap";

// Requête GraphQL pour récupérer les campus
const CAMPUSES_QUERY = gql`
  query {
    campuses {
      name
      city
    }
  }
`;

function Campus({ searchTerm }) {
  const { loading, error, data } = useQuery(CAMPUSES_QUERY);

  if (loading) return <p>Chargement des campus...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  // Filtrer les campus en fonction du terme de recherche
  const filteredCampuses = data.campuses.filter((campus) =>
    campus.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h2>Liste des Campus</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Ville</th>
          </tr>
        </thead>
        <tbody>
          {filteredCampuses.map((campus, index) => (
            <tr key={index}>
              <td>{campus.name}</td>
              <td>{campus.city}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Campus;
