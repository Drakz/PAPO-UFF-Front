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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p style={{ color: "#0f62ac", fontSize: "60px" }}>PAPO</p>
                  <Figure>
                    <Figure.Image
                      width={171}
                      height={180}
                      alt="171x180"
                      src="https://jadeferreira.com.br/img/uff.png"
                    />
                  </Figure>
                </div>
              </Card.Header>
              <Card.Header>
                Bem vindo, {history.location.state.name}!
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  <Form
                    onSubmit={() => {
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
                    <Form.Group>
                      <Form.Label>Digite o código da prova</Form.Label>
                      <Form.Control
                        onChange={(e) => {
                          setTestId(e.target.value);
                        }}
                        type="text"
                        placeholder="Ex.: 12345"
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Entrar
                    </Button>
                  </Form>
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  Em caso de dúvidas ou problemas, por favor, comunique ao
                  professor.
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
