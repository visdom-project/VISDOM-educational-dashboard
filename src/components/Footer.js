// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

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
