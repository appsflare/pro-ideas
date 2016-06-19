let notification = null

export default {
  close() {
    notification && notification.close()
  },
  notify() {
    this.close();
    notification = $.notify(
      {
        icon: 'spin glyphicon glyphicon-refresh',
        title: '<strong>  Trying to connect</strong> <br/>',
        message: 'There seems to be a connection issue...'
      },
      { type: 'warning',
        animate: {
          enter: 'animated flipInX',
          exit: 'animated flipOutX'
        },
        delay: 0,
      allow_dismiss: false })
  }
}
