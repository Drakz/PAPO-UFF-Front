import React, { useState } from "react";
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
import { useHistory } from "react-router-dom";

function Aluno() {
  const [testId, setTestId] = useState(0);
  const history = useHistory();
  //console.log(history.location.state.id);
  return (
    <div className="AlunoHeader">
      <Container>
        <Row>
          <Col className="homeAluno">
            <Card>
              <Card.Header>
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
                      <Form.Control
                        onChange={(e) => {
                          setTestId(e.target.value);
                        }}
                        type="text"
                        placeholder="Ex. 12345"
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      onClick={() => {
                        console.log(testId);
                        if (parseInt(testId) > 0) {
                          history.push({
                            pathname: "/aluno/prova",
                            state: {
                              student_id: history.location.state.id,
                              test_id: testId,
                            },
                          });
                        } else {
                          console.log("Deu ruim");
                        }
                      }}
                    >
                      Entrar
                    </Button>
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
