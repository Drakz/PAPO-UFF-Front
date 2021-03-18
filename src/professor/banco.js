import React, { useState, useEffect, useCallback } from "react";
import QuestionForm from "../questionForm";
import Professor from "./professor";
import "../App.css";
import QuestionContext from "./QuestionContext";

import {
  Row,
  Col,
  ListGroup,
  Dropdown,
  Button,
  Form,
  Modal,
} from "react-bootstrap";

function Banco({
  size,
  editable = true,
  readOnly = true,
  modal = false,
  exportable = false,
  exportFunction,
}) {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState({ subject: "Carregando..." });
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState({ topic: "Carregando..." });
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    title: "",
    description: "",
    type: 1,
    difficulty: 1,
  });
  const [multipleChoiceAnswer, setMultipleChoiceAnswer] = useState([]);
  const [inOutList, setInOutList] = useState([]);
  const [answer, setAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(true);
  const [currentSubject, setCurrentSubject] = useState(1);
  const [currentTopic, setCurrentTopic] = useState(0);
  //modalQuestion (Should become a separated component)
  const [currentModalQuestion, setCurrentModalQuestion] = useState({
    title: "",
    description: "",
    type: 1,
    difficulty: 1,
  });
  const [multipleChoiceAnswerModal, setMultipleChoiceAnswerModal] = useState(
    []
  );
  const [inOutListModal, setInOutListModal] = useState([]);
  const [answerModal, setAnswerModal] = useState("");

  //functions to change modal form atributes (should also be in a component)
  const setTitle = (title) => {
    const aux = {
      title: title,
      description: currentModalQuestion.description,
      type: currentModalQuestion.type,
      difficulty: currentModalQuestion.difficulty,
    };
    setCurrentModalQuestion(aux);
  };
  const setDescription = (description) => {
    const aux = {
      title: currentModalQuestion.title,
      description: description,
      type: currentModalQuestion.type,
      difficulty: currentModalQuestion.difficulty,
    };
    setCurrentModalQuestion(aux);
  };
  const setType = (type) => {
    const aux = {
      title: currentModalQuestion.title,
      description: currentModalQuestion.description,
      type: parseInt(type),
      difficulty: currentModalQuestion.difficulty,
    };
    setCurrentModalQuestion(aux);
  };
  const setDifficulty = (difficulty) => {
    const aux = {
      title: currentModalQuestion.title,
      description: currentModalQuestion.description,
      type: currentModalQuestion.type,
      difficulty: parseInt(difficulty),
    };
    setCurrentModalQuestion(aux);
  };
  const clearModal = useCallback(() => {
    setCurrentModalQuestion({
      title: "",
      description: "",
      type: 1,
      difficulty: 1,
    });
    setInOutListModal([]);
    setMultipleChoiceAnswerModal([]);
    setAnswerModal("");
  }, []);
  //modal new topic
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const [topicForm, setTopicForm] = useState("");

  //modal new question
  const [modalNewQuestion, setModalNewQuestion] = useState(false);
  const handleCloseNewQuestion = () => setModalNewQuestion(false);
  const handleShowNewQuestion = () => setModalNewQuestion(true);

  //search question in database
  const getQuestion = useCallback(async (_id) => {
    const res = await fetch(`http://localhost:4000/api/questions/${_id}`);
    const question = await res.json();
    setCurrentQuestion(question[0]);
  }, []);

  const getAnswer = useCallback(
    async (_id, type) => {
      const res = await fetch(
        `http://localhost:4000/api/questions/answer/${_id}/${type}`
      );
      const answer = await res.json();
      if (type === 1) {
        setAnswer(answer[0].answer);
      } else if (type === 2) {
        setInOutList(answer);
      } else if (type === 3) {
        var aux = [...multipleChoiceAnswer];
        var corrects = [];
        answer.correct.map((correct) => {
          corrects = [...corrects, parseInt(correct.checked)];
        });
        answer.alternatives.map((alternative, index) => {
          if (corrects.includes(index)) {
            aux = [
              ...aux,
              { description: alternative.description, checked: true },
            ];
          } else {
            aux = [
              ...aux,
              { description: alternative.description, checked: false },
            ];
          }
        });
        setMultipleChoiceAnswer(aux);
      }
    },
    [multipleChoiceAnswer, setMultipleChoiceAnswer]
  );
  //modal-control function [clear all parameters]
  const clearAnswer = useCallback(() => {
    setAnswer("");
    setInOutList([]);
    setMultipleChoiceAnswer([]);
  }, [setAnswer, setInOutList, setMultipleChoiceAnswer]);
  //search questions in database based on a topic id
  const getQuestions = useCallback(async (_id) => {
    const res = await fetch(`http://localhost:4000/api/topic/${_id}/questions`);
    const questions = await res.json();
    setQuestionList(questions);
  }, []);
  //search topics in database based on a subject
  const getTopics = useCallback(
    async (_id) => {
      const res = await fetch(
        `http://localhost:4000/api/subject/${_id}/topics`
      );
      const topics = await res.json();
      setTopics(topics);
      if (topics[0]) {
        setTopic(topics[0]);
        getQuestions(topics[0].topic_id);
      } else {
        setTopic({ topic: "Erro ao carregar" });
      }
    },
    [getQuestions]
  );
  //insert a new topic in database
  const newTopic = useCallback(async (_id, _newTopic) => {
    await fetch(`http://localhost:4000/api/subject/newTopic`, {
      method: "POST",
      body: JSON.stringify({
        id: _id,
        newTopic: _newTopic,
      }),
      headers: { "Content-Type": "application/json" },
    });
  }, []);
  //insert a new question in database
  const newQuestion = useCallback(async () => {
    const res = await fetch(`http://localhost:4000/api/addQuestion`, {
      method: "POST",
      body: JSON.stringify({
        description: currentModalQuestion.description,
        title: currentModalQuestion.title,
        type: currentModalQuestion.type,
        difficulty: currentModalQuestion.difficulty,
        answer: answerModal,
        inOutList: inOutListModal,
        multipleChoiceAnswer: multipleChoiceAnswerModal,
        topic: currentTopic,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const message = await res.json();
    console.log(message);
    if (message.id > 0) {
      handleCloseNewQuestion();
      getQuestions(topic.topic_id);
    }
  }, [
    currentModalQuestion.description,
    currentModalQuestion.type,
    topic,
    currentModalQuestion.title,
    currentModalQuestion.difficulty,
    inOutListModal,
    multipleChoiceAnswerModal,
    answerModal,
    currentTopic,
    getQuestions,
  ]);

  useEffect(() => {
    const myFunction = async () => {
      const res = await fetch(`http://localhost:4000/api/subjects`);
      const subjectsArray = await res.json();
      setSubjects(subjectsArray);
      if (subjectsArray[0]) {
        setSubject(subjectsArray[0]);
        getTopics(subjectsArray[0].subject_id);
      } else {
        setSubject({ subject: "Erro ao carregar" });
      }
    };
    myFunction();
  }, [getTopics]);
  return (
    <>
      {modal === false && <Professor />}
      <div className={size === "md" ? "divPageModal" : "divPage"}>
        <Row>
          <Col
            className={
              size === "md" ? "sidebarProfessorModal" : "sidebarProfessor"
            }
          >
            <Dropdown>
              <Dropdown.Toggle
                className="questionDropdown"
                caret="true"
                color="primary"
              >
                {subject.subject}
              </Dropdown.Toggle>
              <Dropdown.Menu className="questionDropdown" basic="true">
                {subjects ? (
                  subjects.map((_subject, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => {
                        setSubject(_subject);
                        getTopics(_subject.subject_id);
                      }}
                    >
                      {_subject.subject}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item>Carregando...</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <br></br>
            <Dropdown>
              <Dropdown.Toggle
                className="questionDropdown"
                caret="true"
                color="primary"
              >
                {topic.topic}
              </Dropdown.Toggle>
              <Dropdown.Menu className="questionDropdown" basic="true">
                {topics ? (
                  topics.map((_topics, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => {
                        setTopic(_topics);
                        getQuestions(_topics.topic_id);
                      }}
                    >
                      {_topics.topic}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item>Carregando...</Dropdown.Item>
                )}
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => {
                    handleShow();
                  }}
                >
                  Novo Assunto
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <br></br>
            <ListGroup className="questionScroll" variant="flush">
              {questionList.length > 0 ? (
                questionList.map((_question, index) => (
                  <ListGroup.Item
                    key={index}
                    variant={
                      currentIndex === _question.question_id && "primary"
                    }
                    action
                    onClick={() => {
                      setCurrentIndex(_question.question_id);
                      getQuestion(_question.question_id);
                      clearAnswer();
                      getAnswer(_question.question_id, _question.type);
                    }}
                  >
                    {_question.title}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>Carregando...</ListGroup.Item>
              )}
            </ListGroup>
            {exportable === true ? (
              <Button
                block
                variant="success"
                onClick={() => {
                  console.log(currentQuestion);
                  console.log(currentQuestion.type);
                  exportFunction(
                    currentQuestion.title,
                    currentQuestion.description,
                    currentQuestion.type,
                    currentQuestion.difficulty,
                    currentSubject,
                    currentTopic,
                    inOutList,
                    multipleChoiceAnswer,
                    answer
                  );
                }}
              >
                Importar
              </Button>
            ) : (
              <Button
                block
                variant="success"
                onClick={() => {
                  handleShowNewQuestion();
                  clearModal();
                }}
              >
                Adicionar Questão Nova
              </Button>
            )}
          </Col>
          <Col className="centerProfessor" md="10">
            <QuestionContext.Provider
              value={{
                title: currentQuestion.title,
                description: currentQuestion.description,
                type: currentQuestion.type,
                difficulty: currentQuestion.difficulty,
                subject: currentSubject,
                answer: answer,
                setSubject: setCurrentSubject,
                topic: currentTopic,
                setTopic: setCurrentTopic,
                inOutList,
                setInOutList,
                multipleChoiceAnswer,
                setMultipleChoiceAnswer,
              }}
            >
              <QuestionForm key={currentQuestion.title} readOnly={readOnly} />
            </QuestionContext.Provider>
          </Col>
        </Row>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Novo Assunto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Dropdown>
              <Dropdown.Toggle
                className="questionDropdown"
                caret="true"
                color="primary"
              >
                {subject.subject}
              </Dropdown.Toggle>
              <Dropdown.Menu className="questionDropdown" basic>
                {subjects ? (
                  subjects.map((_subject, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => {
                        setSubject(_subject);
                      }}
                    >
                      {_subject.subject}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item>Carregando...</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <br></br>
            <Form>
              <Form.Group>
                <Form.Control
                  onChange={(a) => setTopicForm(a.target.value)}
                  value={topicForm}
                  type="text"
                  placeholder="Novo Assunto"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fechar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleClose();
                newTopic(subject.subject_id, topicForm);
                getTopics(subject.subject_id);
                setTopicForm("");
              }}
            >
              Adicionar
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={modalNewQuestion}
          onHide={handleCloseNewQuestion}
          dialogClassName="modalDatabase"
        >
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Questão no Banco</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <QuestionContext.Provider
              value={{
                title: currentModalQuestion.title,
                setTitle,
                description: currentModalQuestion.description,
                setDescription,
                type: currentModalQuestion.type,
                setType,
                difficulty: currentModalQuestion.difficulty,
                setDifficulty,
                subject: currentSubject,
                setSubject: setCurrentSubject,
                topic: currentTopic,
                setTopic: setCurrentTopic,
                answer: answerModal,
                setAnswer: setAnswerModal,
                inOutList: inOutListModal,
                setInOutList: setInOutListModal,
                multipleChoiceAnswer: multipleChoiceAnswerModal,
                setMultipleChoiceAnswer: setMultipleChoiceAnswerModal,
              }}
            >
              <QuestionForm editable={true} addFunction={newQuestion} />
            </QuestionContext.Provider>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Banco;
