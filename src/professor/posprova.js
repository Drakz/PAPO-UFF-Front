import React, { useCallback, useEffect, useState } from "react";
import Professor from "./professor";
import "../App.css";
import {
  Row,
  Col,
  Card,
  ListGroup,
  Tabs,
  Tab,
  Form,
  InputGroup,
  FormControl,
  Accordion,
  Modal,
  Button,
} from "react-bootstrap";
import Chart from "react-apexcharts";
import { useHistory } from "react-router-dom";

function PosProva() {
  const history = useHistory();
  const [testName, setTestName] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [graphs, setGraphs] = useState(true);
  const [questionsDisplay, setQuestionsDisplay] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(0);
  const [timeList, setTimeList] = useState([]);
  const [compList, setCompList] = useState([]);
  const [rightList, setRightList] = useState([]);
  const [wrongList, setWrongList] = useState([]);
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);
  //função de retorno

  const tempo = {
    colors: ["#F44336", "#E91E63", "#9C27B0"],
    options: {
      label: "oi",
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: questionList.map((question) => question.title),
      },
    },
    series: [
      {
        name: "Tempo",
        data: timeList,
      },
    ],
  };
  const acerto = {
    colors: ["#b84644", "#4576b5"],
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: questionList
          .filter((question) => question.type === 2)
          .map((question) => question.title),
      },
    },
    series: [
      {
        name: "Compilações",
        data: compList,
      },
    ],
  };
  /*  const acerto = {
    colors: ["#b84644", "#4576b5"],
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: questionList.map((question) => question.title),
      },
    },
    series: [
      {
        name: "Acertos",
        data: [3, 5, 4, 1, 5],
      },
      {
        name: "Erros",
        data: [3, 1, 2, 5, 1],
      },
    ],
  };*/

  useEffect(() => {
    const myFunction = async () => {
      const res = await fetch(`https://2724b8b49587.ngrok.io/api/test`, {
        method: "POST",
        body: JSON.stringify({
          test_id: history.location.state.test_id,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const test = await res.json();
      setTestName(test[0].name);
      const questionListQuery = await fetch(
        `https://2724b8b49587.ngrok.io/api/professor_questions`,
        {
          method: "POST",
          body: JSON.stringify({
            test_id: history.location.state.test_id,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const questionListRes = await questionListQuery.json();
      setQuestionList(questionListRes);
      const query = await fetch(
        `https://2724b8b49587.ngrok.io/api/test_students`,
        {
          method: "POST",
          body: JSON.stringify({
            test_id: history.location.state.test_id,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const students = await query.json();
      const stringStudents = students.map((student) => {
        return student.student_id;
      });
      const queryStudent = await fetch(
        `https://2724b8b49587.ngrok.io/api/students`,
        {
          method: "POST",
          body: JSON.stringify({
            student_ids: stringStudents.toString(),
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const studentList = await queryStudent.json();
      setStudentList(studentList);
      const queryStudentAnswer = await fetch(
        `https://2724b8b49587.ngrok.io/api/students_answer`,
        {
          method: "POST",
          body: JSON.stringify({
            student_ids: stringStudents.toString(),
            test_id: history.location.state.test_id,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const studentAnswers = await queryStudentAnswer.json();
      await Promise.all(
        studentAnswers.map(async (question) => {
          question.inputs = 0;
          question.erro = "";
          const gabaritoQuestion = questionListRes.find(
            (element) => element.question_id === question.question_id
          );
          if (question.checked === 0) {
            if (question.type === 1) {
              if (gabaritoQuestion.answer[0].answer === question.answer) {
                await fetch(
                  `https://2724b8b49587.ngrok.io/api/updateQuestionScore`,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      newValue: question.total_value,
                      question_id: question.student_question_id,
                      feedback: "Questão Correta.",
                    }),
                    headers: { "Content-Type": "application/json" },
                  }
                );
              } else {
                await fetch(
                  `https://2724b8b49587.ngrok.io/api/updateQuestionScore`,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      newValue: 0,
                      question_id: question.student_question_id,
                      feedback: "Questão Errada.",
                    }),
                    headers: { "Content-Type": "application/json" },
                  }
                );
              }
            } else if (question.type === 2) {
              Promise.all(
                gabaritoQuestion.answer.map(
                  async (input_output, indexQuestion) => {
                    const res = await fetch(
                      `https://2724b8b49587.ngrok.io/api/execute`,
                      {
                        method: "POST",
                        body: JSON.stringify({
                          id: question.question_id,
                          input: input_output.input,
                          student_id: question.student_id,
                          index: indexQuestion,
                        }),
                        headers: { "Content-Type": "application/json" },
                      }
                    );
                    const outputExecuted = await res.json();
                    if (outputExecuted.output === input_output.output) {
                      question.inputs = question.inputs + 1;
                    } else {
                      question.erro =
                        question.erro +
                        "< Input: " +
                        input_output.input.toString() +
                        " Output Esperado: " +
                        input_output.output.toString() +
                        " Output Recebido: " +
                        outputExecuted.output +
                        " >";
                    }
                    if (indexQuestion === gabaritoQuestion.answer.length - 1) {
                      if (question.inputs === gabaritoQuestion.answer.length) {
                        await fetch(
                          `https://2724b8b49587.ngrok.io/api/updateQuestionScore`,
                          {
                            method: "POST",
                            body: JSON.stringify({
                              newValue: question.total_value,
                              question_id: question.student_question_id,
                              feedback: "Questão Correta.",
                            }),
                            headers: { "Content-Type": "application/json" },
                          }
                        );
                      } else if (question.inputs === 0) {
                        await fetch(
                          `https://2724b8b49587.ngrok.io/api/updateQuestionScore`,
                          {
                            method: "POST",
                            body: JSON.stringify({
                              newValue: 0,
                              question_id: question.student_question_id,
                              feedback: "Questão Errada.",
                            }),
                            headers: { "Content-Type": "application/json" },
                          }
                        );
                      } else {
                        await fetch(
                          `https://2724b8b49587.ngrok.io/api/updateQuestionScore`,
                          {
                            method: "POST",
                            body: JSON.stringify({
                              newValue: Math.floor(
                                question.total_value *
                                  (question.inputs /
                                    gabaritoQuestion.answer.length)
                              ),
                              question_id: question.student_question_id,
                              feedback:
                                "Questão " +
                                (
                                  (question.inputs /
                                    gabaritoQuestion.answer.length) *
                                  100
                                ).toFixed(2) +
                                "% correta. Erros: " +
                                question.erro,
                            }),
                            headers: { "Content-Type": "application/json" },
                          }
                        );
                      }
                    }
                  }
                )
              );
            } else if (question.type === 3) {
              if (
                parseInt(gabaritoQuestion.answer[0].answer) ===
                parseInt(question.answer)
              ) {
                await fetch(
                  `https://2724b8b49587.ngrok.io/api/updateQuestionScore`,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      newValue: question.total_value,
                      question_id: question.student_question_id,
                      feedback: "Questão correta",
                    }),
                    headers: { "Content-Type": "application/json" },
                  }
                );
              } else {
                await fetch(
                  `https://2724b8b49587.ngrok.io/api/updateQuestionScore`,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      newValue: 0,
                      question_id: question.student_question_id,
                      feedback: "Questão errada",
                    }),
                    headers: { "Content-Type": "application/json" },
                  }
                );
              }
            }
          }
        })
      );
      const queryStudentAnswerFinal = await fetch(
        `https://2724b8b49587.ngrok.io/api/students_answer`,
        {
          method: "POST",
          body: JSON.stringify({
            student_ids: stringStudents.toString(),
            test_id: history.location.state.test_id,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const studentAnswersFinal = await queryStudentAnswerFinal.json();
      setTimeList(
        questionListRes.map((question) => {
          const aux = studentAnswersFinal.filter(
            (element) => element.question_id === question.question_id
          );
          const times = aux.map((q) => q.time);
          return (
            times.reduce((total, num) => total + num) /
            aux.length /
            60000
          ).toFixed(2);
        })
      );
      setCompList(
        questionListRes.map((question) => {
          if (question.type === 2) {
            const aux = studentAnswersFinal.filter(
              (element) => element.question_id === question.question_id
            );
            const times = aux.map((q) => question.compilations - q.comp);
            return times.reduce((total, num) => total + num) / aux.length;
          } else {
            return null;
          }
        })
      );

      setAnswerList(studentAnswersFinal);
      handleClose();
    };
    //[percorrer a lista para pegar os tempos
    //percorrer a lista para pegar as compilações
    //percorrer a lista para pegar questão certa(?)]
    myFunction();
  }, [history.location.state.test_id]);

  const [currentIndex, setCurrentIndex] = useState(-1);

  const setQuestionValue = useCallback(async (id, newValue) => {
    await fetch(`https://2724b8b49587.ngrok.io/api/updateQuestionScore`, {
      method: "POST",
      body: JSON.stringify({
        newValue: newValue,
        question_id: id,
        feedback: "Nota alterada pelo professor.",
      }),
      headers: { "Content-Type": "application/json" },
    });
  }, []);

  return (
    <>
      <Professor id={history.location.state.prof_id} />
      <div className="divPage">
        <Row>
          <Col className="sidebarProfessor">
            <ListGroup className="questionScroll" variant="flush">
              <ListGroup.Item
                onClick={() => {
                  setGraphs(true);
                  setQuestionsDisplay(false);
                }}
                variant="primary"
                action
              >
                {testName} - 2020.1
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                Lista de Alunos
              </ListGroup.Item>
              {studentList.map((student, index) => (
                <ListGroup.Item
                  variant={currentIndex === index && "primary"}
                  action
                  onClick={() => {
                    if (index !== currentIndex) {
                      setCurrentStudent(
                        answerList.filter(
                          (element) => element.student_id === student.student_id
                        )
                      );
                      setCurrentIndex(index);
                      setQuestionsDisplay(true);
                      setGraphs(false);
                    }
                  }}
                >
                  {student.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col className="centerProfessorProva" md="10">
            {questionsDisplay && (
              <Accordion defaultActiveKey={1}>
                {questionList.map((question, index) => (
                  <>
                    <div key={index} style={{ marginBottom: 5 }}>
                      <Card border="primary">
                        <Accordion.Toggle
                          as={Card.Header}
                          eventKey={index + 1}
                          style={{ cursor: "pointer" }}
                        >
                          {question.title}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={index + 1}>
                          <Card.Body>
                            <Form>
                              <Form.Group>
                                <Form.Label>Enunciado</Form.Label>
                                <Form.Control
                                  className="fixed-textarea"
                                  value={question.description}
                                  as="textarea"
                                  rows={3}
                                  disabled={true}
                                />
                              </Form.Group>
                              {question.type === 1 && (
                                <>
                                  <Form.Group>
                                    <Form.Label>Feedback</Form.Label>
                                    <Form.Control
                                      className="fixed-textarea"
                                      value={
                                        currentStudent.filter(
                                          (element) =>
                                            element.question_id ===
                                            question.question_id
                                        )[0].feedback
                                      }
                                      as="textarea"
                                      rows={1}
                                      disabled={true}
                                    />
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label>Resposta Aluno</Form.Label>
                                    <Form.Control
                                      value={
                                        currentStudent.filter(
                                          (element) =>
                                            element.question_id ===
                                            question.question_id
                                        )[0].answer
                                      }
                                      className="fixed-textarea"
                                      as="textarea"
                                      rows={7}
                                      disabled={true}
                                    />
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label>Gabarito</Form.Label>
                                    <Form.Control
                                      className="fixed-textarea"
                                      value={question.answer[0].answer}
                                      as="textarea"
                                      rows={3}
                                      disabled={true}
                                    />
                                  </Form.Group>
                                </>
                              )}
                              {question.type === 2 && (
                                <>
                                  <Form.Group>
                                    <Form.Label>Feedback</Form.Label>
                                    <Form.Control
                                      className="fixed-textarea"
                                      value={
                                        currentStudent.filter(
                                          (element) =>
                                            element.question_id ===
                                            question.question_id
                                        )[0].feedback
                                      }
                                      as="textarea"
                                      rows={1}
                                      disabled={true}
                                    />
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label>Resposta Aluno</Form.Label>
                                    <Form.Control
                                      value={
                                        currentStudent.filter(
                                          (element) =>
                                            element.question_id ===
                                            question.question_id
                                        )[0].answer
                                      }
                                      className="fixed-textarea"
                                      as="textarea"
                                      rows={7}
                                      disabled={true}
                                    />
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label>Gabarito</Form.Label>
                                    <Form.Control
                                      className="fixed-textarea"
                                      value={question.answer.map(
                                        (obj, index) => {
                                          return (
                                            "< Input: " +
                                            obj.input +
                                            " Output: " +
                                            obj.output +
                                            " >"
                                          );
                                        }
                                      )}
                                      as="textarea"
                                      rows={3}
                                      disabled={true}
                                    />
                                  </Form.Group>
                                </>
                              )}
                              {question.type === 3 && (
                                <>
                                  <Form.Group>
                                    <Form.Label>Feedback</Form.Label>
                                    <Form.Control
                                      className="fixed-textarea"
                                      value={
                                        currentStudent.filter(
                                          (element) =>
                                            element.question_id ===
                                            question.question_id
                                        )[0].feedback
                                      }
                                      as="textarea"
                                      rows={1}
                                      disabled={true}
                                    />
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label>Alternativas</Form.Label>
                                    {question.alt.map((_alt, indexInside) => {
                                      return (
                                        <>
                                          <Form.Group key={index}>
                                            <InputGroup>
                                              <FormControl
                                                key={index}
                                                value={_alt.alternative}
                                                disabled
                                              />
                                            </InputGroup>
                                          </Form.Group>
                                        </>
                                      );
                                    })}
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label>Respota Aluno</Form.Label>
                                    <Form.Control
                                      className="fixed-textarea"
                                      value={
                                        question.alt[
                                          parseInt(
                                            currentStudent.filter(
                                              (element) =>
                                                element.question_id ===
                                                question.question_id
                                            )[0].answer
                                          )
                                        ].alternative
                                      }
                                      rows={1}
                                      as="textarea"
                                      disabled={true}
                                    />
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label>Gabarito</Form.Label>
                                    <Form.Control
                                      className="fixed-textarea"
                                      value={
                                        question.alt[
                                          parseInt(question.answer[0].answer)
                                        ].alternative
                                      }
                                      as="textarea"
                                      rows={1}
                                      disabled={true}
                                    />
                                  </Form.Group>
                                </>
                              )}
                              <Form.Row>
                                <Col md={2}>
                                  <Form.Label>Nota desta Questão:</Form.Label>
                                </Col>
                                <Col md={{ span: 1, offset: 0 }}>
                                  <Form.Control
                                    value={parseInt(
                                      currentStudent.filter(
                                        (element) =>
                                          element.question_id ===
                                          question.question_id
                                      )[0].value
                                    )}
                                    onChange={(v) =>
                                      (currentStudent.filter(
                                        (element) =>
                                          element.question_id ===
                                          question.question_id
                                      )[0].value = v.target.value)
                                    }
                                    type="number"
                                  />
                                </Col>
                                <Col>
                                  <Button
                                    variant="success"
                                    onClick={() => {
                                      setQuestionValue(
                                        parseInt(
                                          currentStudent.filter(
                                            (element) =>
                                              element.question_id ===
                                              question.question_id
                                          )[0].student_question_id
                                        ),
                                        parseInt(
                                          currentStudent.filter(
                                            (element) =>
                                              element.question_id ===
                                              question.question_id
                                          )[0].value
                                        )
                                      );
                                    }}
                                  >
                                    Salvar Nota
                                  </Button>
                                </Col>
                              </Form.Row>
                            </Form>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </div>
                    <br></br>
                  </>
                ))}
              </Accordion>
            )}
            {graphs && (
              <Tabs defaultActiveKey="graficos" id="uncontrolled-tab-example">
                <Tab eventKey="graficos" title="Gráficos">
                  <br></br>
                  <Col>
                    <Card>
                      <Card.Header>
                        Média de tempo por questão (minuto)
                      </Card.Header>
                      <Card.Body>
                        <Chart
                          options={tempo.options}
                          series={tempo.series}
                          type="bar"
                          height="300"
                        />
                      </Card.Body>
                    </Card>
                    <br></br>
                    <Card>
                      <Card.Header>
                        Média de compilações por questão
                      </Card.Header>
                      <Card.Body>
                        <Chart
                          options={acerto.options}
                          series={acerto.series}
                          type="bar"
                          height="300"
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Tab>
                <Tab eventKey="questoes" title="Questões em Destaque">
                  <br></br>
                  <Col>
                    <Card>
                      <Card.Header>
                        Questão mais demorada - {Math.max(...timeList)}{" "}
                        minuto(s)
                      </Card.Header>
                      <Card.Body>
                        <Card.Title>
                          {questionList.map((question, index) =>
                            index ===
                            timeList.indexOf(Math.max(...timeList).toString())
                              ? question.title
                              : ""
                          )}
                        </Card.Title>
                        <Card.Text>
                          {questionList.map((question, index) =>
                            index ===
                            timeList.indexOf(Math.max(...timeList).toString())
                              ? question.description
                              : ""
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <br></br>
                    <Card>
                      <Card.Header>
                        Questão mais rápida - {Math.min(...timeList)} minuto(s)
                      </Card.Header>
                      <Card.Body>
                        <Card.Title>
                          {questionList.map((question, index) =>
                            index ===
                            timeList.indexOf(Math.min(...timeList).toString())
                              ? question.title
                              : ""
                          )}
                        </Card.Title>
                        <Card.Text>
                          {questionList.map((question, index) =>
                            index ===
                            timeList.indexOf(Math.min(...timeList).toString())
                              ? question.description
                              : ""
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <br></br>
                    <Card>
                      <Card.Header>
                        {console.log(compList)}
                        Questão com menos compilações -{" "}
                        {Math.min(
                          ...compList.filter((c) => typeof c === "number")
                        )}{" "}
                        compilações
                      </Card.Header>
                      <Card.Body>
                        <Card.Title>
                          {questionList.map((question, index) =>
                            index ===
                            compList.indexOf(
                              Math.min(
                                ...compList.filter((c) => typeof c === "number")
                              )
                            )
                              ? question.title
                              : ""
                          )}
                        </Card.Title>
                        <Card.Text>
                          {questionList.map((question, index) =>
                            index ===
                            compList.indexOf(
                              Math.min(
                                ...compList.filter((c) => typeof c === "number")
                              )
                            )
                              ? question.description
                              : ""
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <br></br>
                    <Card>
                      <Card.Header>
                        Questão com mais compilações - {Math.max(...compList)}{" "}
                        compilações
                      </Card.Header>
                      <Card.Body>
                        <Card.Title>
                          {questionList.map((question, index) =>
                            index === compList.indexOf(Math.max(...compList))
                              ? question.title
                              : ""
                          )}
                        </Card.Title>
                        <Card.Text>
                          {questionList.map((question, index) =>
                            index === compList.indexOf(Math.max(...compList))
                              ? question.description
                              : ""
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Tab>
                <Tab eventKey="diario" title="Diário de Classe">
                  <br></br>
                </Tab>
              </Tabs>
            )}
          </Col>
        </Row>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>Por favor, aguarde.</Modal.Title>
        </Modal.Header>
        <Modal.Body>Carregando Prova...</Modal.Body>
      </Modal>
    </>
  );
}

export default PosProva;
