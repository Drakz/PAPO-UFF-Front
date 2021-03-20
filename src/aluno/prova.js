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
import { useHistory } from "react-router-dom";

function ProvaAluno() {
  const history = useHistory();
  const [enunciado, setEnunciado] = useState("");
  const [resp, setResp] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
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
          testId: history.location.state.test_id,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const questions = await res.json();
      questions.map(async (question) => {
        question.answer = "";
      });
      setQuestionList(questions);
    };
    myFunction();
  }, [history.location.state.test_id]);

  const compile = useCallback(async () => {
    setOutput("Compilando...");
    const res = await fetch(`http://localhost:4000/api/compile`, {
      method: "POST",
      body: JSON.stringify({
        id: currentIndex,
        resp,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const topics = await res.json();
    setOutput(topics.output);
  }, [resp, currentIndex]);

  const execute = useCallback(async () => {
    setOutput("Executando...");
    const res = await fetch(`http://localhost:4000/api/execute`, {
      method: "POST",
      body: JSON.stringify({
        id: currentIndex,
        input,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const topics = await res.json();
    setOutput(topics.output);
  }, [input, currentIndex]);

  const endTest = useCallback(async () => {
    questionList.map(async (question) => {
      await fetch(`http://localhost:4000/api/newStudentQuestion`, {
        method: "POST",
        body: JSON.stringify({
          answer: question.answer,
          time: 0,
          type: question.type,
          comp: 0,
          testId: history.location.state.test_id,
          studentId: history.location.state.student_id,
          questionId: question.question_id,
        }),
        headers: { "Content-Type": "application/json" },
      });
    });
    history.push({
      pathname: "/login",
    });
  }, [history, questionList]);

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
            <Button block="true" variant="info" onClick={endTest}>
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
                    rows={20}
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
                      className="fixed-textarea"
                      onChange={(r) => {
                        setResp(r.target.value);
                        const newQuestionList = [...questionList];
                        const string = r.target.value.replace('"', '""');
                        newQuestionList[currentIndex].answer = string;
                        setQuestionList(newQuestionList);
                      }}
                      rows={10}
                      type="text"
                      as="textarea"
                      value={resp}
                      placeholder="Código da questão"
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
                  <br></br>
                  <Row>
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
                              <InputGroup.Checkbox
                                checked={
                                  questionList[currentIndex].answer === index
                                    ? true
                                    : false
                                }
                                onClick={() => {
                                  const newQuestionList = [...questionList];
                                  newQuestionList[currentIndex].answer = index;
                                  setQuestionList(newQuestionList);
                                }}
                              />
                            </InputGroup.Prepend>
                            <FormControl
                              key={index}
                              defaultValue={_alt.alternative}
                              readOnly
                            />
                          </InputGroup>
                        </Form.Group>
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
