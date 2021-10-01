import React, { useEffect, useState } from 'react';

import StatusView from "./statusview/components/StatusView";
import ProgressView from "./progressview/components/ProgressView";
import CumulativeView from "./cumulativeview/components/CumulativeView";
import StudentView from "./studentview/components/StudentView";
import CalendarView from "./spintcalendarview/components/CalendarView";
import RadarView from "./radarview/components/RadarView";
import RectangleView from "./rectanglemappingview/components/RectangleView";
import EKGView from "./ekgview/components/EKGView";
import GroupOfVisualizations from "./GroupOfVisualizations";
import Footer from "./Footer";

import { 
  Navbar, 
  Button,
  Offcanvas,
  Nav,
  Container
} from "react-bootstrap";
import { AiOutlineMenu, AiOutlineClose, AiOutlineArrowUp } from "react-icons/ai";
import "../stylesheets/visualizationview.css";

import 'bootstrap/dist/css/bootstrap.min.css';

const VisualizationView = () => {
  const [openOffCanvas, setOpenOffCanvas] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [viewkey, setViewKey] = useState("");

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    });
  }, []);

  const viewObjectFormmat = (name, key, microfrontend, important=false) => ({ name, key, microfrontend, important });

  const VIEWS = [
    viewObjectFormmat("Status", "statusview", <StatusView />),
    viewObjectFormmat("Progress", "progressview", <ProgressView />),
    viewObjectFormmat("Cummulative", "cummulativeview", <CumulativeView />),
    viewObjectFormmat("Pulse", "studentview", <StudentView />),
    viewObjectFormmat("Sprint Calendar", "sprintcalendarview", <CalendarView />),
    viewObjectFormmat("Radar", "radarview", <RadarView />),
    viewObjectFormmat("Rectangle Mapping", "rectanglemappingview", <RectangleView />),
    viewObjectFormmat("EKG", "ekgview", <EKGView />),
    viewObjectFormmat("Group of visualization", "group", null)
  ];

  return (
    <div className="visualization-view">
      <div className="content-wrap">
        <Navbar className="visualization-navbar">
          <Button 
            variant="light" 
            onClick={() => setOpenOffCanvas(true)}
            style={{ margin: "0 30px 0 10px" }}
          >
            <AiOutlineMenu />
          </Button>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Brand href="">VISDOM</Navbar.Brand>
        </Navbar>

        <Offcanvas
          show={openOffCanvas}
          onHide={() => setOpenOffCanvas(false)}
          scroll={true}
          backdrop={true}
        >
          <Offcanvas.Header >
            <Offcanvas.Title bg="light">
              <Button 
              variant="light"
              onClick={() => setOpenOffCanvas(false)}
              style={{ margin: "0 30px 0 10px" }}
              >
                <AiOutlineClose />
              </Button>
              VISDOM
            </Offcanvas.Title>
          </Offcanvas.Header>

            <Offcanvas.Body>
              <p>Views</p>
              <div className="dropdown-divider"></div>
              <Nav
                variant="tabs"
                defaultActiveKey="/statusview" 
                className="flex-column"
                onSelect={eventKey => {
                  setOpenOffCanvas(false)
                  setViewKey(eventKey)
                }}
              >
                {VIEWS.map(v => 
                  <Nav.Link
                    key={v.key} 
                    eventKey={v.key}
                    className="view-link"
                    onClick={e => e.preventDefault()}
                  >
                    {v.name}
                  </Nav.Link>)
                }
              </Nav>
            </Offcanvas.Body>
        </Offcanvas>
          {viewkey.length > 0 
            ? viewkey === "group"
              ? <GroupOfVisualizations views={VIEWS.filter(v => v.key !== "group")} />
              : <Container className="view-container">
                {VIEWS.find(view => view.key === viewkey).microfrontend}
              </Container>
            : null
          }
      </div>
      {showButton && (
        <Button
          id="back-to-top"
          onClick={() => window.scrollTo(0,0)}
          style={{ padding: "5px 0 5px 0", display: "flex", justifyContent: "flex-end" }}
        >
          <AiOutlineArrowUp />
        </Button>
      )}
      <Footer />
    </div>
  )
}

export default VisualizationView
