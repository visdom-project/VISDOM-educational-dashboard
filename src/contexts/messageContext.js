import React from "react";

const MessageContext = React.createContext();
const MessageDispatchContext = React.createContext();

const MessageProvider = ({ children }) => {
  const [state, dispatch] = React.useState({
    mode: null,
    instances: [],
    timescale: null,
    courseID: parseInt(process.env.REACT_APP_COURSE_ID),
    statusDialogProps: {
      studentID: "",
      courseID: parseInt(process.env.REACT_APP_COURSE_ID),
      mode: null
    },
    statusProps: {
      sortProps: {},
      displayMode: "list",
      props: {}
    }
  });

  return (
    <MessageContext.Provider value={state}>
      <MessageDispatchContext.Provider value={dispatch}>
        {children}
      </MessageDispatchContext.Provider>
    </MessageContext.Provider>
  )
}

const useMessageState = () => {
  const context = React.useContext(MessageContext);

  if (context === undefined) {
    throw new Error("useMessageState must be used within a MessageProvider");
  }
  return context;
};

const useMessageDispatch = () => {
  const context = React.useContext(MessageDispatchContext);
  if (!context) {
    throw new Error(
      "useMessageDispatch must be used within a MessageDispatchContext"
    );
  }
  return context;
};

//eslint-disable-next-line
export {
  MessageProvider,
  useMessageDispatch,
  useMessageState
}
