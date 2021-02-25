import React, { useState, useCallback, useEffect } from "react";
import "../App.css";
import {
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  InputGroup,
  FormControl,
} from "react-bootstrap";

function ProvaAluno() {
  const [enunciado, setEnunciado] = useState("");
  const [resp, setResp] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [id, setId] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compilationAmount, setCompilationAmount] = useState(5);
  const [questionList, setQuestionList] = useState([
    {
      description: "",
      answer: "",
      type: 2,
      value: 0,
    },
  ]);

  useEffect(() => {
    console.log(questionList[0]);
    const myFunction = async () => {
      const res = await fetch(`http://localhost:4000/api/student_questions`, {
        method: "POST",
        body: JSON.stringify({
          testId: 39,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const questions = await res.json();
      console.log(questions);
      setQuestionList(questions);
    };
    myFunction();
  }, []);

  const compile = useCallback(async () => {
    setOutput("Compilando...");
    const res = await fetch(`http://localhost:4000/api/compile`, {
      method: "POST",
      body: JSON.stringify({
        id,
        resp,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const topics = await res.json();
    setOutput(topics.output);
  }, [id, resp]);

  const execute = useCallback(async () => {
    setOutput("Executando...");
    const res = await fetch(`http://localhost:4000/api/execute`, {
      method: "POST",
      body: JSON.stringify({
        id,
        input,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const topics = await res.json();
    setOutput(topics.output);
  }, [id, input]);

  return (
    <>
      <div className="divPage">
        <Row>
          <Col className="sidebarAluno" size="2">
            <ListGroup className="testScroll" variant="flush">
              {questionList.length > 0 ? (
                questionList.map((_question, index) => (
                  <ListGroup.Item
                    key={index}
                    variant={currentIndex === index && "primary"}
                    action
                    onClick={() => {
                      setEnunciado(questionList[index].description);
                      setCurrentIndex(index);
                    }}
                  >
                    Questão {index + 1}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>Carregando...</ListGroup.Item>
              )}
            </ListGroup>
            <br></br>
            <Row>
              {questionList[currentIndex].type === 2 && (
                <>
                  <Col>
                    <Button
                      block
                      variant="danger"
                      onClick={() => {
                        compile();
                        setCompilationAmount(compilationAmount - 1);
                      }}
                    >
                      Compilar [{compilationAmount}]
                    </Button>
                  </Col>
                  <Col>
                    <Button block variant="success" onClick={() => execute()}>
                      Executar
                    </Button>
                  </Col>
                </>
              )}
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
                  className="fixed-textarea"
                  onChange={(e) => setEnunciado(e.target.value)}
                  value={enunciado}
                  as="textarea"
                  rows={6}
                  type="text"
                  placeholder="Enunciado da questão"
                  readOnly={true}
                />
              </Form.Group>
              {questionList[currentIndex].type === 1 && (
                <Form.Group>
                  <Form.Label>Resposta</Form.Label>

                  <Form.Control
                    className="fixed-textarea"
                    onChange={(r) => setResp(r.target.value)}
                    value={resp}
                    as="textarea"
                    rows={10}
                    type="text"
                    placeholder="Resposta da questão"
                  />
                </Form.Group>
              )}
              {questionList[currentIndex].type === 2 && (
                <Form.Group>
                  <Form.Label>Código</Form.Label>
                  <div className="codeEditor">
                    <Form.Control
                      onChange={(r) => setResp(r.target.value)}
                      height={300}
                      width={1487}
                      type="text"
                      as="textarea"
                      value={resp}
                    />
                  </div>
                  <Row>
                    <Col>
                      <Form.Label>Input</Form.Label>
                      <Form.Control
                        className="fixed-textarea"
                        onChange={(i) => setInput(i.target.value)}
                        value={input}
                        as="textarea"
                        rows={7}
                        type="text"
                        placeholder="Input de testes"
                      />
                    </Col>
                    <Col>
                      <Form.Label>Output</Form.Label>
                      <Form.Control
                        className="fixed-textarea"
                        onChange={(o) => setOutput(o.target.value)}
                        value={output}
                        as="textarea"
                        rows={7}
                        type="text"
                        placeholder="Output do compilador"
                        readOnly={true}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              )}
              {questionList[currentIndex].type === 3 && (
                <Form.Group>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Checkbox />
                    </InputGroup.Prepend>
                    <FormControl />
                  </InputGroup>
                  <br></br>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Checkbox />
                    </InputGroup.Prepend>
                    <FormControl />
                  </InputGroup>
                  <br></br>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Checkbox />
                    </InputGroup.Prepend>
                    <FormControl />
                  </InputGroup>
                  <br></br>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Checkbox />
                    </InputGroup.Prepend>
                    <FormControl />
                  </InputGroup>
                </Form.Group>
              )}
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProvaAluno;
