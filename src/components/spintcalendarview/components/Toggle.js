import React from "react";
import '../stylesheets/toggle.css';
import { useDispatch, useSelector } from 'react-redux'
import { toggleColorScheme } from '../reducers/colorSchemeReducer'

const Toggle = () => {

  const dispatch = useDispatch()
  const colorScheme = useSelector(state => state.colorScheme)

  const handleClick = () => dispatch(toggleColorScheme(colorScheme));

  return (
    <div id='toggle'>
      <div id='scheme-display'>
        Color Scheme: {colorScheme}
      </div><button
        onClick={handleClick}>Toggle Color Scheme
      </button>
    </div>
  );
}

export default Toggle;
