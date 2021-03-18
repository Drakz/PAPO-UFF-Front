import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { Navbar, Nav } from "react-bootstrap";

function Professor() {
  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Brand>PAPO UFF</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/professor/perfil">Início</Nav.Link>
        <Nav.Link href="/professor/bancoDeQuestoes">Banco de Questões</Nav.Link>
        <Nav.Link href="/professor/criarProva">Criar Prova</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default Professor;
