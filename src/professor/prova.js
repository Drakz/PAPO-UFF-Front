import React, { useState, useCallback } from "react";
import Professor from "./professor";
import Banco from "./banco";
import "../App.css";
import {
  Row,
  Col,
  Card,
  Accordion,
  Button,
  InputGroup,
  FormControl,
  Modal,
} from "react-bootstrap";
import QuestionForm from "../questionForm";
import QuestionContext from "./QuestionContext";

import { useHistory } from "react-router-dom";

function ComponenteDoRafael({
  question: {
    title,
    description,
    answer,
    type,
    difficulty,
    value,
    subject,
    topic,
    inOutList,
    multipleChoiceAnswer,
    compilation,
  },
  questionList,
  setQuestionList,
  index,
}) {
  const doRemoveQuestion = useCallback(() => {
    setQuestionList((questionList) => {
      const [...questionListAux] = questionList; // Não mute o original (estado react), faça uma cópia antes
      questionListAux.splice(index, 1); // countToRemove pode ser 1
      return questionListAux; // Retorna a cópia mutada (com um elemento removido)
    });
  }, [setQuestionList, index]);

  const setTitle = useCallback(
    (title) => {
      setQuestionList((questionList) => {
        const questionListAux = [...questionList];
        questionListAux[index].title = title;
        return questionListAux;
      });
    },
    [setQuestionList, index]
  );
  const setDescription = useCallback(
    (description) => {
      setQuestionList((questionList) => {
        const questionListAux = [...questionList];
        questionListAux[index].description = description;
        return questionListAux;
      });
    },
    [setQuestionList, index]
  );
  const setAnswer = useCallback(
    (answer) => {
      setQuestionList((questionList) => {
        const questionListAux = [...questionList];
        questionListAux[index].answer = answer;
        return questionListAux;
      });
    },
    [setQuestionList, index]
  );
  const setType = useCallback(
    (type) => {
      setQuestionList((questionList) => {
        const questionListAux = [...questionList];
        questionListAux[index].type = parseInt(type);
        return questionListAux;
      });
    },
    [setQuestionList, index]
  );
  const setDifficulty = useCallback(
    (difficulty) => {
      setQuestionList((questionList) => {
        const questionListAux = [...questionList];
        questionListAux[index].difficulty = difficulty;
        return questionListAux;
      });
    },
    [setQuestionList, index]
  );
  const setValue = useCallback(
    (value) => {
      setQuestionList((questionList) => {
        const questionListAux = [...questionList];
        questionListAux[index].value = value;
        return questionListAux;
      });
    },
    [setQuestionList, index]
  );
  const setCompilation = useCallback(
    (compilation) => {
      setQuestionList((questionList) => {
        const questionListAux = [...questionList];
        questionListAux[index].compilation = compilation;
        return questionListAux;
      });
    },
    [setQuestionList, index]
  );
  const setSubject = useCallback(
    (subject) => {
      setQuestionList((questionList) => {
        const questionListAux = [...questionList];
        questionListAux[index].subject = subject;
        return questionListAux;
      });
    },
    [setQuestionList, index]
  );
  const setTopic = useCallback(
    (topic) => {
      setQuestionList((questionList) => {
        const questionListAux = [...questionList];
        questionListAux[index].topic = topic;
        return questionListAux;
      });
    },
    [setQuestionList, index]
  );
  const setInOutList = useCallback(
    (inOutList) => {
      setQuestionList((questionList) => {
        const questionListAux = [...questionList];
        questionListAux[index].inOutList = inOutList;
        return questionListAux;
      });
    },
    [setQuestionList, index]
  );
  const setMultipleChoiceAnswer = useCallback(
    (multipleChoiceAnswer) => {
      setQuestionList((questionList) => {
        const questionListAux = [...questionList];
        questionListAux[index].multipleChoiceAnswer = multipleChoiceAnswer;
        return questionListAux;
      });
    },
    [setQuestionList, index]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <QuestionContext.Provider
      key={index}
      value={{
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
        inOutList,
        setInOutList,
        multipleChoiceAnswer,
        setMultipleChoiceAnswer,
        compilation,
        setCompilation,
      }}
    >
      <div key={index} style={{ marginBottom: 5 }}>
        <Card
          key={index}
          border={currentIndex === index ? "primary" : "secondary"}
        >
          <Accordion.Toggle
            key={index}
            as={Card.Header}
            eventKey={index + 1}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setCurrentIndex(index);
            }}
          >
            {title === ""
              ? "Nova Questão - " + value + " pontos"
              : title + " - " + value + " pontos"}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={index + 1}>
            <Card.Body key={index}>
              <QuestionForm editable={true} deletable={true}></QuestionForm>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </div>
    </QuestionContext.Provider>
  );
}

function QuestionList({
  questionList,
  setQuestionList,
  setTestValue,
  testValue,
}) {
  return (
    <>
      {questionList.map((question, index) => (
        <ComponenteDoRafael
          question={question}
          questionList={questionList}
          setQuestionList={setQuestionList}
          index={index}
        />
      ))}
    </>
  );
}

