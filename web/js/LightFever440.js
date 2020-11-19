import '../css/LightFever440.scss';
import ManualController from './components/ManualController.js';
import AnalyzerController from './components/AnalyzerController.js';
import ModalFactory from './components/ModalFactory.js';
import * as Utils from './components/Utils.js';


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
    /** @public
     * @member {string} - The application version number */
    this.VERSION = '0.0.1';
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
      globalButtons: { // Buttons that are available in both modes, and that overrides selected effect for given mode
        STROBOSCOPE: document.getElementById('global-stroboscope'),
        strobOpts: document.getElementById('strob-opts')
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
    this._previousEffect = null;
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
    /*  ------------------------------------------  Mode controllers  ------------------------------------------------  */
    this._mc = new ManualController();
    this._ac = new AnalyzerController();
    /*  --------------------------------------  Controller initialization  -------------------------------------------  */
    console.log(`LightFever440.js - Version ${this.VERSION}`);
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
    // Listeners for global effects
    this._dom.globalButtons.STROBOSCOPE.addEventListener('touchstart', this._startStroboscope.bind(this));
    this._dom.globalButtons.STROBOSCOPE.addEventListener('touchend', this._stopStroboscope.bind(this));
    this._dom.globalButtons.strobOpts.addEventListener('click', this._stroboscopeModal.bind(this));
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
    this._dom.version.innerHTML = this.VERSION;
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
      // Same with effect, UNIFORM is the default one for both modes
      if (response.effect !== 'UNIFORM') {
        // Select the buttons object to match the activated mode
        if (this._mode === 'MANUAL') {
          this._mc.initEffect(response.effect);
        } else {
          this._ac.initEffect(response.effect);
        }
      }
      // Save effect in local
      this._effect = response.effect;
      console.error('LightFever440 : Light system state preoperly loaded');
    }).catch(error => {
      this._dom.status.innerHTML = 'Unable to load state';
      console.error('LightFever440 : Unable to load light system state', error);
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
    this.sendAction().then(() => {
      this._dom.status.innerHTML = 'Light Fever 440 started';
      console.log('LightFever440 : Light system successfully started');
    }).catch(error => {
      this._dom.status.innerHTML = 'Unable to start Light Fever 440';
      console.error('LightFever440 : Unable to start light system', error);
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
    this.sendAction().then(() => {
      this._dom.status.innerHTML = 'Light Fever 440 stopped';
      console.log('LightFever440 : Light system successfully stopped');
    }).catch(error => {
      this._dom.status.innerHTML = 'Unable to stop Light Fever 440';
      console.error('LightFever440 : Unable to stop light system', error);
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
      this._effect = this._ac.getActiveEffect();
    } else {
      this._dom.analyzer.classList.remove('selected');
      this._dom.manual.classList.add('selected');
      this._dom.selection.style.left = '0';
      this._dom.manualContainer.style.left = '0';
      this._dom.autoContainer.style.left = '100%';
      this._mode = 'MANUAL';
      this._dom.status.innerHTML = 'Manual control activated';
      this._effect = this._mc.getActiveEffect();
    }
    // Update light fever script with new internals
    if (this._isActive === true) {
      this.sendAction().then(() => {
        this._dom.status.innerHTML = `Switched to mode ${this._mode}`;
        console.log('LightFever440 : Light system mode successfully switched');
      }).catch(error => {
        this._dom.status.innerHTML = 'Unable to switch mode';
        console.error('LightFever440 : Unable to switch the light system mode', error);
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
      this._dom.globalButtons.STROBOSCOPE.classList.add('selected');
      this._previousEffect = this._effect;
      this._effect = 'STROBOSCOPE';

      if (this._isActive === true) {
        this.sendAction().then(() => {
          this._dom.status.innerHTML = 'Stroboscope activated';
          console.log('LightFever440 : Light system stroboscope successfully started');
        }).catch(error => {
          this._dom.status.innerHTML = 'Unable to start stroboscope';
          console.error('LightFever440 : Unable to start the stroboscope effect', error);
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
  _stopStroboscope(event) {
    event.preventDefault();
    if (event.target.id === 'global-stroboscope') {
      this._dom.globalButtons.STROBOSCOPE.classList.remove('selected');
      this._effect = this._previousEffect;
      this._previousEffect = null;

      if (this._isActive === true) {
        this.sendAction().then(() => {
          this._dom.status.innerHTML = 'Stroboscope deactivated';
          console.log('LightFever440 : Light system stroboscope successfully stopped');
        }).catch(error => {
          this._dom.status.innerHTML = 'Unable to stop stroboscope';
          console.error('LightFever440 : Unable to stop the stroboscope effect', error);
        });
      }
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
      this._options = this._mc.getOptions();
    } else {
      this._options = this._ac.getOptions();
    }

    if (this._effect === 'STROBOSCOPE') {
      this._options = {
        color: Utils.hexToRgb(window.localStorage.getItem('strob-color')),
        delay: parseInt(window.localStorage.getItem('strob-delay')) || 50 // ms
      };
    }

    console.log(`LightFever440 : Mode ${this._mode}, Effect ${this._effect}, Options`, this._options);
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
  _stroboscopeModal() {
    new ModalFactory('STROBOSCOPE');
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
      Utils.ajax('state').then(resolve).catch(reject);
    });
  }


  /** @method
   * @name sendAction
   * @private
   * @memberof LightFever440
   * @description <blockquote>This method will perform a POST call to the Py web server, to update the Light Fever 440 mode, effect
   * and options, so it matches the UI state.</blockquote>
   * @returns {promise} The request <code>Promise</code>, format response as JSON on resolve, as error code string on reject **/
  sendAction() {
    return new Promise((resolve, reject) => {
      this._setOptionsForEffect(); // Always update the option object before calling <code>action</code>
      Utils.ajax('action', {
        state: this._state,
        mode: this._mode,
        effect: this._effect,
        options: this._options
      }).then(resolve).catch(reject).finally(() => { this._options = null; }); // Restore option to null after call
    });
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  --------------------------------------------  GETTER / SETTER  -----------------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


  get isActive() {
    return this._isActive;
  }


  get effect() {
    return this._effect;
  }


  set effect(effect) {
    this._effect = effect;
  }


  set status(status) {
    this._dom.status.innerHTML = status;
  }


}


window.LF440 = new LightFever440(); // Instantiate a controller here to avoid any additionnal code in HTML markup
export default LightFever440; // Default module export
