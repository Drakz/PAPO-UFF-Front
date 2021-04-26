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
  Modal,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Timer from "react-compound-timer";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "codemirror/theme/monokai.css";

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
    const handler = (e) => {
      e.preventDefault();
      alert("oie");
    };
    const myFunction = async () => {
      const res = await fetch(
        `https://951bd88b0269.ngrok.io/api/student_questions`,
        {
          method: "POST",
          body: JSON.stringify({
            testId: history.location.state.test_id,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const questions = await res.json();
      questions.map(async (question) => {
        question.answer = "";
        question.input = "";
        question.output = "";
      });
      setQuestionList(questions);
      setEnunciado(questions[0].description);
      setCompilationAmount(questions[0].compilations);
    };
    myFunction();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [history.location.state.test_id]);

  const compile = useCallback(async () => {
    if (questionList[currentIndex].compilations > 0) {
      setOutput("Compilando...");
      const res = await fetch(`https://951bd88b0269.ngrok.io/api/compile`, {
        method: "POST",
        body: JSON.stringify({
          id: questionList[currentIndex].question_id,
          student_id: history.location.state.student_id,
          resp,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const topics = await res.json();
      setOutput(topics.output);
      const newQuestionList = [...questionList];
      newQuestionList[currentIndex].output = topics.output;
      setQuestionList(newQuestionList);
    } else {
      setOutput("Número máximo de compilações excedidas.");
    }
  }, [resp, currentIndex, questionList, history.location.state.student_id]);

  const execute = useCallback(async () => {
    setOutput("Executando...");
    const res = await fetch(`https://951bd88b0269.ngrok.io/api/execute`, {
      method: "POST",
      body: JSON.stringify({
        id: questionList[currentIndex].question_id,
        input,
        student_id: history.location.state.student_id,
        index: "aluno",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const topics = await res.json();
    setOutput(topics.output);
    const newQuestionList = [...questionList];
    newQuestionList[currentIndex].output = topics.output;
    setQuestionList(newQuestionList);
  }, [input, currentIndex, questionList, history.location.state.student_id]);

  const endTest = useCallback(async () => {
    questionList[currentIndex].stop();
    setEnunciado(questionList[0].description);
    if (questionList[currentIndex].type === 2) {
      const newQuestionList = [...questionList];
      newQuestionList[currentIndex].answer = resp;
      setQuestionList(newQuestionList);
    }
    setResp(questionList[0].answer);
    setInput(questionList[0].input);
    setOutput(questionList[0].output);
    setCompilationAmount(questionList[0].compilations);
    await Promise.all(
      questionList.map(async (question, index) => {
        question.time = questionList[index].getTime();
        await fetch(`https://951bd88b0269.ngrok.io/api/newStudentQuestion`, {
          method: "POST",
          body: JSON.stringify({
            answer: question.answer,
            time: question.time,
            type: question.type,
            comp: question.type === 2 ? question.compilations : 0,
            testId: history.location.state.test_id,
            studentId: history.location.state.student_id,
            questionId: question.question_id,
            totalValue: question.value,
          }),
          headers: { "Content-Type": "application/json" },
        });
        if (question.type === 2) {
          await fetch(`https://951bd88b0269.ngrok.io/api/compile`, {
            method: "POST",
            body: JSON.stringify({
              id: question.question_id,
              student_id: history.location.state.student_id,
              resp: question.answer,
            }),
            headers: { "Content-Type": "application/json" },
          });
        }
      })
    );
    history.push({
      pathname: "/login",
      state: {
        testId: history.location.state.test_id,
        studentId: history.location.state.student_id,
      },
    });
  }, [history, questionList, currentIndex, resp]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showEnd, setShowEnd] = useState(false);
  const handleCloseEnd = () => setShowEnd(false);
  const handleShowEnd = () => setShowEnd(true);
  return (
    <>
      <div className="divPage">
        <Row>
          <Col className="sidebarAluno" size="2">
            <ListGroup className="testScroll" variant="flush">
              <Timer initialTime={120 * 60 * 1000} direction="backward">
                {({ getTimerState }) => {
                  if (getTimerState() === "STOPPED") {
                    questionList[currentIndex].stop();
                    handleShowEnd();
                  }
                  return (
                    <>
                      <ListGroup.Item variant="info">
                        <p>Tempo de Prova Restante:</p>
                        <Timer.Hours /> horas <Timer.Minutes /> minutos{" "}
                        <Timer.Seconds /> segundos
                      </ListGroup.Item>
                    </>
                  );
                }}
              </Timer>
              {questionList.length > 0 ? (
                questionList.map((_question, index) => (
                  <Timer startImmediately={index === 0 ? true : false}>
                    {({ resume, pause, getTime }) => {
                      const newArray = [...questionList];
                      if (questionList[index].start === undefined) {
                        newArray[index].start = resume;
                        newArray[index].stop = pause;
                        newArray[index].getTime = getTime;
                        setQuestionList(newArray);
                      }
                      return (
                        <>
                          <ListGroup.Item
                            key={index}
                            variant={currentIndex === index && "primary"}
                            action
                            onClick={() => {
                              if (currentIndex !== index) {
                                questionList[currentIndex].stop();
                                const newArray = [...questionList];
                                newArray[currentIndex].time = questionList[
                                  currentIndex
                                ].getTime();
                                setQuestionList(newArray);
                                questionList[index].start();
                                setEnunciado(questionList[index].description);
                                if (questionList[currentIndex].type === 2) {
                                  const newQuestionList = [...questionList];
                                  newQuestionList[currentIndex].answer = resp;
                                  setQuestionList(newQuestionList);
                                }
                                setResp(questionList[index].answer);
                                setInput(questionList[index].input);
                                setOutput(questionList[index].output);
                                setCompilationAmount(
                                  questionList[index].compilations
                                );
                                setCurrentIndex(index);
                                console.log(questionList);
                              }
                            }}
                          >
                            Questão {index + 1}
                          </ListGroup.Item>
                        </>
                      );
                    }}
                  </Timer>
                ))
              ) : (
                <ListGroup.Item>Carregando...</ListGroup.Item>
              )}
            </ListGroup>
            <Button
              block="true"
              variant="info"
              onClick={() => {
                handleShow();
                questionList[currentIndex].stop();
              }}
            >
              Finalizar Prova
            </Button>
          </Col>
          <Col className="centerAluno" md="10">
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
                    <CodeMirror
                      onChange={(r) => {
                        setResp(r.getValue());
                      }}
                      height={300}
                      width={1487}
                      value={
                        resp === ""
                          ? `//-------------------------INSTRUÇÕES-------------------------\n//ATENTE-SE PARA QUE A FUNÇÃO PRINCIPAL DO SEU CÓDIGO TENHA RETORNO,\n//OU SEJA, SUA FUNÇÃO MAIN DEVE SER DO TIPO INTEIRO.\n//EX.:\n//...\n//int main(){\n//...\n//return 0;\n//}\n\n//-------------------------BOA PROVA!-------------------------`
                          : resp
                      }
                      options={{
                        theme: "monokai",
                        tabSize: 2,
                        keyMap: "sublime",
                        mode: "c",
                      }}
                    />
                  </div>
                  <Row>
                    <Col>
                      <Form.Label>Input</Form.Label>
                      <Form.Control
                        className="fixed-textarea"
                        onChange={(i) => {
                          setInput(i.target.value);
                          const newQuestionList = [...questionList];
                          newQuestionList[currentIndex].input = i.target.value;
                          setQuestionList(newQuestionList);
                        }}
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
                          questionList[currentIndex].compilations =
                            compilationAmount - 1 > 0
                              ? compilationAmount - 1
                              : 0;
                          setCompilationAmount(
                            compilationAmount - 1 > 0
                              ? compilationAmount - 1
                              : 0
                          );
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
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Finalizar Prova</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Você está prestes a entregar a prova. Tem certeza disso?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleClose();
                    questionList[currentIndex].start();
                  }}
                >
                  Voltar
                </Button>
                <Button variant="primary" onClick={endTest}>
                  Confirmar
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal
              show={showEnd}
              onHide={handleCloseEnd}
              backdrop="static"
              keyboard={false}
              centered={true}
            >
              <Modal.Body>
                O tempo para fazer a prova acabou. Clique em CONFIRMAR para
                entregar sua prova.
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={endTest}>
                  Confirmar
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProvaAluno;
