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
      status: document.getElementById('status-text'),
      manualButtons: {
        UNIFORM: document.getElementById('manual-uniform'),
        THEATER_CHASE: document.getElementById('manual-chase'),
        RAINBOW_CYCLE: document.getElementById('manual-rainbow'),
        THEATER_CHASE_RAINBOW: document.getElementById('manual-chase-rainbow')
      },
      autoButtons: {
        UNIFORM: document.getElementById('auto-uniform'),
        PROGRESSIVE: document.getElementById('auto-progressive'),
        PROGRESSIVE_MIRROR: document.getElementById('auto-progressive-mirror')
      },
      globalButtons: {
        STROBOSCOPE: document.getElementById('global-stroboscope')
      }
    };
    // Useful bools and variables
    this._isActive = false;
    this._isDark = true;
    this._previousEffect = null; // Used with stroboscope bypass
    // Options that are sent to /action url
    this._state = 'OFF';
    this._mode = 'MANUAL';
    this._effect = null;
    this._options = null;
    // Make UI interactive by listening to user actions
    this._initEvents();
    // Init web view from Light Fever 440 state
    this._initState();
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ------------------------------------------  UI INITIALIZATION  -----------------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


  _initEvents() {
    this._dom.toggle.addEventListener('click', this._toggleLightFever.bind(this));
    this._dom.manual.addEventListener('click', this._switchMode.bind(this));
    this._dom.analyzer.addEventListener('click', this._switchMode.bind(this));
    this._dom.themeSwitch.addEventListener('click', this._switchTheme.bind(this));

    this._dom.manualButtons.UNIFORM.addEventListener('click', this._updateEffect.bind(this));
    this._dom.manualButtons.THEATER_CHASE.addEventListener('click', this._updateEffect.bind(this));
    this._dom.manualButtons.RAINBOW_CYCLE.addEventListener('click', this._updateEffect.bind(this));
    this._dom.manualButtons.THEATER_CHASE_RAINBOW.addEventListener('click', this._updateEffect.bind(this));

    this._dom.autoButtons.UNIFORM.addEventListener('click', this._updateEffect.bind(this));
    this._dom.autoButtons.PROGRESSIVE.addEventListener('click', this._updateEffect.bind(this));
    this._dom.autoButtons.PROGRESSIVE_MIRROR.addEventListener('click', this._updateEffect.bind(this));

    this._dom.globalButtons.STROBOSCOPE.addEventListener('touchstart', this._startStroboscope.bind(this));
    this._dom.globalButtons.STROBOSCOPE.addEventListener('touchend', this._stopStroboscope.bind(this));
  }


  _initState() {
    this.getState().then(response => {
      this._dom.status.innerHTML = 'Set Light Fever 440 state';
      // No need to check for OFF, as it is by default
      if (response.state === 'ON') {
        this._isActive = true;
        this._dom.toggle.innerHTML = 'ON';
        this._dom.toggle.classList.remove('light-fever-off');
        this._dom.toggle.classList.add('light-fever-on');
      }
      // No need to check manual aswell, as it is by default
      if (response.mode === 'AUDIO_ANALYSE') {
        this._dom.manual.classList.remove('selected');
        this._dom.analyzer.classList.add('selected');
        this._dom.selection.style.left = '50%';
        this._dom.manualContainer.style.left = '-100%';
        this._dom.autoContainer.style.left = '0';
        this._mode = 'AUDIO_ANALYSE';
      }
      // Same with effect, UNIFORM is the default
      if (response.effect !== 'UNIFORM') {
        let buttons = {};
        if (this._mode === 'MANUAL') {
          buttons = this._dom.manualButtons;
        } else {
          buttons = this._dom.autoButtons;
        }
        // Unselect all buttons
        for (const [key, value] of Object.entries(buttons)) {
          buttons[key].classList.remove('selected');
        }
        // Update effect toggled
        buttons[response.effect].classList.add('selected');
        this._effect = response.effect;
      }
    }).catch(error => {
      this._dom.status.innerHTML = 'Unable to load state';
    });
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ------------------------------------------  BUTTON INTERACTION  ----------------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


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
    this.sendAction().then(() => {
      this._dom.status.innerHTML = 'Light Fever 440 started';
    }).catch(() => {
      this._dom.status.innerHTML = 'Unable to start Light Fever 440';
    });
  }


  _stopLightFever() {
    this._state = 'OFF';
    this.sendAction().then(() => {
      this._dom.status.innerHTML = 'Light Fever 440 stopped';
    }).catch(() => {
      this._dom.status.innerHTML = 'Unable to stop Light Fever 440';
    });
  }


  _switchMode(event) {
    if (event.target.dataset.manual === 'false') {
      this._dom.manual.classList.remove('selected');
      this._dom.analyzer.classList.add('selected');
      this._dom.selection.style.left = '50%';
      this._dom.manualContainer.style.left = '-100%';
      this._dom.autoContainer.style.left = '0';
      this._mode = 'AUDIO_ANALYSE';
      this._dom.status.innerHTML = 'Audio analyzer activated';
    } else {
      this._dom.analyzer.classList.remove('selected');
      this._dom.manual.classList.add('selected');
      this._dom.selection.style.left = '0';
      this._dom.manualContainer.style.left = '0';
      this._dom.autoContainer.style.left = '100%';
      this._mode = 'MANUAL';
      this._dom.status.innerHTML = 'Manual control activated';
    }
    // Update light fever script with new internals
    this.sendAction().then(() => {
      this._dom.status.innerHTML = `Switched to mode ${this._mode}`;
    }).catch(() => {
      this._dom.status.innerHTML = 'Unable to switch mode';
    });
  }


  _updateEffect(event) {
    // First we unselect all buttons
    let buttons = {};
    if (this._mode === 'MANUAL') {
      buttons = this._dom.manualButtons;
    } else {
      buttons = this._dom.autoButtons;
    }
    // Unselect all buttons
    for (const [key, value] of Object.entries(buttons)) {
      buttons[key].classList.remove('selected');
    }
    // Then use target as current selection
    event.target.classList.add('selected');
    this._effect = event.target.dataset.effect;
    this.sendAction().then(() => {
      this._dom.status.innerHTML = `Effect ${this._effect} activated`;
    }).catch(() => {
      this._dom.status.innerHTML = `Unable to set effect ${this._effect}`;
    });
  }


  _startStroboscope() {
    this._previousEffect = this._effect;
    this._dom.globalButtons.STROBOSCOPE.classList.add('selected');
    this._effect = 'STROBOSCOPE';
    this.sendAction().then(() => {
      this._dom.status.innerHTML = 'Stroboscope activated';
    }).catch(() => {
      this._dom.status.innerHTML = 'Unable to start stroboscope';
    });
  }


  _stopStroboscope() {
    this._effect = this._previousEffect;
    this._previousEffect = null;
    this._dom.globalButtons.STROBOSCOPE.classList.remove('selected');
    this.sendAction().then(() => {
      this._dom.status.innerHTML = 'Stroboscope deactivated';
    }).catch(() => {
      this._dom.status.innerHTML = 'Unable to stop stroboscope';
    });
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ------------------------------------------  FRONT ONLY METHODS  ----------------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


  _switchTheme(event) {
    if (event.target.checked === true) {
      this._isDark = false;
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      this._dom.status.innerHTML = 'Switched to light theme';
    } else {
      this._isDark = true;
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      this._dom.status.innerHTML = 'Switched to dark theme';
    }
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ------------------------------------------  SERVER CALLS UTILS  ----------------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


  getState() {
    return new Promise((resolve, reject) => {
      this.ajax('state').then(resolve).catch(reject);
    });
  }


  sendAction() {
    return new Promise((resolve, reject) => {
      this.ajax('action', {
        state: this._state,
        mode: this._mode,
        effect: this._effect,
        options: this._options
      }).then(resolve).catch(reject);
    });
  }


  ajax(url, data) {
    return new Promise((resolve, reject) => {
      const options = {
        method: data ? 'POST' : 'GET',
        headers: new Headers([['Content-Type','application/json; charset=UTF-8'],['Accept','application/json']]),
        body: JSON.stringify(data)
      };

      fetch(url, options).then(response => {
        if (response) {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(`ERROR_${response.status}`);
          }
        } else {
          reject('ERROR_MISSING_ARGUMENT');
        }
      }).catch(reject);
    });
  }


}


export default LightFever440;
