import React from "react";
import Professor from "./professor";
import "../App.css";
import { Row, Col, Card, Image, Button } from "react-bootstrap";

function ProfessorPerfil() {
  //função de retorno
  return (
    <>
      <Professor />
      <div className="divPage">
        <Row>
          <Col className="sidebarProfessor">
            <Image
              src="http://www2.ic.uff.br/~bazilio/imagens/eu2.jpg"
              rounded
            />
            <h3>Bazílio</h3>
          </Col>
          <Col className="centerProfessor" md="10">
            <br></br>
            <Card>
              <Card.Header>Alarmes</Card.Header>
            </Card>
            <br></br>
            <Card>
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p>Segunda-Feira </p>

                  <footer className="blockquote-footer">16:10</footer>
                </blockquote>
              </Card.Body>
            </Card>
            <br></br>
            <Card>
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p>Quarta-feira</p>

                  <footer className="blockquote-footer">9:30</footer>
                </blockquote>
              </Card.Body>
            </Card>
            <br></br>
            <Button>Novo Alarme</Button>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProfessorPerfil;
