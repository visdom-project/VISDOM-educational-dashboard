// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

/* eslint-disable react/prop-types */
import React from "react";
import {
  Button,
  Table
} from "react-bootstrap";

const ConfigurableFieldSelector = ({ selected, setSelected, allSelections }) => {
  const unselected = allSelections.filter(selection => !selected.includes(selection));
  return (
    <Table>
      <tbody>
      {
        selected.map(selection => (
          <tr key={`unselected-${selection}`}>
            <td>{selection}</td>
            <td>
              <Button
                variant="outline-danger"
                size="lg"
                onClick={() => {
                    const newSelected = selected.filter( slc => slc !== selection);
                    setSelected(newSelected);
                }}
                style={{ justifyContent: "flex-end" }}
              >
                x 
              </Button>
            </td>
          </tr>
        ))
      }
      {
        unselected.map( selection => (
          <tr key={`unselected-${selection}`}>
            <td>{selection}</td>
            <td>
              <Button
                variant="outline-success"
                size="lg"
                onClick={() => {
                    const newSelected = [...selected, selection];
                    setSelected(newSelected);
                }}
              >
                +
              </Button>
            </td>
          </tr>
        ))
      } 
      </tbody>
    </Table>
  ); 
};

export default ConfigurableFieldSelector;