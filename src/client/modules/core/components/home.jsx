import React from 'react';

export default class Home extends React.Component {
  
  render() {    
    return (<div className="container">
      <h1>Lot Of Ideas</h1>
      <p>
        Welcome to Mantra 0.4.2.
    </p>
      <ul>
        <li>
          Read <a target="_blank" href="https://kadirahq.github.io/mantra/">spec</a>
        </li>
        <li>
          Learn <a target="_blank" href="https://github.com/sungwoncho/mantra-cli#commands">CLI</a>
        </li>
      </ul>
    </div>);
  }
}