import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Figure from "react-bootstrap/Figure";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";

function Login() {
  const history = useHistory();
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");

  const getLogin = (_) => {
    fetch(`http://localhost:4000/api/login`, {
      method: "POST",
      withCredentials: true,
      body: JSON.stringify({
        loginName,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response.url);
        history.push({
          pathname: response.url,
          state: {
            id: 1,
            prof_id: 2,
          },
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div id="#login" className="App">
      <header className="App-header">
        <Container>
          <Row>
            <Col>
              <h1>
                PAPO <span>UFF</span>
              </h1>
              <h2>Plataforma de Aplicacação de Provas Online</h2>
            </Col>
            <Col>
              <Card border="primary" bg="light" body="false">
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
                    <Form.Control
                      onChange={(e) => setLoginName(e.target.value)}
                      value={loginName}
                      type="text"
                      placeholder="Digite seu usuário"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      type="password"
                      placeholder="Digite sua senha"
                    />
                  </Form.Group>
                  <Button variant="primary" type="button" onClick={getLogin}>
                    Entrar
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </header>
    </div>
  );
}

export default Login;
