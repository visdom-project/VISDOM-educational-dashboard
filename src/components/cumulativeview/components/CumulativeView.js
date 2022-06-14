// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import React from "react";
import "../stylesheets/cumulativeview.css";
import CumulativeTab from "./CumulativeTab"

const cumulativeview= () => {
  return (
    <div className="cumulative-view">
      <CumulativeTab />
    </div>
  );
}

export default cumulativeview;