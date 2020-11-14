class LightFever440 {


  constructor() {
    this._dom = {
      toggle: document.getElementById('toggle-light-fever'),
      manual: document.getElementById('manual-mode'),
      analyzer: document.getElementById('analyzer-mode'),
      selection: document.getElementById('selection-border'),
      manualContainer: document.getElementById('manual-container'),
      autoContainer: document.getElementById('auto-container'),
      themeSwitch: document.getElementById('theme-switch'),
      manualUniform: document.getElementById('manual-uniform'),
      manualStrob: document.getElementById('manual-stroboscope'),
      manualChase: document.getElementById('manual-chase'),
      manualRainbow: document.getElementById('manual-rainbow'),
      manualRainbowChase: document.getElementById('manual-chase-rainbow'),
      autoUniform: document.getElementById('auto-uniform'),
      autoProgressive: document.getElementById('auto-progressive'),
      autoProgMirror: document.getElementById('auto-progressive-mirror'),
    };

    this._isActive = false;
    this._isDark = true;
    // TODO : init with local storage values
    this._state = 'OFF';
    this._mode = 'MANUAL';
    this._effect = null;
    this._options = null;
    // Make UI interactive by listening to user actions
    this._events();
  }


  _events() {
    this._dom.toggle.addEventListener('click', this._toggleLightFever.bind(this));
    this._dom.manual.addEventListener('click', this._switchMode.bind(this));
    this._dom.analyzer.addEventListener('click', this._switchMode.bind(this));
    this._dom.themeSwitch.addEventListener('click', this._switchTheme.bind(this));

    this._dom.manualUniform.addEventListener('click', this._updateEffect.bind(this));
    this._dom.manualStrob.addEventListener('click', this._updateEffect.bind(this));
    this._dom.manualChase.addEventListener('click', this._updateEffect.bind(this));
    this._dom.manualRainbow.addEventListener('click', this._updateEffect.bind(this));
    this._dom.manualRainbowChase.addEventListener('click', this._updateEffect.bind(this));
    this._dom.autoUniform.addEventListener('click', this._updateEffect.bind(this));
    this._dom.autoProgressive.addEventListener('click', this._updateEffect.bind(this));
    this._dom.autoProgMirror.addEventListener('click', this._updateEffect.bind(this));
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
    this._state = 'ON';
    this.sendAction();
  }


  _stopLightFever() {
    this._state = 'OFF';
    this.sendAction();
  }


  _switchMode(event) {
    if (event.target.dataset.manual === 'false') {
      this._dom.manual.classList.remove('selected');
      this._dom.analyzer.classList.add('selected');
      this._dom.selection.style.left = '50%';
      this._dom.manualContainer.style.left = '-100%';
      this._dom.autoContainer.style.left = '0';
      this._mode = 'AUDIO_ANALYSE';
    } else {
      this._dom.analyzer.classList.remove('selected');
      this._dom.manual.classList.add('selected');
      this._dom.selection.style.left = '0';
      this._dom.manualContainer.style.left = '0';
      this._dom.autoContainer.style.left = '100%';
      this._mode = 'MANUAL';
    }
    // Update light fever script with new internals
    this.sendAction();
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


  _updateEffect(event) {
    this._effect = event.target.dataset.effect;
    this.sendAction();
  }


  sendAction() {
    this.ajax({
      state: this._state,
      mode: this._mode,
      effect: this._effect,
      options: this._options
    }).then(response => {
      console.log(response);
    }).catch(error => {
      console.error(error);
    });
  }


  ajax(data) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        headers: new Headers([['Content-Type','application/json; charset=UTF-8'],['Accept','application/json']]),
        body: JSON.stringify(data)
      };

      fetch('action', options).then(response => {
        if (response) {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(`ERROR_${response.status}`);
          }
        } else {
          reject('ERROR_MISSING_ARGUMENT');
        }
      });
    });
  }


}


export default LightFever440;
