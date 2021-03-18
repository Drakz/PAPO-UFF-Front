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

function ProfessorPerfil() {
  //estados modal banco de questões
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //estados usados no componente
  const [testName, setTestName] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const [testValue, setTestValue] = useState([]);
  //função para a criação de uma prova
  const newTest = useCallback(async () => {
    console.log("como pode?");
    const res = await fetch(`http://localhost:4000/api/newTest`, {
      method: "POST",
      body: JSON.stringify({
        testName,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const exam = await res.json();
    questionList.map(async (question, index) => {
      const res = await fetch(`http://localhost:4000/api/addQuestion`, {
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
      fetch(`http://localhost:4000/api/newTestRel`, {
        method: "POST",
        body: JSON.stringify({
          testId: exam[0].test_id,
          questionId: examQuestion.id,
          value: question.value,
          compilation: 0,
        }),
        headers: { "Content-Type": "application/json" },
      });
      //const relation = await rel.json();
    });
    setQuestionList([]);
    setTestName("");
    console.log("prova criada com sucesso");
  }, [questionList, testName]);

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
        value: 0,
        subject: 0,
        topic: 4,
        multipleChoiceAnswer: [],
        inOutList: [],
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
          value: 0,
          subject,
          topic,
          inOutList,
          multipleChoiceAnswer,
          answer,
        },
      ]);
      handleClose();
    },
    [questionList]
  );
  //função de retorno
  return (
    <div className="questionBackground">
      <Professor />
      <Row className="justify-content-md-center">
        <Col md={{ span: 8, offset: 2 }}>
          <br></br>
          <Card>
            <Card.Body>
              <label>Nome da Prova</label>
              <InputGroup className="mb-3">
                <FormControl
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                />
              </InputGroup>
              <p className="textTestValue">Total de pontos: {testValue}</p>
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
            <Button onClick={() => newTest()}>Finalizar Prova</Button>
          </Row>
        </Col>
      </Row>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modalDatabase"
      >
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
    </div>
  );
}

export default ProfessorPerfil;
