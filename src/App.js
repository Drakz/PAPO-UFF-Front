import React from 'react';
import { BrowserRouter, Route, Switch,Redirect } from 'react-router-dom';
import './App.css';

import Login from './login';
import professorPerfil from './professor/professorPerfil';
import Aluno from './aluno';

function App(){

  return(
    <BrowserRouter>
        <div>
            <Switch>
             <Redirect exact from="/" to="/login" />
             <Redirect exact from="/professor" to="/professor/perfil" />
             <Route path="/login" component={Login} exact/>
             <Route path="/professor/perfil" component={professorPerfil} exact/>
             <Route path="/professor/bancoDeQuestoes" component={professorPerfil} exact/>
             <Route path="/professor/criarProva" component={professorPerfil} exact/>
             <Route path="/professor/aplicarProva" component={professorPerfil} exact/>
             <Route path="/aluno" component={Aluno} exact/>
           </Switch>
        </div> 
      </BrowserRouter>
  );
};

export default App;
