import React from "react";
import Professor from "./professor";
import "../App.css";
import {
  MDBRow,
  MDBContainer,
  MDBCol,
  MDBMedia,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
} from "mdbreact";

function ProfessorPerfil() {
  return (
    <div>
      <Professor />
      <MDBContainer fluid>
        <MDBRow>
          <MDBCol className="sidebarProfessor" md="2">
            <MDBMedia
              object
              src="https://mdbootstrap.com/img/Photos/Others/placeholder1.jpg"
              alt=""
            />
            <p className="d-block p-2 m-1">Nome do Professor</p>
            <p className="d-inline p-2 m-1">O</p>
            <p className="d-block p-2 m-1">Períodos</p>
          </MDBCol>
          <MDBCol className="centerProfessor" md="10">
            <h1>Turmas</h1>
            <br></br>
            <h1>2020-1</h1>
            <br></br>
            <MDBCard>
              <MDBCardHeader color="success-color">RCM0001</MDBCardHeader>
              <MDBCardBody>
                <MDBCardTitle>Física 1</MDBCardTitle>
                <MDBCardText>12 Alunos</MDBCardText>
              </MDBCardBody>
            </MDBCard>
            <br></br>
            <MDBCard>
              <MDBCardHeader color="success-color">RCM0003</MDBCardHeader>
              <MDBCardBody>
                <MDBCardTitle>Física 3</MDBCardTitle>
                <MDBCardText>22 Alunos</MDBCardText>
              </MDBCardBody>
            </MDBCard>
            <br></br>
            <h1>2019-2</h1>
            <br></br>
            <MDBCard>
              <MDBCardHeader color="success-color">RCM0002</MDBCardHeader>
              <MDBCardBody>
                <MDBCardTitle>Física 2</MDBCardTitle>
                <MDBCardText>5 Alunos</MDBCardText>
              </MDBCardBody>
            </MDBCard>
            <br></br>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default ProfessorPerfil;
