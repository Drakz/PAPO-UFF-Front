import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import { Navbar, Nav } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function Professor({ id }) {
  const history = useHistory();
  return (
    <Navbar className="headerProfessor" bg="primary" variant="dark">
      <Navbar.Brand>PAPO UFF</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link
          onClick={() => {
            history.push({
              pathname: "/professor/perfil",
              state: {
                prof_id: id,
              },
            });
          }}
        >
          Início
        </Nav.Link>
        <Nav.Link
          onClick={() => {
            history.push({
              pathname: "/professor/bancoDeQuestoes",
              state: {
                prof_id: id,
              },
            });
          }}
        >
          Banco de Questões
        </Nav.Link>
        <Nav.Link
          onClick={() => {
            history.push({
              pathname: "/professor/criarProva",
              state: {
                prof_id: id,
              },
            });
          }}
        >
          Criar Prova
        </Nav.Link>
        <Nav.Link
          style={{ position: "absolute", right: 20 }}
          onClick={() => {
            history.push({
              pathname: "/login",
            });
          }}
        >
          Sair
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default Professor;
