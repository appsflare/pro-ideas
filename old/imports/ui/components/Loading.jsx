import React from 'react';

const Loading = () => (
  <div className="loading-app">
    <div className="sk-cube-grid">
      {[1,2,3,4,5,6,7,8,9].map(index=><div key={'sk-cube'+index} className={"sk-cube sk-cube" + index}></div>)}    
    </div>
  </div>
);

export default Loading;
