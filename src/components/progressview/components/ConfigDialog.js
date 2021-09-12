/* eslint-disable react/prop-types */
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