function ProvaProfessor() {
  const history = useHistory();
  //estados modal banco de questões
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showTestName, setShowTestName] = useState(false);
  const handleCloseTestName = () => setShowTestName(false);
  const handleShowTestName = () => setShowTestName(true);
  const [showSize, setShowSize] = useState(false);
  const handleCloseSize = () => setShowSize(false);
  const handleShowSize = () => setShowSize(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const handleCloseSuccess = () => setShowSuccess(false);
  const handleShowSuccess = () => setShowSuccess(true);
  //estados usados no componente
  const [testName, setTestName] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const [testValue, setTestValue] = useState([]);
  //função para a criação de uma prova
  const newTest = useCallback(async () => {
    const res = await fetch(`https://2724b8b49587.ngrok.io/api/newTest`, {
      method: "POST",
      body: JSON.stringify({
        testName,
        prof_id: history.location.state.prof_id,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const exam = await res.json();
    setIdTest(exam[0].test_id);
    handleShowSuccess();
    questionList.map(async (question, index) => {
      const res = await fetch(`https://2724b8b49587.ngrok.io/api/addQuestion`, {
        method: "POST",
        body: JSON.stringify({
          description: question.description,
          title: question.title,
          type: question.type,
          difficulty: question.difficulty,
          answer: question.answer,
          inOutList: question.inOutList,
          multipleChoiceAnswer: question.multipleChoiceAnswer,
          topic: question.topic,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const examQuestion = await res.json();
      fetch(`https://2724b8b49587.ngrok.io/api/newTestRel`, {
        method: "POST",
        body: JSON.stringify({
          testId: exam[0].test_id,
          questionId: examQuestion.id,
          value: question.value,
          compilation: question.compilation,
        }),
        headers: { "Content-Type": "application/json" },
      });
      //const relation = await rel.json();
    });
    setQuestionList([]);
    setTestName("");
    console.log("prova criada com sucesso");
  }, [questionList, testName, history.location.state.prof_id]);

  //função para popular a lista de questões
  const newQuestion = useCallback(() => {
    setQuestionList([
      ...questionList,
      {
        title: "",
        description: "",
        answer: "",
        type: 1,
        difficulty: 1,
        value: 10,
        subject: 0,
        topic: 4,
        multipleChoiceAnswer: [],
        inOutList: [],
        compilation: 5,
      },
    ]);
  }, [questionList]);
  //função para importar uma questão do banco de questões
  const importQuestion = useCallback(
    (
      title,
      description,
      type,
      difficulty,
      subject,
      topic,
      inOutList = [],
      multipleChoiceAnswer = [],
      answer = ""
    ) => {
      setQuestionList([
        ...questionList,
        {
          title,
          description,
          type,
          difficulty,
          value: 10,
          subject,
          topic,
          inOutList,
          multipleChoiceAnswer,
          answer,
          compilation: 5,
        },
      ]);
      handleClose();
    },
    [questionList]
  );
  const [idTest, setIdTest] = useState("");
  //função de retorno
  return (
    <div className="questionBackground">
      <Professor id={history.location.state.prof_id} />
      <Row style={{ marginTop: "6vh" }} className="justify-content-md-center">
        <Col md={{ span: 8, offset: 2 }}>
          <br></br>
          <Card>
            <Card.Body>
              <label>Nome da Prova</label>
              <InputGroup className="mb-3">
                <FormControl
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Ex.: P1 Programação 1 - 2021.1"
                />
              </InputGroup>
            </Card.Body>
          </Card>
          <br></br>
          <Accordion defaultActiveKey="1">
            <QuestionList
              questionList={questionList}
              setQuestionList={setQuestionList}
              setTestValue={setTestValue}
              testValue={testValue}
            />
          </Accordion>
        </Col>
        <Col>
          <br></br>
          <Row>
            <Button onClick={() => newQuestion()}>Nova Questão</Button>
          </Row>
          <br></br>
          <Row>
            <Button onClick={handleShow}>Banco de Questões</Button>
          </Row>
          <br></br>
          <Row>
            <Button
              onClick={() => {
                if (testName === "") {
                  handleShowTestName();
                } else if (questionList.length === 0) {
                  handleShowSize();
                } else {
                  newTest();
                }
              }}
            >
              Finalizar Prova
            </Button>
          </Row>
        </Col>
      </Row>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modalDatabase"
      >
        <Modal.Header closeButton>
          <Modal.Title>Banco de Questões</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Banco
            size={"md"}
            readOnly={true}
            modal={true}
            editable={false}
            exportable={true}
            exportFunction={importQuestion}
          ></Banco>
        </Modal.Body>
      </Modal>
      <Modal show={showTestName} onHide={handleCloseTestName}>
        <Modal.Header closeButton>
          <Modal.Title>Erro ao criar prova</Modal.Title>
        </Modal.Header>
        <Modal.Body>Você precisa adicionar um nome a sua prova.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTestName}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showSize} onHide={handleCloseSize}>
        <Modal.Header closeButton>
          <Modal.Title>Erro ao criar prova</Modal.Title>
        </Modal.Header>
        <Modal.Body>Você não pode criar um prova sem questões.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSize}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showSuccess} onHide={handleCloseSuccess}>
        <Modal.Header closeButton>
          <Modal.Title>Prova Criada Com Sucesso!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Código da prova: {idTest}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccess}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProvaProfessor;
