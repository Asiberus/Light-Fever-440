class LightFever440 {


  constructor() {
    this._dom = {
      toggle: document.getElementById('toggle-light-fever'),
      manual: document.getElementById('manual-mode'),
      analyzer: document.getElementById('analyzer-mode'),
      selection: document.getElementById('selection-border'),
      manualContainer: document.getElementById('manual-container'),
      autoContainer: document.getElementById('auto-container'),
      themeSwitch: document.getElementById('theme-switch')
    };

    this._isActive = false;
    this._isManual = true;
    this._isDark = true;

    this._events();
  }


  _events() {
    this._dom.toggle.addEventListener('click', this._toggleLightFever.bind(this));
    this._dom.manual.addEventListener('click', this._switchMode.bind(this));
    this._dom.analyzer.addEventListener('click', this._switchMode.bind(this));
    this._dom.themeSwitch.addEventListener('click', this._switchTheme.bind(this));
  }


  _toggleLightFever() {
    if (this._isActive === false) {
      this._isActive = true;
      this._dom.toggle.innerHTML = 'ON';
      this._dom.toggle.classList.remove('light-fever-off');
      this._dom.toggle.classList.add('light-fever-on');
      this._startLightFever();
    } else {
      this._isActive = false;
      this._dom.toggle.innerHTML = 'OFF';
      this._dom.toggle.classList.remove('light-fever-on');
      this._dom.toggle.classList.add('light-fever-off');
      this._stopLightFever();
    }
  }


  _startLightFever() {
    this.ajax({
      type: 'POST',
      url: 'action',
      data: {
        action: 'ON'
      },
      success: (response) => {
        console.log('Strip led successfuly started');
      },
      error: (status) => {
        console.warn('Something went wrong', status);
      }
    });
  }


  _stopLightFever() {
    this.ajax({
      type: 'POST',
      url: 'action',
      data: {
        action: 'OFF'
      },
      success: (response) => {
        console.log('Strip led successfuly stoped');
      },
      error: (status) => {
        console.warn('Something went wrong', status);
      }
    });
  }


  _switchMode(event) {
    if (event.target.dataset.manual === 'false') {
      this._isManual = false;
      this._dom.manual.classList.remove('selected');
      this._dom.analyzer.classList.add('selected');
      this._dom.selection.style.left = '50%';
      this._dom.manualContainer.style.left = '-100%';
      this._dom.autoContainer.style.left = '0';
    } else {
      this._isManual = true;
      this._dom.analyzer.classList.remove('selected');
      this._dom.manual.classList.add('selected');
      this._dom.selection.style.left = '0';
      this._dom.manualContainer.style.left = '0';
      this._dom.autoContainer.style.left = '100%';
    }
  }


  _switchTheme(event) {
    if (event.target.checked === true) {
      this._isDark = false;
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      this._isDark = true;
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
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
