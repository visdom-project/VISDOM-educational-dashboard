/* eslint-disable react/prop-types */
// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import React, { useState } from "react";

import { Button, Modal } from "react-bootstrap";

const ConfigDialog = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Button 
        variant="outline-primary" 
        onClick={handleClickOpen}
        style={{ marginLeft: "3em" }}
      >
        {title.button}
      </Button>
      <Modal
        show={open}
        onHide={handleClose}
        size="lg"
        centered
      >
        <Modal.Header>
          <Modal.Title  id="alert-dialog-title">
            {title.dialog}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-success" onClick={handleClose}>
            {title.confirm}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ConfigDialog;
