class LightFever440 {


  constructor() {

  }


  ajax(options) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState === 4 && (this.status === 200 || this.status === 204)) {
        if (options.hasOwnProperty('success') && typeof options.success === 'function') {
          const response = (this.responseText) ? JSON.parse(this.responseText) : null;
          options.success(response);
        }
      } else if (this.readyState === 4 && (this.status !== 200 || this.status !==  204)) {
        if (options.hasOwnProperty('error') && typeof options.error === 'function') {
          options.error(this.status);
        }
      }
    };

    const type = options.type.toUpperCase();
    xhr.open(type, options.url, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.setRequestHeader('Accept', 'application/json');

    if (type === 'POST') {
      xhr.send(JSON.stringify(options.data));
    } else {
      xhr.send();
    }
  }


}


export default LightFever440;
