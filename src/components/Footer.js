import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer id="page-footer">
      <Container fluid>
        <Row>
          <Col sm={9}></Col>
          <Col sm={3}>
          <img 
            className="site-logo-footer float-right" 
            src="https://moodle.tuni.fi/theme/image.php/maisteriboostsubtheme/theme/1631138999/logo_footer" 
            alt="Tampereen yliopisto" 
            title="Tampereen yliopisto" />
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
