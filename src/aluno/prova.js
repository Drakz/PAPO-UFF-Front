import React, { useState, useCallback } from "react";
import "../App.css";

import { Row, Col, Form, Button, ListGroup } from "react-bootstrap";

function ProvaAluno() {
  const [
    enunciado,
    setEnunciado,
  ] = useState(`Faça um programa para retornar 3 vezes o valor do input dado pelo usuário.
  Exemplo de Entrada: 22
  Exemplo de Saída: 66
  `);
  const [resp, setResp] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const getOutput = useCallback(async () => {
    setOutput("Executando...");
    const res = await fetch(`http://localhost:4000/api/teste`, {
      method: "POST",
      body: JSON.stringify({
        resp,
        input,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const topics = await res.json();
    setOutput(topics.output);
  }, [resp, input]);

  return (
    <>
      <div className="divPage">
        <Row>
          <Col className="sidebarAluno" size="2">
            <ListGroup className="testScroll" variant="flush">
              <ListGroup.Item variant="dark">Questões</ListGroup.Item>
            </ListGroup>
            <br></br>
            <Row>
              <Col>
                <Button block variant="danger">
                  Compilar [3]
                </Button>
              </Col>
              <Col>
                <Button block variant="success">
                  Executar
                </Button>
              </Col>
            </Row>
            <br></br>
            <Button block="true" variant="info">
              Finalizar Prova
            </Button>
          </Col>
          <Col className="centerProfessor" md="10">
            <Form>
              <Form.Group>
                <Form.Label>Enunciado</Form.Label>
                <Form.Control
                  onChange={(e) => setEnunciado(e.target.value)}
                  value={enunciado}
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Enunciado da questão"
                  readOnly="true"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Resposta</Form.Label>
                <Form.Control
                  onChange={(r) => setResp(r.target.value)}
                  value={resp}
                  as="textarea"
                  rows={10}
                  type="text"
                  placeholder="Resposta da questão"
                />
              </Form.Group>
              <Form.Group>
                <Row>
                  <Col>
                    <Form.Label>Input</Form.Label>
                    <Form.Control
                      onChange={(i) => setInput(i.target.value)}
                      value={input}
                      as="textarea"
                      rows={3}
                      type="text"
                      placeholder="Input de testes"
                    />
                  </Col>
                  <Col>
                    <Form.Label>Output</Form.Label>
                    <Form.Control
                      onChange={(o) => setOutput(o.target.value)}
                      value={output}
                      as="textarea"
                      rows={3}
                      type="text"
                      placeholder="Output do compilador"
                      readOnly={true}
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Button onClick={() => getOutput(resp, input)}>Teste</Button>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProvaAluno;
