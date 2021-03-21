import React, { useEffect, useState, useCallback } from "react";
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

  useEffect(() => {
    const myFunction = async () => {
      const res = await fetch(`http://localhost:4000/api/test`, {
        method: "POST",
        body: JSON.stringify({
          test_id: history.location.state.test_id,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const test = await res.json();
      setTestName(test[0].name);
      const questionListQuery = await fetch(
        `http://localhost:4000/api/professor_questions`,
        {
          method: "POST",
          body: JSON.stringify({
            test_id: history.location.state.test_id,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const questionListRes = await questionListQuery.json();
      console.log(questionListRes);
      setQuestionList(questionListRes);
      const query = await fetch(`http://localhost:4000/api/test_students`, {
        method: "POST",
        body: JSON.stringify({
          test_id: history.location.state.test_id,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const students = await query.json();
      const stringStudents = students.map((student) => {
        return student.student_id;
      });
      const queryStudent = await fetch(`http://localhost:4000/api/students`, {
        method: "POST",
        body: JSON.stringify({
          student_ids: stringStudents.toString(),
        }),
        headers: { "Content-Type": "application/json" },
      });
      const studentList = await queryStudent.json();
      setStudentList(studentList);
      const queryStudentAnswer = await fetch(
        `http://localhost:4000/api/students_answer`,
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
      setAnswerList(studentAnswers);
    };
    myFunction();
  }, [history.location.state.test_id]);

  //função de retorno
  const tempo = {
    colors: ["#F44336", "#E91E63", "#9C27B0"],
    options: {
      label: "oi",
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Questão 1",
          "Questão 2",
          "Questão 3",
          "Questão 4",
          "Questão 5",
        ],
      },
    },
    series: [
      {
        name: "Tempo",
        data: [3, 2, 5, 12, 7],
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
        categories: [
          "Questão 1",
          "Questão 2",
          "Questão 3",
          "Questão 4",
          "Questão 5",
        ],
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
  };

  const [correctsInputs, setCorrectsInputs] = useState(0);
  const [incorrectOutputs, setIncorrectOutputs] = useState("");
  const [tam, setTam] = useState(0);

  const getProgrammingFeedback = useCallback(
    (id) => {
      console.log(questionList[id].answer.length);
      setTam(() => {
        return questionList[id].answer.length;
      });
      questionList[id].answer.map(async (obj, index) => {
        const res = await fetch(`http://localhost:4000/api/execute`, {
          method: "POST",
          body: JSON.stringify({
            id: questionList[id].question_id,
            input: obj.input,
            student_id: studentList[id].student_id,
            index: index,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const outputQuery = await res.json();
        if (obj.output === outputQuery.output) {
          console.log("entrei aqui");
          setCorrectsInputs((correctsInputs) => correctsInputs + 1);
        } else {
          setIncorrectOutputs(
            (incorrectOutputs) =>
              incorrectOutputs +
              "< " +
              obj.input.toString() +
              " : " +
              outputQuery.output +
              " >"
          );
        }
      });
    },
    [questionList, studentList]
  );

  return (
    <>
      <Professor />
      <div className="divPage">
        <Row>
          <Col className="sidebarProfessor">
            <ListGroup className="questionScroll" variant="flush">
              <ListGroup.Item
                onClick={() => {
                  setGraphs(true);
                  setQuestionsDisplay(false);
                }}
                variant="dark"
              >
                {testName} - 2020.1
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                Lista de Alunos
              </ListGroup.Item>
              {studentList.map((student, index) => (
                <ListGroup.Item
                  action
                  onClick={() => {
                    setCurrentStudent(
                      answerList.filter((element) => {
                        if (element.student_id === student.student_id) {
                          return element;
                        } else {
                          return null;
                        }
                      })
                    );
                    setQuestionsDisplay(true);
                    setGraphs(false);
                    if (questionList[index].type === 2)
                      getProgrammingFeedback(index);
                  }}
                >
                  {student.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col className="centerProfessor" md="10">
            {questionsDisplay &&
              currentStudent.map((answer, index) => (
                <>
                  <Card>
                    <Card.Header>{questionList[index].title}</Card.Header>
                    <Card.Body>
                      <Form>
                        <Form.Group>
                          <Form.Label>Enunciado</Form.Label>
                          <Form.Control
                            className="fixed-textarea"
                            value={questionList[index].description}
                            as="textarea"
                            rows={3}
                            disabled={true}
                          />
                        </Form.Group>
                        {questionList[index].type === 1 && (
                          <>
                            <Form.Group>
                              <Form.Label>Gabarito</Form.Label>
                              <Form.Control
                                className="fixed-textarea"
                                value={questionList[index].answer[0].answer}
                                as="textarea"
                                rows={3}
                                disabled={true}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Feedback</Form.Label>
                              <Form.Control
                                className={
                                  parseInt(answer.answer) ===
                                  questionList[index].answer[0].answer
                                    ? "correctAnswer fixed-textarea"
                                    : "checkAnswer fixed-textarea"
                                }
                                value={
                                  parseInt(answer.answer) ===
                                  questionList[index].answer[0].answer
                                    ? "Resposta Correta!!!"
                                    : "Por favor, verificar resposta do aluno."
                                }
                                as="textarea"
                                rows={1}
                                disabled={true}
                              />
                            </Form.Group>
                          </>
                        )}
                        {questionList[index].type === 2 && (
                          <>
                            <Form.Group>
                              <Form.Label>Gabarito</Form.Label>
                              <Form.Control
                                className="fixed-textarea"
                                value={questionList[index].answer.map(
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
                        {questionList[index].type === 3 && (
                          <Form.Group>
                            <Form.Label>Gabarito</Form.Label>
                            {questionList[index].alt.map(
                              (_alt, indexInside) => {
                                return (
                                  <>
                                    <Form.Group key={index}>
                                      <InputGroup>
                                        <FormControl
                                          className={
                                            parseInt(answer.answer) ===
                                            parseInt(indexInside)
                                              ? parseInt(answer.answer) ===
                                                parseInt(
                                                  questionList[index].answer[0]
                                                    .answer
                                                )
                                                ? "correctAnswer"
                                                : "wrongAnswer"
                                              : ""
                                          }
                                          key={index}
                                          value={_alt.alternative}
                                          disabled
                                        />
                                      </InputGroup>
                                    </Form.Group>
                                  </>
                                );
                              }
                            )}
                          </Form.Group>
                        )}
                        {questionList[index].type !== 3 && (
                          <>
                            <Form.Group>
                              <Form.Label>Resposta Aluno</Form.Label>
                              <Form.Control
                                className="fixed-textarea"
                                value={answer.answer}
                                as="textarea"
                                rows={3}
                                disabled={true}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Feedback</Form.Label>
                              <Form.Control
                                value={
                                  tam === correctsInputs
                                    ? "A questão está correta!"
                                    : correctsInputs === 0
                                    ? "A questão está incorreta"
                                    : "A questão está " +
                                      (correctsInputs / tam) * 100 +
                                      "% correta. " +
                                      "Pares Input-Output Incorretos: " +
                                      incorrectOutputs
                                }
                                as="textarea"
                                rows={3}
                                disabled={true}
                              />
                            </Form.Group>
                          </>
                        )}
                      </Form>
                    </Card.Body>
                  </Card>
                  <br></br>
                </>
              ))}
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
                      <Card.Header>Média de acertos por questão</Card.Header>
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
                        Questão mais demorada - 12 minutos e 42 segundos
                      </Card.Header>
                      <Card.Body>
                        <Card.Title>Questão 4</Card.Title>
                        <Card.Text>Explique o que é o amor.</Card.Text>
                        <footer className="blockquote-footer">
                          Perguntas da vida - Filosofia
                        </footer>
                      </Card.Body>
                    </Card>
                    <br></br>
                    <Card>
                      <Card.Header>
                        Questão mais rápida - 2 minutos e 21 segundos
                      </Card.Header>
                      <Card.Body>
                        <Card.Title>Questão 2</Card.Title>
                        <Card.Text>Biscoito ou bolacha?</Card.Text>
                        <footer className="blockquote-footer">
                          Perguntas da vida - Filosofia
                        </footer>
                      </Card.Body>
                    </Card>
                    <br></br>
                    <Card>
                      <Card.Header>
                        Questão com menos acertos - 1 acerto
                      </Card.Header>
                      <Card.Body>
                        <Card.Title>Questão 4</Card.Title>
                        <Card.Text>Explique o que é o amor.</Card.Text>
                        <footer className="blockquote-footer">
                          Perguntas da vida - Filosofia
                        </footer>
                      </Card.Body>
                    </Card>
                    <br></br>
                    <Card>
                      <Card.Header>
                        Questão com mais acertos - 5 acertos
                      </Card.Header>
                      <Card.Body>
                        <Card.Title>Questão 2</Card.Title>
                        <Card.Text>Biscoito ou bolacha?</Card.Text>
                        <footer className="blockquote-footer">
                          Perguntas da vida - Filosofia
                        </footer>
                      </Card.Body>
                    </Card>
                  </Col>
                </Tab>
              </Tabs>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
}

export default PosProva;
