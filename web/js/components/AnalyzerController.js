import * as Utils from './Utils.js';


class AnalyzerController {


  constructor() {
    this._dom = {
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
      }
    };

    this._initEvents();
    this._initState();
  }


  _initEvents() {
    // Listeners for auto analyse effects
    this._dom.autoButtons.UNIFORM.addEventListener('click', this._updateEffect.bind(this));
    this._dom.autoButtons.PROGRESSIVE.addEventListener('click', this._updateEffect.bind(this));
    this._dom.autoButtons.PROGRESSIVE_MIRROR.addEventListener('click', this._updateEffect.bind(this));
    this._dom.autoButtons.PULSE.addEventListener('click', this._updateEffect.bind(this));

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


  _initState() {
    rangesliderJs.create(this._dom.autoOptions.opts.lightNumber, { value: window.localStorage.getItem('auto-progressive-led') || '5' });
    rangesliderJs.create(this._dom.autoOptions.opts.maxPulse, { value: window.localStorage.getItem('auto-pusle-length') || '100' });
  }


  initEffect(effect) {
    // Unselect all buttons
    for (const [key, value] of Object.entries(this._dom.autoButtons)) {
      this._dom.autoButtons[key].classList.remove('selected');
      this._dom.autoOptions[key].style.display = 'none';
    }
    // Update effect toggled
    this._dom.autoButtons[effect].classList.add('selected');
    this._dom.autoOptions[effect].style.display = 'block';
  }


  getActiveEffect() {
    // Find selected effect in destination mode
    for (const [key, value] of Object.entries(this._dom.autoButtons)) {
      if (this._dom.autoButtons[key].classList.contains('selected')) {
        this._dom.autoOptions[key].style.display = 'block';
        return this._dom.autoButtons[key].dataset.effect;
      }
    }

    return 'UNIFORM';
  }


  getOptions() {
    let options = {};
    if (LF440.effect === 'UNIFORM') {
      options = {
        peak: document.getElementById('auto-uniform-peak-detection').checked
      };
    } else if (LF440.effect === 'PROGRESSIVE') {
      options = {
        led: this._dom.autoOptions.opts.lightNumber.value || 5,
        reverse: document.getElementById('auto-progressive-reverse').checked
      };
    } else if (LF440.effect === 'PULSE') {
      options = {
        color: Utils.hexToRgb(window.localStorage.getItem('pulse-color')),
        maxPulse: this._dom.autoOptions.opts.maxPulse.value
      };
    }

    return options;
  }


  /** @method
   * @name _updateEffect
   * @private
   * @memberof LightFever440
   * @description <blockquote>Switch the Light Fever 440 effect using the HTML data-effect set on each of the concerned buttons.
   * See <code>README.md</code> for the detailled API description.</blockquote>
   * @param {object} event - The event data (click) to retrieve the event target and update it **/
  _updateEffect(event) {
    // Unselect all buttons
    for (const [key, value] of Object.entries(this._dom.autoButtons)) {
      this._dom.autoButtons[key].classList.remove('selected');
      this._dom.autoOptions[key].style.display = 'none';
    }
    // Then use target as current selection
    event.target.classList.add('selected');
    LF440.effect = event.target.dataset.effect;
    this._dom.autoOptions[LF440.effect].style.display = 'block';

    if (LF440.isActive === true) {
      LF440.sendAction().then(() => {
        LF440.status = `Effect ${LF440.effect} activated`;
        console.log(`AnalyzerController : Successfully activate effect ${LF440.effect}`);
      }).catch(() => {
        LF440.status = `Unable to set effect ${LF440.effect}`;
        console.error(`AnalyzerController : Failed to activate effect ${LF440.effect}`);
      });
    } else {
      LF440.status = `Please start LightFever440`;
      console.error(`AnalyzerController : Failed to activate effect ${LF440.effect}, LightFever440 isn't activated`);
    }
  }


}


export default AnalyzerController;
