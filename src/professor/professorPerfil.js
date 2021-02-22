import React from "react";
import Professor from "./professor";
import "../App.css";
import { Row, Col, Card, Image } from "react-bootstrap";

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
              <Card.Header>Período 2020.1</Card.Header>
            </Card>
            <br></br>
            <Card>
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p>Linguagens de Programação - RCM00008 </p>

                  <footer className="blockquote-footer">16 Alunos</footer>
                </blockquote>
              </Card.Body>
            </Card>
            <br></br>
            <Card>
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p>Prog Web - RCM00057</p>

                  <footer className="blockquote-footer">8 Alunos</footer>
                </blockquote>
              </Card.Body>
            </Card>
            <br></br>
            <Card>
              <Card.Header>Período 2019.7</Card.Header>
            </Card>
            <br></br>
            <Card>
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p>Linguagens de Programação - RCM00008 </p>
                  <footer className="blockquote-footer">12 Alunos</footer>
                </blockquote>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProfessorPerfil;
