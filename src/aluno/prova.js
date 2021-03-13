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
      type: 1,
      value: 0,
    },
  ]);

  useEffect(() => {
    const myFunction = async () => {
      const res = await fetch(`http://localhost:4000/api/student_questions`, {
        method: "POST",
        body: JSON.stringify({
          testId: 3,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const questions = await res.json();
      questions.map(async (question) => {
        question.answer = "";
        question.alt = [];
      });
      console.log(questions);
      setQuestionList(questions);
    };
    const myAlternatives = async (id) => {
      console.log(questionList[currentIndex].question_id);
      const alt = await fetch(
        `http://localhost:4000/api/student_alternatives`,
        {
          method: "POST",
          body: JSON.stringify({
            questionId: id,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return await alt.json();
    };
    myFunction();
    questionList.map(async (question) => {
      if (question.type === 3) {
        question.alt = await myAlternatives(question.id);
      }
    });
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
                      setResp(questionList[index].answer);
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
                  onChange={(e) => {
                    setEnunciado(e.target.value);
                  }}
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
                    onChange={(r) => {
                      setResp(r.target.value);
                      const newQuestionList = [...questionList];
                      newQuestionList[currentIndex].answer = r.target.value;
                      setQuestionList(newQuestionList);
                    }}
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
                <>
                  {questionList[currentIndex].alt.map((_alt, index) => {
                    return (
                      <>
                        <Form.Group key={index}>
                          <InputGroup>
                            <InputGroup.Prepend>
                              <InputGroup.Checkbox />
                            </InputGroup.Prepend>
                            <FormControl
                              key={index}
                              defaultValue={_alt.alternative}
                              readOnly
                            />
                          </InputGroup>
                        </Form.Group>
                        <br></br>
                      </>
                    );
                  })}
                </>
              )}
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProvaAluno;
