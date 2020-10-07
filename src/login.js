import React, {useState} from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Figure from 'react-bootstrap/Figure'

function Login(){
    const [loginName, setLoginName] = useState("");
    const [password, setPassword] = useState("");

    const getLogin = _ =>{
    fetch(`http://localhost:4000/api/login`,{
        method: "POST", 
        withCredentials: true,
        body: JSON.stringify({
        loginName,
        password
        }), 
        headers: {"Content-Type" : "application/json"}
    })
    .then(response => response.json())
    .then(response => setLoginName(response[0].assunto))
    .catch(err => console.error(err))
    }

    return(
        /*
        <header className="App-header">
        <h1> PAPO UFF </h1>
        <h1> {loginName} </h1>
        <h1> {password} </h1>
        <input onChange={e => setLoginName(e.target.value)} value={loginName} type='text' placeholder="Usuário" align="middle"/>
        <input onChange={e => setPassword(e.target.value)} value={password} type='password' placeholder="Senha" align="middle"/>
        <button type="button" onClick={getLogin}>Conectar</button>
        </header>*/
    
    <div className="App">
        <header className="App-header">
        <Figure>
            <Figure.Image
                width={171}
                height={180}
                alt="171x180"
                src="https://jadeferreira.com.br/img/uff.png"
            />
        </Figure>
        <Form>
            <Form.Group>
            <Form.Label>Usuário</Form.Label>
            <Form.Control onChange={e => setLoginName(e.target.value)} value={loginName} type="text" placeholder="Digite seu usuário" />
            </Form.Group>
            <Form.Group>
            <Form.Label>Senha</Form.Label>
            <Form.Control onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder="Digite sua senha" />
            </Form.Group>
            <Button variant="primary" type="button" onClick={getLogin}>
            Submit
            </Button>
        </Form>
        </header>
    </div>
    );
}

export default Login;