class LightFever440 {


  constructor() {
    document.getElementById('btn-on').addEventListener('click', () => {
      AJAX.post('action', {
        action: 'ON'
      }).then(response => {
        console.log('Strip led successfuly started');
      }).catch(error => {
        console.warn('Something went wrong', status);
      });
    });

    document.getElementById('btn-off').addEventListener('click', () => {
      AJAX.post('action', {
        action: 'OFF'
      }).then(response => {
        console.log('Strip led successfuly stoped');
      }).catch(error => {
        console.warn('Something went wrong', status);
      });
    });
  }


  // ajax(options) {
  //   let xhr = new XMLHttpRequest();
  //   xhr.onreadystatechange = function() {
  //     if (this.readyState === 4 && (this.status === 200 || this.status === 204)) {
  //       if (options.hasOwnProperty('success') && typeof options.success === 'function') {
  //         const response = (this.responseText) ? JSON.parse(this.responseText) : null;
  //         options.success(response);
  //       }
  //     } else if (this.readyState === 4 && (this.status !== 200 || this.status !==  204)) {
  //       if (options.hasOwnProperty('error') && typeof options.error === 'function') {
  //         options.error(this.status);
  //       }
  //     }
  //   };
  //
  //   const type = options.type.toUpperCase();
  //   xhr.open(type, options.url, true);
  //   xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  //   xhr.setRequestHeader('Accept', 'application/json');
  //
  //   if (type === 'POST') {
  //     xhr.send(JSON.stringify(options.data));
  //   } else {
  //     xhr.send();
  //   }
  // }


}


export default LightFever440;
