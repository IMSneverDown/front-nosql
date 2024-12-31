import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Styled components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f8ff; /* Couleur de fond */
    color: #333; /* Couleur du texte */
    font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 20px;
    text-align: center;
    color: #4a90e2; /* Couleur du titre */
`;

const Paragraph = styled.p`
    font-size: 1.2rem;
    margin-bottom: 30px;
    text-align: center;
`;

const Button = styled.button`
    padding: 20px;
    font-size: 1.5rem;
    color: white;
    background-color: #4a90e2; /* Couleur du bouton */
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #357ab8; /* Couleur du bouton au survol */
    }
`;

const Home = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate("/degrees"); // Naviguer vers la page des diplômes
    };

    return (
        <Container>
            <Title>Bienvenue sur la page d'accueil</Title>
            <Paragraph>Ceci est votre application React pour interagir avec le backend GraphQL.</Paragraph>
            <Button onClick={handleContinue}>Continuer</Button>
        </Container>
    );
};

export default Home;