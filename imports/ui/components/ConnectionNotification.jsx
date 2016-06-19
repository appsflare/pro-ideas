import React from 'react';

const ConnectionNotification = () => {

  var notify = $.notify( '<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span><strong>  Trying to connect</strong> <br/> There seems to be a connection issue...', { type:'warning', allow_dismiss: true });
  return <span></span>
};

export default ConnectionNotification;
