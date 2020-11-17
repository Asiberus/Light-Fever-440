class LightFever440 {


  /** @summary <h1>Light Fever 440 web controller</h1>
   * @author Arthur Beaulieu, Raphaël Beekmann
   * @since November 2020
   * @description <blockquote>This module is made to abstract the Light Fever 440 script hosted on the Py web server.
   * The localhost is the entrypoint for such controller. All methods described here are made to switch from exposed
   * modes, to set effect in action and to provide options for these efects. This constructor doesn't take any arguments
   * and is made to work standalone, without any external libraries or class. See the <code>README.md</code> file to know
   * how to set up this project on your Raspberry.</blockquote> */
  constructor() {
    /*  ---------------------------------------  DOM internal attributes  --------------------------------------------  */
    /** @private
     * @member {object} - All DOM elements used for interaction in the app */
    this._dom = {
      title: document.getElementById('title'),
      version: document.getElementById('version'),
      toggle: document.getElementById('toggle-light-fever'),
      manual: document.getElementById('manual-mode'),
      analyzer: document.getElementById('analyzer-mode'),
      selection: document.getElementById('selection-border'),
      manualContainer: document.getElementById('manual-container'),
      autoContainer: document.getElementById('auto-container'),
      themeSwitch: document.getElementById('theme-switch'),
      status: document.getElementById('status-text'),
      manualButtons: { // Buttons that are only available in manual mode
        UNIFORM: document.getElementById('manual-uniform'),
        CHASE: document.getElementById('manual-chase'),
        RAINBOW: document.getElementById('manual-rainbow'),
        CHASE_RAINBOW: document.getElementById('manual-chase-rainbow')
      },
      manualOptions: {
        UNIFORM: document.getElementById('manual-uniform-options'),
        CHASE: document.getElementById('manual-chase-options'),
        RAINBOW: document.getElementById('manual-rainbow-options'),
        CHASE_RAINBOW: document.getElementById('manual-chase-rainbow-options'),
        opts: {
          uniformColor: document.getElementById('manual-uniform-color'),
          chaseColor: document.getElementById('manual-chase-color')
        }
      },
      autoButtons: { // Buttons that are only available in auto analyse mode
        UNIFORM: document.getElementById('auto-uniform'),
        PROGRESSIVE: document.getElementById('auto-progressive'),
        PROGRESSIVE_MIRROR: document.getElementById('auto-progressive-mirror'),
        PULSE: document.getElementById('auto-pulse')
      },
      autoOptions: {
        UNIFORM: document.getElementById('auto-uniform-options'),
        PROGRESSIVE: document.getElementById('auto-progressive-options'),
        PROGRESSIVE_MIRROR: document.getElementById('auto-progressive-mirror-options'),
        PULSE: document.getElementById('auto-pulse-options'),
        opts: {
          lightNumber: document.getElementById('auto-progressive-led'),
          maxPulse: document.getElementById('auto-pusle-length'),
          colorPulse: document.getElementById('auto-pulse-color')
        }
      },
      globalButtons: { // Buttons that are available in both modes, and that overrides selected effect for given mode
        STROBOSCOPE: document.getElementById('global-stroboscope'),
        strobOpts: document.getElementById('strob-opts')
      },
      modal: {
        overlay: document.getElementById('modal-overlay'),
        stroboscope: {
          container: document.getElementById('stroboscope-modal'),
          delay: document.getElementById('strob-delay'),
          delayText: document.getElementById('strob-delay-value'),
          color: document.getElementById('strob-color')
        },
        colorPicker: {
          container: document.getElementById('color-picker-modal'),
        }
      }
    };
    /*  -------------------------------------  Internal usefull attributes  ------------------------------------------  */
    // Useful bools and variables
    /** @private
     * @member {boolean} - The state of Light Fever 440 (switched on/off) */
    this._isActive = false;
    /** @private
     * @member {boolean} - The UI applied theme (either light/dark), see CSS */
    this._isDark = true;
    /** @private
     * @member {object} - The previous applied effect when global effect is toggled, for proper restoration */
    this._previousEffect = null; // Used with stroboscope bypass
    /** @private
     * @member {string} - The application version number */
    this._version = '0.0.1';
    /*  ---------------------------  Ajax parametrs (send on each /action POST call)  --------------------------------  */
    /** @private
     * @member {string} - The Light Fever 440 state (either ON/OFF) */
    this._state = 'OFF';
    /** @private
     * @member {string} - The Light Fever 440 mode (either MANUAL/AUDIO_ANALYSE) */
    this._mode = 'MANUAL';
    /** @private
     * @member {string} - The Light Fever 440 effect (depends on the selected mode, see <code>README.md</code> for the detailled API) */
    this._effect = 'UNIFORM';
    /** @private
     * @member {object} - The options to apply to a given effect */
    this._options = null;
    /*  --------------------------------------  Controller initialization  -------------------------------------------  */
    // Make UI interactive by listening to user actions
    this._initEvents();
    // Init web view from Light Fever 440 state
    this._initState();
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ------------------------------------------  UI INITIALIZATION  -----------------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


  /** @method
   * @name _initEvents
   * @private
   * @memberof LightFever440
   * @description <blockquote>Subscribe to all DOM element that can interact with the web server to modify the Light Fever 440
   * state, mode, effect and options. There are also events to control the UI aspect.</blockquote> **/
  _initEvents() {
    this._dom.toggle.addEventListener('click', this._toggleLightFever.bind(this));
    this._dom.manual.addEventListener('click', this._switchMode.bind(this));
    this._dom.analyzer.addEventListener('click', this._switchMode.bind(this));
    this._dom.themeSwitch.addEventListener('click', this._switchTheme.bind(this));
    // Listeners for manual effects
    this._dom.manualButtons.UNIFORM.addEventListener('click', this._updateEffect.bind(this));
    this._dom.manualButtons.CHASE.addEventListener('click', this._updateEffect.bind(this));
    this._dom.manualButtons.RAINBOW.addEventListener('click', this._updateEffect.bind(this));
    this._dom.manualButtons.CHASE_RAINBOW.addEventListener('click', this._updateEffect.bind(this));
    // Listeners for auto analyse effects
    this._dom.autoButtons.UNIFORM.addEventListener('click', this._updateEffect.bind(this));
    this._dom.autoButtons.PROGRESSIVE.addEventListener('click', this._updateEffect.bind(this));
    this._dom.autoButtons.PROGRESSIVE_MIRROR.addEventListener('click', this._updateEffect.bind(this));
    this._dom.autoButtons.PULSE.addEventListener('click', this._updateEffect.bind(this));
    // Listeners for global effects
    this._dom.globalButtons.STROBOSCOPE.addEventListener('touchstart', this._startStroboscope.bind(this));
    this._dom.globalButtons.STROBOSCOPE.addEventListener('touchend', this._stopStroboscope.bind(this));
    this._dom.globalButtons.strobOpts.addEventListener('click', this._strobOptionsModal.bind(this));
    // Options slider etc events
    this._dom.manualOptions.opts.uniformColor.addEventListener('click', () => {
      event.preventDefault();
      this._colorPickerModal('uniform-color', color => {
        this._dom.manualOptions.opts.uniformColor.value = color
      });
    });
    this._dom.manualOptions.opts.chaseColor.addEventListener('click', () => {
      event.preventDefault();
      this._colorPickerModal('chase-color', color => {
        this._dom.manualOptions.opts.chaseColor.value = color
      });
    });
    this._dom.autoOptions.opts.lightNumber.addEventListener('input', () => {
      document.getElementById('auto-progressive-led-value').innerHTML = this._dom.autoOptions.opts.lightNumber.value;
      window.localStorage.setItem('auto-progressive-led', this._dom.autoOptions.opts.lightNumber.value);
    });
    this._dom.autoOptions.opts.maxPulse.addEventListener('input', () => {
      document.getElementById('auto-pusle-length-value').innerHTML = this._dom.autoOptions.opts.maxPulse.value;
      window.localStorage.setItem('auto-pusle-length', this._dom.autoOptions.opts.maxPulse.value);
    });
    this._dom.autoOptions.opts.colorPulse.addEventListener('click', event => {
      event.preventDefault();
      this._colorPickerModal('pulse-color', color => {
        this._dom.autoOptions.opts.colorPulse.value = color
      });
    });
  }


  /** @method
   * @name _initState
   * @private
   * @memberof LightFever440
   * @description <blockquote>Retrieve the Light Fever 440 state and apply its parameters to the UI so it matches this state.
   * This is made to update the UI if the LightFever440 was previously launched, to avoid the UI to be inconsistent.</blockquote> **/
  _initState() {
    // Apply theme if saved in local storage
    const theme = window.localStorage.getItem('theme');
    // No need to check for dark theme, as it is the default theme
    if (theme === 'light') {
      this._isDark = false;
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      this._dom.themeSwitch.checked = true;
      this._dom.status.innerHTML = 'Switched to light theme';
    }
    // Update version number
    this._dom.version.innerHTML = this._version;
    // Declare range sliders to make input range touch friendly
    rangesliderJs.create(this._dom.modal.stroboscope.delay, { value: window.localStorage.getItem('strob-delay') || '50' });
    rangesliderJs.create(this._dom.autoOptions.opts.lightNumber, { value: window.localStorage.getItem('auto-progressive-led') || '5' });
    rangesliderJs.create(this._dom.autoOptions.opts.maxPulse, { value: window.localStorage.getItem('auto-pusle-length') || '100' });
    // Perform async call to retrieve LightFever440 state
    this._getState().then(response => {
      this._dom.status.innerHTML = 'Set Light Fever 440 state';
      // No need to check for OFF, as it is the default state
      if (response.state === 'ON') {
        this._isActive = true;
        this._dom.toggle.innerHTML = 'ON';
        this._dom.toggle.classList.remove('light-fever-off');
        this._dom.toggle.classList.add('light-fever-on');
      }
      // No need to check manual aswell, as it is the default mode
      if (response.mode === 'AUDIO_ANALYSE') {
        this._dom.manual.classList.remove('selected');
        this._dom.analyzer.classList.add('selected');
        this._dom.selection.style.left = '50%';
        this._dom.manualContainer.style.left = '-100%';
        this._dom.autoContainer.style.left = '0';
        this._mode = 'AUDIO_ANALYSE';
      }
      // Same with effect, UNIFORM is the default one
      if (response.effect !== 'UNIFORM') {
        let buttons = {};
        let options = {};
        // Select the buttons object to match the activated mode
        if (this._mode === 'MANUAL') {
          buttons = this._dom.manualButtons;
          options = this._dom.manualOptions;
        } else {
          buttons = this._dom.autoButtons;
          options = this._dom.autoOptions;
        }
        // Unselect all buttons
        for (const [key, value] of Object.entries(buttons)) {
          buttons[key].classList.remove('selected');
          options[key].style.display = 'none';
        }
        // Update effect toggled
        buttons[response.effect].classList.add('selected');
        options[response.effect].style.display = 'block';
      }
      // Save effect in local
      this._effect = response.effect;
    }).catch(error => {
      this._dom.status.innerHTML = 'Unable to load state';
    });
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ------------------------------------------  BUTTON INTERACTION  ----------------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


  /** @method
   * @name _toggleLightFever
   * @private
   * @memberof LightFever440
   * @description <blockquote>Toggle the Light Fever 440 state depending on its previous state. Can be either ON or OFF.</blockquote> **/
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


  /** @method
   * @name _startLightFever
   * @private
   * @memberof LightFever440
   * @description <blockquote>Explicit method to set the Light Fever 440 state at ON.</blockquote> **/
  _startLightFever() {
    this._dom.title.classList.add('activated');
    this._dom.version.classList.add('activated');
    this._state = 'ON';
    this._sendAction().then(() => {
      this._dom.status.innerHTML = 'Light Fever 440 started';
    }).catch(() => {
      this._dom.status.innerHTML = 'Unable to start Light Fever 440';
    });
  }


  /** @method
   * @name _stopLightFever
   * @private
   * @memberof LightFever440
   * @description <blockquote>Explicit method to set the Light Fever 440 state at OFF.</blockquote> **/
  _stopLightFever() {
    this._dom.title.classList.remove('activated');
    this._dom.version.classList.remove('activated');
    this._state = 'OFF';
    this._sendAction().then(() => {
      this._dom.status.innerHTML = 'Light Fever 440 stopped';
    }).catch(() => {
      this._dom.status.innerHTML = 'Unable to stop Light Fever 440';
    });
  }


  /** @method
   * @name _switchMode
   * @private
   * @memberof LightFever440
   * @description <blockquote>Switch the Light Fever 440 in MANUAL or AUTO_ANALYSE mode and update UI accordingly.</blockquote>
   * @param {object} event - The event data (click) to retrieve the event target and update it **/
  _switchMode(event) {
    if (event.target.dataset.manual === 'false') {
      this._dom.manual.classList.remove('selected');
      this._dom.analyzer.classList.add('selected');
      this._dom.selection.style.left = '50%';
      this._dom.manualContainer.style.left = '-100%';
      this._dom.autoContainer.style.left = '0';
      this._mode = 'AUDIO_ANALYSE';
      this._dom.status.innerHTML = 'Audio analyzer activated';
      // Find selected effect in destination mode
      for (const [key, value] of Object.entries(this._dom.autoButtons)) {
        if (this._dom.autoButtons[key].classList.contains('selected')) {
          this._effect = this._dom.autoButtons[key].dataset.effect;
          this._dom.autoOptions[key].style.display = 'block';
          break;
        }
      }
    } else {
      this._dom.analyzer.classList.remove('selected');
      this._dom.manual.classList.add('selected');
      this._dom.selection.style.left = '0';
      this._dom.manualContainer.style.left = '0';
      this._dom.autoContainer.style.left = '100%';
      this._mode = 'MANUAL';
      this._dom.status.innerHTML = 'Manual control activated';
      // Find selected effect in destination mode
      for (const [key, value] of Object.entries(this._dom.manualButtons)) {
        if (this._dom.manualButtons[key].classList.contains('selected')) {
          this._effect = this._dom.manualButtons[key].dataset.effect;
          this._dom.manualOptions[key].style.display = 'block';
          break;
        }
      }
    }
    // Update light fever script with new internals
    if (this._isActive === true) {
      this._sendAction().then(() => {
        this._dom.status.innerHTML = `Switched to mode ${this._mode}`;
      }).catch(() => {
        this._dom.status.innerHTML = 'Unable to switch mode';
      });
    }
  }


  /** @method
   * @name _updateEffect
   * @private
   * @memberof LightFever440
   * @description <blockquote>Switch the Light Fever 440 effect using the HTML data-effect set on each of the concerned buttons.
   * See <code>README.md</code> for the detailled API description.</blockquote>
   * @param {object} event - The event data (click) to retrieve the event target and update it **/
  _updateEffect(event) {
    // First we unselect all buttons
    let buttons = {};
    let options = {};
    if (this._mode === 'MANUAL') {
      buttons = this._dom.manualButtons;
      options = this._dom.manualOptions;
    } else {
      buttons = this._dom.autoButtons;
      options = this._dom.autoOptions;
    }
    // Unselect all buttons
    for (const [key, value] of Object.entries(buttons)) {
      buttons[key].classList.remove('selected');
      options[key].style.display = 'none';
    }
    // Then use target as current selection
    event.target.classList.add('selected');
    this._effect = event.target.dataset.effect;
    options[this._effect].style.display = 'block';

    if (this._isActive === true) {
      this._sendAction().then(() => {
        this._dom.status.innerHTML = `Effect ${this._effect} activated`;
      }).catch(() => {
        this._dom.status.innerHTML = `Unable to set effect ${this._effect}`;
      });
    }
  }


  /** @method
   * @name _startStroboscope
   * @private
   * @memberof LightFever440
   * @description <blockquote>Explicit method to start the global stroboscope effect. It will override any selected effect and
   * will be active while the user hold the button. On release, the previous selected effect is restored.</blockquote>
   * @param {object} event - The event data (touchdown) to avoid default behavior on hold (ctx menu) **/
  _startStroboscope(event) {
    if (event.target.id === 'global-stroboscope') {
      event.preventDefault(); // Avoid context to open when keeping touch down
      this._previousEffect = this._effect;
      this._dom.globalButtons.STROBOSCOPE.classList.add('selected');
      this._effect = 'STROBOSCOPE';

      if (this._isActive === true) {
        this._sendAction().then(() => {
          this._dom.status.innerHTML = 'Stroboscope activated';
        }).catch(() => {
          this._dom.status.innerHTML = 'Unable to start stroboscope';
        });
      }
    }
  }


  /** @method
   * @name _stopStroboscope
   * @private
   * @memberof LightFever440
   * @description <blockquote>Explicit method to stop the global stroboscope effect. Called when the button is released,
   * the previous selected effect will be restored.</blockquote> **/
  _stopStroboscope() {
    this._effect = this._previousEffect;
    this._previousEffect = null;
    this._dom.globalButtons.STROBOSCOPE.classList.remove('selected');

    if (this._isActive === true) {
      this._sendAction().then(() => {
        this._dom.status.innerHTML = 'Stroboscope deactivated';
      }).catch(() => {
        this._dom.status.innerHTML = 'Unable to stop stroboscope';
      });
    }
  }


  /** @method
   * @name _setOptionsForEffect
   * @private
   * @memberof LightFever440
   * @description <blockquote>Internal method to be called before any sendAction for a given effect. It will send options that are
   * related to the selected effect, and use the inputs values that matches the effect.</blockquote> **/
  _setOptionsForEffect() {
    if (this._mode === 'MANUAL') {
      if (this._effect === 'UNIFORM') {
        this._options = {
          color: this._hexToRgb(window.localStorage.getItem('uniform-color'))
        };
      } else if (this._effect === 'CHASE') {
        this._options = {
          color: this._hexToRgb(window.localStorage.getItem('chase-color')),
          delay: 50 // ms
        };
      }
    } else {
      if (this._effect === 'UNIFORM') {
        this._options = {
          peak: document.getElementById('auto-uniform-peak-detection').checked
        };
      } else if (this._effect === 'PROGRESSIVE') {
        this._options = {
          led: this._dom.autoOptions.opts.lightNumber.value || 5,
          reverse: document.getElementById('auto-progressive-reverse').checked
        };
      } else if (this._effect === 'PULSE') {
        this._options = {
          color: this._hexToRgb(window.localStorage.getItem('pulse-color')),
          maxPulse: this._dom.autoOptions.opts.maxPulse.value
        };
      }
    }

    if (this._effect === 'STROBOSCOPE') {
      this._options = {
        color: this._hexToRgb(window.localStorage.getItem('strob-color')),
        delay: parseInt(this._dom.modal.stroboscope.delay.value) || 50 // ms
      };
    }
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ------------------------------------------  FRONT ONLY METHODS  ----------------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


  /** @method
   * @name _switchTheme
   * @private
   * @memberof LightFever440
   * @description <blockquote>Switch the UI theme between light or dark theme. Those are defined in the CSS file. This value
   * is stored in the local storage, to be restored when the user opens a new session.</blockquote>
   * @param {object} event - The event data (click) to retrieve the event target and update it **/
  _switchTheme(event) {
    if (event.target.checked === true) {
      this._isDark = false;
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      this._dom.status.innerHTML = 'Switched to light theme';
      window.localStorage.setItem('theme', 'light');
    } else {
      this._isDark = true;
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      this._dom.status.innerHTML = 'Switched to dark theme';
      window.localStorage.setItem('theme', 'dark');
    }
  }


  /** @method
   * @name _strobOptionsModal
   * @private
   * @memberof LightFever440
   * @description <blockquote>Open the stroboscope options modal and handle its interactivity (the whole lifecycle).</blockquote> **/
  _strobOptionsModal() {
    // Make modal visible
    this._dom.modal.overlay.classList.add('visible');
    this._dom.modal.stroboscope.container.classList.add('visible');
    // Update range
    let range = event => {
      this._dom.modal.stroboscope.delayText.innerHTML = event.target.value;
      window.localStorage.setItem('strob-delay', event.target.value);
    };
    // Close modal internal metohd
    let close = event => {
      if (event.target.id === 'strob-modal-close' || event.target.id === 'modal-overlay') {
        this._dom.modal.overlay.classList.remove('visible');
        this._dom.modal.stroboscope.container.classList.remove('visible');
        this._dom.modal.stroboscope.delay.removeEventListener('click', range);
        this._dom.modal.overlay.removeEventListener('click', close);
        document.getElementById('strob-modal-close').removeEventListener('click', close);
      }
    };
    // Binding now to be able to remove events properly
    range = range.bind(this);
    close = close.bind(this);

    const colorPicker = new KellyColorPicker({
      place : 'strob-color-picker',
      color : window.localStorage.getItem('strob-color') || '#ffffff',
      changeCursor: false,
      userEvents: {
        change: self => {
          const color = self.getCurColorRgb();
          window.localStorage.setItem('strob-color', self.getCurColorHex());
          document.getElementById('strob-color').value = self.getCurColorHex();
        }
      }
    });
    document.getElementById('strob-color').addEventListener('click', event => { event.preventDefault(); });
    // Event listeners for modal
    this._dom.modal.stroboscope.delay.addEventListener('input', range);
    this._dom.modal.overlay.addEventListener('click', close);
    document.getElementById('strob-modal-close').addEventListener('click', close);
  }


  _colorPickerModal(localStorageKey, callback) {
    // Make modal visible
    this._dom.modal.overlay.classList.add('visible');
    this._dom.modal.colorPicker.container.classList.add('visible');
    // Close modal internal metohd
    let close = event => {
      if (event.target.id === 'color-picker-modal-close' || event.target.id === 'modal-overlay') {
        this._dom.modal.overlay.classList.remove('visible');
        this._dom.modal.colorPicker.container.classList.remove('visible');
        this._dom.modal.overlay.removeEventListener('click', close);
        document.getElementById('color-picker-modal-close').removeEventListener('click', close);
        callback(colorPicker.getCurColorHex());
      }
    };

    close = close.bind(this);

    const colorPicker = new KellyColorPicker({
      place : 'color-picker',
      color : window.localStorage.getItem(localStorageKey) || '#ffffff',
      changeCursor: false,
      userEvents: {
        change: self => {
          const color = self.getCurColorRgb();
          window.localStorage.setItem(localStorageKey, self.getCurColorHex());
          document.getElementById('output-color').value = self.getCurColorHex();
        }
      }
    });

    this._dom.modal.overlay.addEventListener('click', close);
    document.getElementById('color-picker-modal-close').addEventListener('click', close);
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ------------------------------------------  SERVER CALLS UTILS  ----------------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


  /** @method
   * @name _getState
   * @private
   * @memberof LightFever440
   * @description <blockquote>This method will perform a GET call to the Py web server, to retrieve the activated mode, effect and
   * options, in order to initialize the UI accordingly.</blockquote>
   * @returns {promise} The request <code>Promise</code>, format response as JSON on resolve, as error code string on reject **/
  _getState() {
    return new Promise((resolve, reject) => {
      this._ajax('state').then(resolve).catch(reject);
    });
  }


  /** @method
   * @name _sendAction
   * @private
   * @memberof LightFever440
   * @description <blockquote>This method will perform a POST call to the Py web server, to update the Light Fever 440 mode, effect
   * and options, so it matches the UI state.</blockquote>
   * @returns {promise} The request <code>Promise</code>, format response as JSON on resolve, as error code string on reject **/
  _sendAction() {
    return new Promise((resolve, reject) => {
      this._setOptionsForEffect(); // Always update the option object before calling <code>action</code>
      this._ajax('action', {
        state: this._state,
        mode: this._mode,
        effect: this._effect,
        options: this._options
      }).then(resolve).catch(reject).finally(() => { this._options = null; }); // Restore option to null after call
    });
  }


  /** @method
   * @name _ajax
   * @private
   * @memberof LightFever440
   * @description <blockquote>Server call abstraction method that will dispatch a GET or a POST request to
   * the server, depending on the given parameters. It covers both the _getState and the _sendAction method.</blockquote>
   * @param {string} url - The url to reach, either <code>state</code> (GET) or <code>action</code> (POST)
   * @param {object} data - The data to attach to the <code>action</code> calls. No required for <code>state</code> call
   * @returns {promise} The request <code>Promise</code>, format response as JSON on resolve, as error code string on reject **/
  _ajax(url, data) {
    return new Promise((resolve, reject) => {
      // Prepare sent options with proper verb, headers and body (for POST only)
      const options = {
        method: data ? 'POST' : 'GET',
        headers: new Headers([['Content-Type','application/json; charset=UTF-8'],['Accept','application/json']]),
        body: JSON.stringify(data)
      };
      // Perform fetch call and handle its output
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


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ---------------------------------------------  GLOBAL UTILS  -------------------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


  /** @method
   * @name _hexToRgb
   * @private
   * @memberof LightFever440
   * @description <blockquote>Useful method to convert hexadecimal string into a RGB array of numbers.</blockquote>
   * @param {string} hex - The hexadecimal string to convert in RGB
   * @return {number[]} - The converted RGB array **/
  _hexToRgb(hex) {
    // Real MV : https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb/5624139#5624139
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [255, 255, 255];
  }


}


window.LF440 = new LightFever440(); // Instantiate a controller here to avoid any additionnal code in HTML markup
export default LightFever440; // Default module export
