import React from "react";
import Professor from "./professor";
import "../App.css";

import {
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Dropdown,
  Badge,
} from "react-bootstrap";

function SalaProva() {
  return (
    <>
      <Professor />
      <Row>
        <Col className="sidebarProfessor" size="2">
          <ListGroup className="testScroll" variant="flush">
            <ListGroup.Item variant="dark">Alunos</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col className="centerProfessor" md="10">
          <Form>
            <Form.Group>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Selecionar Prova
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">
                    Another action
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Something else
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button>Abrir Sala</Button>
              <Button>Iniciar Prova</Button>
              <Badge pill variant="danger">
                Status
              </Badge>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Example select</Form.Label>
              <Form.Control as="select">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect2">
              <Form.Label>Example multiple select</Form.Label>
              <Form.Control as="select" multiple>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
            <Form.Group>
              <Form.Label>CHAT</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                type="text"
                placeholder="Resposta da questão"
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default SalaProva;
