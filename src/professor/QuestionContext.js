import { createContext } from "react";

const QuestionContext = createContext({
  titulo: "",
  enunciado: "",
  resposta: "",
});

export default QuestionContext;
