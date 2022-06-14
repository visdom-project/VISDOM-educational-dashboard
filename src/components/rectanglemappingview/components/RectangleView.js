// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import "../stylesheets/rectangleview.css";
import RectangleVisu from "./RectangleVisu";
import 'bootstrap/dist/css/bootstrap.min.css';

const RectangleView = () => {
  return (
    <div className="rectangle-view">
      <RectangleVisu />
    </div>
  );
}

export default RectangleView
