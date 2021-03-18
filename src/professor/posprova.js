import React from "react";
import Professor from "./professor";
import "../App.css";
import { Row, Col, Card, ListGroup } from "react-bootstrap";
import Chart from "react-apexcharts";

function PosProva() {
  //função de retorno
  const tempo = {
    colors: ["#F44336", "#E91E63", "#9C27B0"],
    options: {
      label: "oi",
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Questão 1",
          "Questão 2",
          "Questão 3",
          "Questão 4",
          "Questão 5",
        ],
      },
    },
    series: [
      {
        name: "Tempo",
        data: [3, 2, 5, 12, 7],
      },
    ],
  };
  const acerto = {
    colors: ["#b84644", "#4576b5"],
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Questão 1",
          "Questão 2",
          "Questão 3",
          "Questão 4",
          "Questão 5",
        ],
      },
    },
    series: [
      {
        name: "Acertos",
        data: [3, 5, 4, 1, 5],
      },
      {
        name: "Erros",
        data: [3, 1, 2, 5, 1],
      },
    ],
  };
  return (
    <>
      <Professor />
      <div className="divPage">
        <Row>
          <Col className="sidebarProfessor">
            <ListGroup className="questionScroll" variant="flush">
              <ListGroup.Item variant="dark">
                Prova Filosofia - 2020.1
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                Lista de Alunos
              </ListGroup.Item>
              <ListGroup.Item>Cláudio</ListGroup.Item>
              <ListGroup.Item>Felipe</ListGroup.Item>
              <ListGroup.Item>Mariana</ListGroup.Item>
              <ListGroup.Item>Roberto</ListGroup.Item>
              <ListGroup.Item>Maria</ListGroup.Item>
              <ListGroup.Item>Lúcio</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col className="centerProfessor" md="10">
            <Row>
              <Col>
                <Card>
                  <Card.Header>Média de tempo por questão (minuto)</Card.Header>
                  <Card.Body>
                    <Chart
                      options={tempo.options}
                      series={tempo.series}
                      type="bar"
                      height="300"
                    />
                  </Card.Body>
                </Card>
                <br></br>
                <Card>
                  <Card.Header>Média de acertos por questão</Card.Header>
                  <Card.Body>
                    <Chart
                      options={acerto.options}
                      series={acerto.series}
                      type="bar"
                      height="300"
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Header>
                    Questão mais demorada - 12 minutos e 42 segundos
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>Questão 4</Card.Title>
                    <Card.Text>Explique o que é o amor.</Card.Text>
                    <footer className="blockquote-footer">
                      Perguntas da vida - Filosofia
                    </footer>
                  </Card.Body>
                </Card>
                <br></br>
                <Card>
                  <Card.Header>
                    Questão mais rápida - 2 minutos e 21 segundos
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>Questão 2</Card.Title>
                    <Card.Text>Biscoito ou bolacha?</Card.Text>
                    <footer className="blockquote-footer">
                      Perguntas da vida - Filosofia
                    </footer>
                  </Card.Body>
                </Card>
                <br></br>
                <Card>
                  <Card.Header>
                    Questão com menos acertos - 1 acerto
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>Questão 4</Card.Title>
                    <Card.Text>Explique o que é o amor.</Card.Text>
                    <footer className="blockquote-footer">
                      Perguntas da vida - Filosofia
                    </footer>
                  </Card.Body>
                </Card>
                <br></br>
                <Card>
                  <Card.Header>
                    Questão com mais acertos - 5 acertos
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>Questão 2</Card.Title>
                    <Card.Text>Biscoito ou bolacha?</Card.Text>
                    <footer className="blockquote-footer">
                      Perguntas da vida - Filosofia
                    </footer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default PosProva;
