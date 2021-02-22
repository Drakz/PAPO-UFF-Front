import React, { useContext, useState, useCallback, useEffect } from "react";
import "./App.css";
import {
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  FormControl,
  Alert,
} from "react-bootstrap";
import QuestionContext from "./professor/QuestionContext";

function QuestionForm({
  readOnly = false,
  size,
  editable,
  deletable,
  addFunction = null,
}) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    answer,
    setAnswer,
    type,
    setType,
    difficulty,
    setDifficulty,
    value,
    setValue,
    subject,
    setSubject,
    topic,
    setTopic,
    doRemoveQuestion,
    multipleChoiceAnswer,
    setMultipleChoiceAnswer,
    inOutList,
    setInOutList,
  } = useContext(QuestionContext);

  const [subjectsList, setSubjectsList] = useState([]);
  const [topicsList, setTopicsList] = useState([]);
  const [answerAtiva, setAnswerAtiva] = useState(false);
  //const [compilation, setCompilation] = useState(0);
  const [alert, setAlert] = useState(false);

  const clearAnswers = useCallback(() => {
    setInOutList([]);
    setMultipleChoiceAnswer([]);
    setAnswer("");
  }, [setAnswer, setInOutList, setMultipleChoiceAnswer]);

  const getTopics = useCallback(
    async (_id) => {
      const res = await fetch(
        `http://localhost:4000/api/subject/${_id}/topics`
      );
      const topics = await res.json();
      setTopicsList(topics);
      console.log(topics);
      if (topics[0]) {
        setTopic(topics[0].topic_id);
      } else {
        setTopic(topics[0].topic_id);
      }
      //setando o topico da questão atual pro primeiro tópico
    },
    [setTopicsList, setTopic]
  );

  useEffect(() => {
    const getSubjects = async () => {
      const res = await fetch(`http://localhost:4000/api/subjects`);
      const subjectsArray = await res.json();
      setSubjectsList(subjectsArray);
      if (subjectsArray[0]) {
        getTopics(subjectsArray[0].subject_id);
      }
    };
    getSubjects();
  }, [getTopics]);

  return (
    <Form>
      {answerAtiva === false && (
        <>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Matéria</Form.Label>
                <Form.Control as="select" value={subject} disabled={readOnly}>
                  {subjectsList.length > 0 ? (
                    subjectsList.map((_subject, index) => (
                      <option
                        value={_subject.subject_id}
                        key={index}
                        onClick={() => {
                          setSubject(_subject.subject_id);
                          getTopics(_subject.subject_id);
                        }}
                      >
                        {_subject.subject}
                      </option>
                    ))
                  ) : (
                    <option>Carregando...</option>
                  )}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Assunto</Form.Label>
                <Form.Control as="select" value={topic} disabled={readOnly}>
                  {topicsList.length > 0 ? (
                    topicsList.map((_topics, index) => (
                      <option
                        value={_topics.topic_id}
                        key={index}
                        onClick={() => {
                          setTopic(_topics.topic_id);
                        }}
                      >
                        {_topics.topic}
                      </option>
                    ))
                  ) : (
                    <option>Carregando...</option>
                  )}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  as="select"
                  value={type}
                  disabled={readOnly}
                  onChange={(e) => {
                    setType(e.target.value);
                    clearAnswers();
                  }}
                >
                  <option value={1} key="1">
                    Discursiva
                  </option>
                  <option value={2} key="2">
                    Programação
                  </option>
                  <option value={3} key="3">
                    Múltipla Escolha
                  </option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Dificuldade</Form.Label>
                <Form.Control
                  as="select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  disabled={readOnly}
                >
                  <option key="4" value={1}>
                    Fácil
                  </option>
                  <option key="5" value={2}>
                    Médio
                  </option>
                  <option key="6" value={3}>
                    Difícil
                  </option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>Título</Form.Label>
            <Form.Control
              className="fixed-textarea"
              onChange={(t) => setTitle(t.target.value)}
              as="textarea"
              rows={1}
              type="text"
              value={title}
              placeholder="Título da questão"
              disabled={readOnly}
            />
          </Form.Group>
        </>
      )}

      <Form.Group>
        <Form.Label>Enunciado</Form.Label>
        <Form.Control
          className="fixed-textarea"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          as="textarea"
          rows={3}
          type="text"
          placeholder="Enunciado da questão"
          disabled={answerAtiva || readOnly}
        />
      </Form.Group>
      {type === 1 &&
        answerAtiva === true && ( //type discursiva
          <>
            <Form.Group>
              <Form.Label>Resposta</Form.Label>
              <Form.Control
                className="fixed-textarea"
                onChange={(r) => setAnswer(r.target.value)}
                value={answer}
                as="textarea"
                rows={3}
                type="text"
                placeholder="Resposta da questão"
              />
            </Form.Group>
            <div className="dividerForm">
              <div className="buttonForm">
                <Form.Row>
                  {deletable === true && (
                    <>
                      <Col md={2}>
                        <Form.Label>Valor da questão:</Form.Label>
                      </Col>
                      <Col md={{ span: 1, offset: 0 }}>
                        <Form.Control
                          value={value}
                          onChange={(v) => setValue(v.target.value)}
                          type="number"
                          placeholder="0"
                        />
                      </Col>
                    </>
                  )}

                  <Col
                    md={
                      deletable
                        ? { span: 1, offset: 8 }
                        : { span: 4, offset: 4 }
                    }
                  >
                    <Button
                      variant="success"
                      onClick={() => {
                        setAnswerAtiva(false);
                        //if (topic === 0) {
                        //  setTopic(topicsList[0].topic_id);
                        //}
                      }}
                    >
                      Salvar
                    </Button>
                  </Col>
                </Form.Row>
              </div>
            </div>
          </>
        )}
      {type === 2 &&
        answerAtiva === true && ( //type programação
          <>
            {inOutList.length > 0 ? (
              inOutList.map((inOut, index) => {
                const setInput = (input) => {
                  const inOutListAux = [...inOutList];
                  inOutListAux[index].input = input;
                  setInOutList(inOutListAux);
                };
                const setOutput = (output) => {
                  const inOutListAux = [...inOutList];
                  inOutListAux[index].output = output;
                  setInOutList(inOutListAux);
                };
                const removeInOut = () => {
                  const [...inOutListAux] = inOutList; // Não mute o original (estado react), faça uma cópia antes
                  inOutListAux.splice(index, 1); // countToRemove pode ser 1
                  setInOutList(inOutListAux); // Retorna a cópia mutada (com um elemento removido)
                };
                return (
                  <Form.Group key={index}>
                    <InputGroup key={index} className="mb-3">
                      <InputGroup.Prepend key={index}>
                        <InputGroup.Text key={index}>Input</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        key={index}
                        value={inOut.input}
                        onChange={(i) => setInput(i.target.value)}
                      />
                      <InputGroup.Prepend key={index}>
                        <InputGroup.Text>Output</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        key={index}
                        value={inOut.output}
                        onChange={(o) => setOutput(o.target.value)}
                      />
                      <InputGroup.Prepend
                        key={index}
                        onClick={() => removeInOut()}
                        style={{ cursor: "pointer" }}
                      >
                        <InputGroup.Text key={index}>X</InputGroup.Text>
                      </InputGroup.Prepend>
                    </InputGroup>
                  </Form.Group>
                );
              })
            ) : (
              <p>Nenhum Input :(</p>
            )}
            <Row>
              <Button
                onClick={() =>
                  setInOutList([
                    ...inOutList,
                    { input: "Novo Input", output: "Novo Output" },
                  ])
                }
              >
                Novo input e output
              </Button>
              <Col>
                <Form.Group>
                  <Form.Label>Número de Compilações </Form.Label>
                  <Form.Control
                    rows={1}
                    type="number"
                    placeholder="Número de Compilações"
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="dividerForm">
              <div className="buttonForm">
                <Form.Row>
                  <Col md={2}>
                    <Form.Label>Valor da questão:</Form.Label>
                  </Col>
                  <Col md={{ span: 1, offset: 0 }}>
                    <Form.Control
                      value={value}
                      onChange={(v) => setValue(v.target.value)}
                      type="number"
                      placeholder="0"
                    />
                  </Col>
                  <Col md={{ span: 1, offset: 8 }}>
                    <Button
                      variant="success"
                      onClick={() => {
                        setAnswerAtiva(false);
                      }}
                    >
                      Salvar
                    </Button>
                  </Col>
                </Form.Row>
              </div>
            </div>
          </>
        )}
      {type === 3 &&
        answerAtiva === true && ( //type múltipla escolha
          <>
            {multipleChoiceAnswer.length > 0 ? (
              multipleChoiceAnswer.map((multipleChoice, index) => {
                const setDescription = (description) => {
                  const multipleChoiceAnswerAux = [...multipleChoiceAnswer];
                  multipleChoiceAnswerAux[index].description = description;
                  setMultipleChoiceAnswer(multipleChoiceAnswerAux);
                };
                const setChecked = () => {
                  const multipleChoiceAnswerAux = [...multipleChoiceAnswer];
                  multipleChoiceAnswerAux[
                    index
                  ].checked = !multipleChoiceAnswerAux[index].checked;
                  setMultipleChoiceAnswer(multipleChoiceAnswerAux);
                };
                return (
                  <Form.Group key={index}>
                    <InputGroup key={index}>
                      <InputGroup.Prepend key={index}>
                        <InputGroup.Checkbox
                          key={index}
                          checked={multipleChoice.checked}
                          onClick={() => setChecked()}
                        />
                      </InputGroup.Prepend>
                      <FormControl
                        key={index}
                        value={multipleChoice.description}
                        onChange={(d) => setDescription(d.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                );
              })
            ) : (
              <p>Nenhuma Alternativa :(</p>
            )}
            <div className="dividerForm">
              <div className="buttonForm">
                <Form.Row>
                  <Col md={2}>
                    <Form.Label>Valor da questão:</Form.Label>
                  </Col>
                  <Col md={{ span: 1, offset: 0 }}>
                    <Form.Control
                      value={value}
                      onChange={(v) => setValue(v.target.value)}
                      type="number"
                      placeholder="0"
                    />
                  </Col>
                  <Col md={{ span: 1, offset: 8 }}>
                    <Button
                      variant="success"
                      onClick={() => {
                        setAnswerAtiva(false);
                      }}
                    >
                      Salvar
                    </Button>
                  </Col>
                </Form.Row>
              </div>
            </div>
          </>
        )}
      {type === 3 && answerAtiva === false && (
        <>
          {multipleChoiceAnswer.length > 0 ? (
            multipleChoiceAnswer.map((multipleChoice, index) => {
              const setDescription = (description) => {
                const multipleChoiceAnswerAux = [...multipleChoiceAnswer];
                multipleChoiceAnswerAux[index].description = description;
                setMultipleChoiceAnswer(multipleChoiceAnswerAux);
              };
              const removeMultipleAnswer = () => {
                const [...multipleChoiceAnswerAux] = multipleChoiceAnswer; // Não mute o original (estado react), faça uma cópia antes
                multipleChoiceAnswerAux.splice(index, 1); // countToRemove pode ser 1
                setMultipleChoiceAnswer(multipleChoiceAnswerAux); // Retorna a cópia mutada (com um elemento removido)
              };
              return (
                <Form.Group key={index}>
                  <InputGroup>
                    <FormControl
                      disabled={readOnly}
                      value={multipleChoice.description}
                      onChange={(d) => setDescription(d.target.value)}
                    />
                    <InputGroup.Prepend
                      onClick={() => removeMultipleAnswer()}
                      style={{ cursor: "pointer" }}
                    >
                      {readOnly === false && (
                        <InputGroup.Text>X</InputGroup.Text>
                      )}
                    </InputGroup.Prepend>
                  </InputGroup>
                </Form.Group>
              );
            })
          ) : (
            <p>Nenhuma Alternativa :(</p>
          )}
          {!readOnly && (
            <Button
              variant="info"
              onClick={() =>
                setMultipleChoiceAnswer([
                  ...multipleChoiceAnswer,
                  {
                    checked: false,
                    description: "Nova Alternativa",
                  },
                ])
              }
            >
              Nova Alternativa
            </Button>
          )}
        </>
      )}
      {answerAtiva === false && (
        <>
          <p className="textAnswer">
            {answer !== "" && "Resposta correta: " + answer}
            {inOutList.length > 0 &&
              "Resposta correta: " +
                inOutList.map((inOut) => {
                  return (
                    "<Input: " +
                    inOut.input +
                    " ; Output: " +
                    inOut.output +
                    ">"
                  );
                })}
            {multipleChoiceAnswer.length > 0 &&
              multipleChoiceAnswer.map((choice, index) => {
                if (choice.checked === true && index === 0) {
                  return "Resposta Correta: " + choice.description + " ; ";
                } else {
                  return choice.description + " ; ";
                }
              })}
          </p>
          {editable === true && (
            <div className="dividerForm">
              <div className="buttonForm">
                {editable && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      variant="primary"
                      onClick={() => {
                        setAnswerAtiva(true);
                      }}
                    >
                      Editar Resposta
                    </Button>
                    {addFunction === null ? (
                      <Button
                        variant="danger"
                        onClick={() => doRemoveQuestion()}
                      >
                        Apagar
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={() => {
                          addFunction();
                          setAlert(true);
                        }}
                      >
                        Adicionar no Banco
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {alert && (
            <div style={{ marginTop: 12 }}>
              <Alert key="2" variant="danger">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  Já existe uma questão no banco com esse título ou esse
                  enunciado.
                  <Button variant="danger" onClick={() => setAlert(false)}>
                    Fechar
                  </Button>
                </div>
              </Alert>
            </div>
          )}
        </>
      )}
    </Form>
  );
}

export default QuestionForm;
