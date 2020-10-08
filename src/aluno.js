import React from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'

function Aluno(){

  return(
    <div>
      <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#perfil">Papo UFF</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#perfil">Perfil</Nav.Link>
        <Nav.Link href="#features">Sala de Prova</Nav.Link>
      </Nav>
        <Button variant="outline-light">Sair</Button>
      </Navbar>
    </div>
    );
}

export default Aluno;