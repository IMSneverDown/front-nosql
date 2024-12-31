import { Table } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";

const DEGREES_ABOVE_AVERAGE_QUERY = gql`
  query {
    degreesAboveAverageCredits {
      name
      credits
    }
  }
`;


function DegreesAboveAverage() {
    const { loading, error, data } = useQuery(DEGREES_ABOVE_AVERAGE_QUERY);
  
    if (loading) return <p>Chargement des diplômes au-dessus de la moyenne...</p>;
    if (error) return <p>Erreur: {error.message}</p>;
  
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Crédits</th>
          </tr>
        </thead>
        <tbody>
          {data.degreesAboveAverageCredits.map((degree, index) => (
            <tr key={index}>
              <td>{degree.name}</td>
              <td>{degree.credits}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  
export  default DegreesAboveAverage