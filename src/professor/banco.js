import React, { useState, useEffect, useCallback } from "react";
import Professor from "./professor";
import "../App.css";

import {
  Row,
  Col,
  ListGroup,
  Dropdown,
  Button,
  Form,
  Modal,
} from "react-bootstrap";

function Banco() {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState({ materia: "Carregando..." });
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState({ assunto: "Carregando..." });
  const [questions, setQuestions] = useState([]);
  //const [question, setQuestion] = useState({ titulo: "Carregando..." });
  const [assunto, setAssunto] = useState("");
  const [show, setShow] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [enunciado, setEnunciado] = useState("");
  const [resposta, setResposta] = useState("");
  const [change, setChange] = useState(true);

  const handleChangeQuestion = () => setChange(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getQuestions = useCallback(async (_id) => {
    const res = await fetch(`http://localhost:4000/api/topic/${_id}/questions`);
    const questions = await res.json();
    setQuestions(questions);
    if (questions[0]) {
      //setQuestion(questions[0]);
    } else {
      //setQuestion({ titulo: "Erro..." });
    }
  }, []);

  const getTopics = useCallback(
    async (_id) => {
      const res = await fetch(
        `http://localhost:4000/api/subject/${_id}/topics`
      );
      const topics = await res.json();
      setTopics(topics);
      if (topics[0]) {
        setTopic(topics[0]);
        getQuestions(topics[0].id);
      } else {
        setTopic({ assunto: "Erro ao carregar" });
      }
    },
    [getQuestions]
  );

  const newTopic = useCallback(async (_id, _newTopic) => {
    await fetch(`http://localhost:4000/api/subject/${_id}/topic/${_newTopic}`);
  }, []);

  useEffect(() => {
    const myFunction = async () => {
      const res = await fetch(`http://localhost:4000/api/subjects`);
      const subjectsArray = await res.json();
      setSubjects(subjectsArray);
      if (subjectsArray[0]) {
        setSubject(subjectsArray[0]);
        getTopics(subjectsArray[0].id);
      } else {
        setSubject({ materia: "Erro ao carregar" });
      }
    };
    myFunction();
  }, [getTopics]);

  return (
    <>
      <Professor />
      <div className="divPage">
        <Row>
          <Col className="sidebarProfessor" size="2">
            <Dropdown>
              <Dropdown.Toggle
                className="questionDropdown"
                caret="true"
                color="primary"
              >
                {subject.materia}
              </Dropdown.Toggle>
              <Dropdown.Menu className="questionDropdown" basic="true">
                {subjects ? (
                  subjects.map((_subject) => (
                    <Dropdown.Item
                      onClick={() => {
                        setSubject(_subject);
                        getTopics(_subject.id);
                      }}
                    >
                      {_subject.materia}
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
                {topic.assunto}
              </Dropdown.Toggle>
              <Dropdown.Menu className="questionDropdown" basic>
                {topics ? (
                  topics.map((_topics) => (
                    <>
                      <Dropdown.Item
                        onClick={() => {
                          setTopic(_topics);
                          getQuestions(_topics.id);
                        }}
                      >
                        {_topics.assunto}
                      </Dropdown.Item>
                    </>
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
              {questions.length > 0 ? (
                questions.map((_questions) => (
                  <>
                    <ListGroup.Item
                      action
                      onClick={() => {
                        setTitulo(_questions.titulo);
                        setEnunciado(_questions.enunciado);
                        setResposta(_questions.resposta);
                      }}
                    >
                      {_questions.titulo}
                    </ListGroup.Item>
                  </>
                ))
              ) : (
                <ListGroup.Item>Carregando...</ListGroup.Item>
              )}
            </ListGroup>
            <Button block disabled={change} variant="warning">
              Alterar
            </Button>
            <Button block variant="danger">
              Remover
            </Button>
            <Button block variant="success">
              Adicionar
            </Button>
          </Col>
          <Col className="centerProfessor" md="10">
            <Form>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Dificuldade</Form.Label>
                    <Form.Control as="select">
                      <option>Fácil</option>
                      <option>Médio</option>
                      <option>Difícil</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Tipo</Form.Label>
                    <Form.Control as="select">
                      <option>Discursiva</option>
                      <option>Programação</option>
                      <option>Múltipla Escolha</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label>Título</Form.Label>
                <Form.Control
                  onChange={(t) => setTitulo(t.target.value)}
                  as="textarea"
                  rows={2}
                  type="text"
                  value={titulo}
                  placeholder="Título da questão"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Enunciado</Form.Label>
                <Form.Control
                  onChange={(e) => {
                    setEnunciado(e.target.value);
                    handleChangeQuestion();
                  }}
                  value={enunciado}
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Enunciado da questão"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Resposta</Form.Label>
                <Form.Control
                  onChange={(r) => {
                    setResposta(r.target.value);
                  }}
                  value={resposta}
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Resposta da questão"
                />
              </Form.Group>
            </Form>
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
                {subject.materia}
              </Dropdown.Toggle>
              <Dropdown.Menu className="questionDropdown" basic>
                {subjects ? (
                  subjects.map((_subject) => (
                    <Dropdown.Item
                      onClick={() => {
                        setSubject(_subject);
                      }}
                    >
                      {_subject.materia}
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
                  onChange={(a) => setAssunto(a.target.value)}
                  value={assunto}
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
                newTopic(subject.id, assunto);
                getTopics(subject.id);
                setAssunto("");
              }}
            >
              Adicionar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default Banco;
