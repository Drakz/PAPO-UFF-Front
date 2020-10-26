import React, { useState, useCallback } from "react";
import Professor from "./professor";
import "../App.css";

import { Row, Col, Form, Button, ListGroup } from "react-bootstrap";

function ProvaProfessor() {
  const [questionList, setQuestionList] = useState([]);
  const [title, setTitle] = useState("");
  const [enunciado, setEnunciado] = useState("");
  const [answer, setAnswer] = useState("");
  const [lastIndex, setLastIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [index, setIndex] = useState(1);
  const [tipo, setTipo] = useState(1);

  const handleClick = useCallback(() => {
    setQuestionList([
      ...questionList,
      {
        id: index,
        titulo: "",
        enunciado: "",
        resposta: "",
        dificuldade: "",
        tipo: "",
      },
    ]);
    setIndex(index + 1);
  }, [questionList, index]);

  return (
    <>
      <Professor />
      <div className="divPage">
        <Row>
          <Col className="sidebarProfessor" size="2">
            <ListGroup className="testScroll" variant="flush">
              <ListGroup.Item variant="dark">Questões</ListGroup.Item>
              {questionList.length > 0 ? (
                questionList.map((_questions) => (
                  <ListGroup.Item
                    active={currentIndex === _questions.id ? true : false}
                    action="true"
                    onClick={() => {
                      //salvar a questão anterior
                      questionList[lastIndex].titulo = title;
                      questionList[lastIndex].enunciado = enunciado;
                      questionList[lastIndex].resposta = answer;
                      //mostrar na tela a questão atual
                      setTitle(questionList[_questions.id - 1].titulo);
                      setEnunciado(questionList[_questions.id - 1].enunciado);
                      setAnswer(questionList[_questions.id - 1].resposta);
                      setLastIndex(_questions.id - 1);
                      setCurrentIndex(_questions.id);
                    }}
                  >{`Questão ${_questions.id}`}</ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>Não tem questão</ListGroup.Item>
              )}
            </ListGroup>
            <br></br>
            <Row>
              <Col>
                <Button
                  block
                  variant="danger"
                  onClick={() => {
                    const [...arrayCopy] = questionList; // Não mute o original (estado react), faça uma cópia antes
                    arrayCopy.splice(questionList.length - 1, 1); // countToRemove pode ser 1
                    setQuestionList(arrayCopy);
                  }}
                >
                  -
                </Button>
              </Col>
              <Col>
                <Button block variant="success" onClick={handleClick}>
                  +
                </Button>
              </Col>
            </Row>
            <br></br>
            <Button block="true" variant="info">
              Buscar no banco de questões
            </Button>
            <br></br>
            <Button block="true" variant="info">
              Finalizar Prova
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
                      <option
                        onClick={() => {
                          setTipo(1);
                        }}
                      >
                        Discursiva
                      </option>
                      <option
                        onClick={() => {
                          setTipo(2);
                        }}
                      >
                        Programação
                      </option>
                      <option>Múltipla Escolha</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label>Título</Form.Label>
                <Form.Control
                  onChange={(t) => {
                    setTitle(t.target.value);
                  }}
                  value={title}
                  as="textarea"
                  rows={2}
                  type="text"
                  placeholder="Título da questão"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Enunciado</Form.Label>
                <Form.Control
                  onChange={(e) => {
                    setEnunciado(e.target.value);
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
                  onChange={(a) => {
                    setAnswer(a.target.value);
                  }}
                  value={answer}
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Resposta da questão"
                />
              </Form.Group>
              {tipo === 2 && ( //tipo programação
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    type="text"
                    placeholder="Número de Compilações"
                  />
                </Form.Group>
              )}
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProvaProfessor;
