// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

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
