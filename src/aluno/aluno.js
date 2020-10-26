import React from "react";
import {
  Figure,
  Card,
  Row,
  Col,
  Form,
  Button,
  Container,
} from "react-bootstrap";
import "../App.css";

function Aluno() {
  return (
    <div className="AlunoHeader">
      <Container>
        <Row>
          <Col className="homeAluno">
            <Card>
              <Card.Header>
                {" "}
                <Figure>
                  <Figure.Image
                    width={171}
                    height={180}
                    alt="171x180"
                    src="https://jadeferreira.com.br/img/uff.png"
                  />
                </Figure>
              </Card.Header>
              <Card.Header>Bem vindo, ...</Card.Header>
              <Card.Body>
                <Card.Text>
                  <Form>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Digite o código da prova</Form.Label>
                      <Form.Control type="text" placeholder="Ex. 22222" />
                    </Form.Group>
                    <Button variant="primary">Entrar</Button>
                  </Form>
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  Qualquer dúvida entrar em contato com o professor
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Aluno;
