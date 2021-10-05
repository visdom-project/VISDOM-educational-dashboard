/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

const ConfigDialog = ({ title, children, openDialog, setOpenDialog }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () =>
  {
    setOpen(true);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenDialog(false);
  };
  useEffect(() => {
      setOpen(openDialog);
  }, [openDialog]);
  return (
    <div>
      {/* <Button variant="outline-primary" onClick={handleClickOpen}>
        {title.button}
      </Button> */}
      <Modal
        show={open}
        onHide={handleClose}
        size="xl"
        centered
        style={{ marginTop: "40px" }}
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
