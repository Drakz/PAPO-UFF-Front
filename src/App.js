import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";

import Login from "./login";
import ProfessorPerfil from "./professor/professorPerfil";
import Banco from "./professor/banco";
import ProvaProfessor from "./professor/prova";
import PosProva from "./professor/posprova";
import ProvaAluno from "./aluno/prova";
import Aluno from "./aluno/aluno";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from="/" to="/login" />
        <Redirect exact from="/professor" to="/professor/perfil" />
        <Route path="/login" component={Login} exact />
        <Route
          path="/professor/perfil"
          component={() => <ProfessorPerfil />}
          exact="true"
        ></Route>
        <Route path="/professor/bancoDeQuestoes" component={Banco} exact />
        <Route path="/professor/criarProva" component={ProvaProfessor} exact />
        <Route path="/professor/posProva" component={PosProva} exact />
        <Route path="/aluno" component={Aluno} exact />
        <Route path="/aluno/prova" component={ProvaAluno} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
