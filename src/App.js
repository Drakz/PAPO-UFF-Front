import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import Login from './login';
import Professor from './professor';
import Aluno from './aluno';

function App(){

  return(
    <BrowserRouter>
        <div>
            <Switch>
             <Route path="/" component={Login} exact/>
             <Route path="/professor" component={Professor} exact/>
             <Route path="/aluno" component={Aluno} exact/>
           </Switch>
        </div> 
      </BrowserRouter>
  );
};

export default App;
