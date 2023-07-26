import React from 'react';
import SomeComponent from './SomeComponent';

/**
*
*@return {void}
*/
class App extends React.Component {
  /**
   * @return {object} a <div> containing an <h2>
   */
  render() {
    return (
      <div>
        <SomeComponent/>
      </div>
    );
  }
}
export default App;
