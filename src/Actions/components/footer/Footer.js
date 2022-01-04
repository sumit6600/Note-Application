import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <div>
      <footer
        style={{
          width: "100%",
          position: "relative",
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          backgroundColor: "rgb(49 , 145 ,238)",
        }}
      >
        <Container>
          <Row>
            <Col className="text-center py-3"> Copyright &copy; NOTEZIPPER</Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Footer;
