import React from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';

function Professor(){

  return(
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">Papo UFF</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="/professor/perfil">Perfil</Nav.Link>
      <Nav.Link href="#features">Banco de Questões</Nav.Link>
      <Nav.Link href="#pricing">Criar Prova</Nav.Link>
      <Nav.Link href="#pricing">Aplicar Prova</Nav.Link>
    </Nav>
      <Button variant="outline-light">Sair</Button>
  </Navbar>
    );
}

export default Professor;