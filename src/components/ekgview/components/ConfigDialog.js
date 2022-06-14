// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

import {
  Button,
  Modal
} from "react-bootstrap";


/**
 *
 * @param {title} param0 title.button && title.dialog && title.confirm
 * @returns Dialog
 */
const ConfigDialog = ({ title, children, openDialog, setOpenDialog, showButton=true, additionalFooter=null }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () =>
  {
    setOpen(true);
    if (setOpenDialog) {
      setOpenDialog(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (setOpenDialog) {
      setOpenDialog(false);
    }
  };
  useEffect(() => {
    if (openDialog !== undefined){
      setOpen(openDialog);
    }
  }, [openDialog]);
  
  return  (
    <div>
      {
        showButton &&
        <Button variant="outline-primary" onClick={handleClickOpen}>
          {title.button}
        </Button>
      }
      {
        !open ? null : (
          <Modal
            show={open}
            onHide={handleClose}
            size="xl"
            centered
          >
            <Modal.Header id="alert-dialog-title">
              <Modal.Title>{title.dialog}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "500px", overflow: "scroll" }}>{children}</Modal.Body>
            <Modal.Footer>
              <Button variant="outline-success" onClick={handleClose}>
                {title.confirm}
              </Button>
              {additionalFooter}
            </Modal.Footer>
          </Modal>
        )
      }
    </div>
  );
};
export default ConfigDialog;
