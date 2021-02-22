import React, { useState } from "react";
import QuestionForm from "../questionForm";
import QuestionContext from "./QuestionContext";
import { Modal } from "react-bootstrap";

function QuestionModal({ state, handleCloseNewQuestion, modalNewQuestion }) {
  const [question, setQuestion] = useState({
    title: "",
    description: "",
    type: 0,
    difficulty: 0,
    topic: 0,
  });
  const [inOutList, setInOutList] = useState([]);
  const [multipleChoiceAnswer, setMultipleChoiceAnswer] = useState([]);
  const [subject, setSubject] = useState(1);

  return (
    <Modal
      show={modalNewQuestion}
      onHide={() => handleCloseNewQuestion(false)}
      dialogClassName="modalDatabase"
    >
      <Modal.Header closeButton>
        <Modal.Title>Adicionar Questão no Banco</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <QuestionContext.Provider
          value={{
            title: question.title,
            description: question.description,
            type: question.type,
            difficulty: question.difficulty,
            subject,
            topic: question.topic,
            inOutList,
            setInOutList,
            multipleChoiceAnswer,
            setMultipleChoiceAnswer,
          }}
        >
          <QuestionForm editable={true} />
        </QuestionContext.Provider>
      </Modal.Body>
    </Modal>
  );
}

export default QuestionModal;
