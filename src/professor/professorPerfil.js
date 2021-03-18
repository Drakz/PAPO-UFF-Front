import React, { useEffect, useState } from "react";
import Professor from "./professor";
import "../App.css";
import { Row, Col, Image, Card, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function ProfessorPerfil() {
  const [testList, setTestList] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const myFunction = async () => {
      const res = await fetch(`http://localhost:4000/api/tests`, {
        method: "POST",
        body: JSON.stringify({
          prof_id: history.location.state.prof_id,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const tests = await res.json();
      setTestList(tests);
    };
    myFunction();
  }, [history.location.state.prof_id]);
  //função de retorno

  return (
    <>
      <Professor />
      <div className="divPage">
        <Row>
          <Col className="sidebarProfessor">
            <Image
              src="http://www2.ic.uff.br/~bazilio/imagens/eu2.jpg"
              rounded
            />
            <h3>Bazílio</h3>
          </Col>
          <Col className="centerProfessor" md="10">
            {testList.map((test) => {
              console.log("oie");
              return (
                <>
                  <Card>
                    <Card.Header as="h5">{test.name}</Card.Header>
                    <Card.Body>
                      <Card.Title>Teste</Card.Title>
                      <Card.Text>Outro teste</Card.Text>
                      <Button variant="primary">Correção</Button>
                    </Card.Body>
                  </Card>
                  <br></br>
                </>
              );
            })}
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProfessorPerfil;
