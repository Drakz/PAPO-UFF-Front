import React, { useEffect, useState, useCallback } from "react";
import Professor from "./professor";
import "../App.css";
import { Row, Col, Image, Card, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function ProfessorPerfil() {
  const [testList, setTestList] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const myFunction = async () => {
      const res = await fetch(`https://951bd88b0269.ngrok.io/api/tests`, {
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

  const redirect = useCallback(
    (test_id) => {
      history.push({
        pathname: "/professor/posProva",
        state: {
          test_id: test_id,
          prof_id: history.location.state.prof_id,
        },
      });
    },
    [history]
  );

  return (
    <>
      <Professor id={history.location.state.prof_id} />
      <div className="divPage">
        <Row>
          <Col className="sidebarProfessor">
            <Image
              style={{ height: 96, width: 96 }}
              src="https://cdn2.iconfinder.com/data/icons/facebook-51/32/FACEBOOK_LINE-01-512.png"
              rounded
            />
            <h3>Professor</h3>
          </Col>
          <Col className="centerProfessor" md="10">
            {testList.map((test) => {
              return (
                <>
                  <Card style={{ margin: "12px", width: "28rem" }}>
                    <Card.Header as="h5">{test.name}</Card.Header>
                    <Card.Body>
                      Código da prova: {test.test_id}
                      <br></br>
                      <br></br>
                      <Button
                        variant="primary"
                        onClick={() => redirect(test.test_id)}
                      >
                        Correção
                      </Button>
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
