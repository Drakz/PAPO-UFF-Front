import React from "react";
import "./App.css";
import { Row, Col, Card, Button } from "react-bootstrap";

function ProfessorPerfil() {
  //função de retorno

  return (
    <>
      <div className="divPage">
        <Row>
          <Col className="sidebarProfessor">
            <h2>MENU</h2>
            <br></br>
            <Button block variant="info">
              Ementa
            </Button>
            <br></br>
            <Button block variant="primary">
              Professores
            </Button>
            <br></br>
            <Button block variant="primary">
              Quadro de horários
            </Button>
            <br></br>
            <Button block variant="primary">
              Acesso para Alunos
            </Button>
            <br></br>
            <Button block variant="primary">
              Acesso para Coordenadores
            </Button>
            <br></br>
            <Button block variant="primary">
              Monitoria
            </Button>
            <br></br>
            <Button block variant="primary">
              Precisa de Ajuda?
            </Button>
            <br></br>
            <Button block variant="primary">
              Sobre
            </Button>
            <br></br>
          </Col>
          <Col className="centerProfessor" md="10">
            {[
              "Cálculo 1 - 64 horas",
              "IHC - 64 horas",
              "Física 3 - 64 horas",
              "Programação 1 - 96 horas",
              "Redes 1 - 64 horas",
            ].map((materia) => {
              return (
                <>
                  <Card>
                    <Card.Body>{materia}</Card.Body>
                  </Card>
                  <br></br>
                </>
              );
            })}
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProfessorPerfil;
