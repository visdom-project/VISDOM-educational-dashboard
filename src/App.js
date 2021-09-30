import React from 'react';

import "./App.css"

import VisualizationView from "./components/VisualizationView";

import { MessageProvider } from "./contexts/messageContext";

const App = () => {
  return (
    <div className="App">
      <MessageProvider>
        <VisualizationView />
      </MessageProvider>
    </div>
  )
}

export default App