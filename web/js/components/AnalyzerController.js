import * as Utils from './Utils.js';


class AnalyzerController {


  constructor() {
    this._dom = {
      UNIFORM: {
        button: document.getElementById('auto-uniform'),
        container: document.getElementById('auto-uniform-options'),
        peakDetection: document.getElementById('auto-uniform-peak-detection')
      },
      PROGRESSIVE: {
        button: document.getElementById('auto-progressive'),
        container: document.getElementById('auto-progressive-options'),
        lightNumber: document.getElementById('auto-progressive-led'),
        reverse: document.getElementById('auto-progressive-reverse'),
        lightNumberText: document.getElementById('auto-progressive-led-value')
      },
      PULSE: {
        button: document.getElementById('auto-pulse'),
        container: document.getElementById('auto-pulse-options'),
        maxLength: document.getElementById('auto-pulse-length'),
        color: document.getElementById('auto-pulse-color'),
        maxLengthText: document.getElementById('auto-pulse-length-value')
      },
      PROGRESSIVE_MIRROR: {
        button: document.getElementById('auto-progressive-mirror'),
        container: document.getElementById('auto-progressive-mirror-options')
      }
    };

    this._initEvents();
    this._initState();
  }


  _initEvents() {
    // Listeners for auto analyse effects
    this._dom.UNIFORM.button.addEventListener('click', this._updateEffect.bind(this));
    this._dom.PROGRESSIVE.button.addEventListener('click', this._updateEffect.bind(this));
    this._dom.PULSE.button.addEventListener('click', this._updateEffect.bind(this));
    this._dom.PROGRESSIVE_MIRROR.button.addEventListener('click', this._updateEffect.bind(this));

    this._dom.PROGRESSIVE.lightNumber.addEventListener('input', () => {
      this._dom.PROGRESSIVE.lightNumberText.innerHTML = this._dom.PROGRESSIVE.lightNumber.value;
      window.localStorage.setItem('auto-progressive-led', this._dom.PROGRESSIVE.lightNumber.value);
    });
    this._dom.PULSE.maxLength.addEventListener('input', () => {
      this._dom.PULSE.maxLengthText.innerHTML = this._dom.PULSE.maxLength.value;
      window.localStorage.setItem('auto-pulse-length', this._dom.PULSE.maxLength.value);
    });
    this._dom.PULSE.color.addEventListener('click', event => {
      event.preventDefault();
      Utils.colorPickerModal('pulse-color', color => {
        this._dom.PULSE.color.value = color
      });
    });
  }


  _initState() {
    // Initialize range sliders with saved values
    window.rangesliderJs.create(this._dom.PROGRESSIVE.lightNumber, { value: window.localStorage.getItem('auto-progressive-led') || '5' });
    window.rangesliderJs.create(this._dom.PULSE.maxLength, { value: window.localStorage.getItem('auto-pulse-length') || '100' });
  }


  /** @method
   * @name _updateEffect
   * @private
   * @memberof LightFever440
   * @description <blockquote>Switch the Light Fever 440 effect using the HTML data-effect set on each of the concerned buttons.
   * See <code>README.md</code> for the detailled API description.</blockquote>
   * @param {object} event - The event data (click) to retrieve the event target and update it **/
  _updateEffect(event) {
    this._unselectAllEffect();
    // Then use target as current selection
    event.target.classList.add('selected');
    window.LF440.effect = event.target.dataset.effect;
    this._dom[window.LF440.effect].container.style.display = 'block';

    if (window.LF440.isActive === true) {
      window.LF440.sendAction().then(() => {
        window.F440.status = `Effect ${window.LF440.effect} activated`;
        console.log(`AnalyzerController : Successfully activate effect ${window.LF440.effect}`);
      }).catch(() => {
        window.LF440.status = `Unable to set effect ${window.LF440.effect}`;
        console.error(`AnalyzerController : Failed to activate effect ${window.LF440.effect}`);
      });
    } else {
      window.LF440.status = `Please start LightFever440`;
      console.error(`AnalyzerController : Failed to activate effect ${window.LF440.effect}, LightFever440 isn't activated`);
    }
  }


  _unselectAllEffect() {
    // Unselect all buttons and hide all associated options
    for (const [key] of Object.entries(this._dom)) {
      this._dom[key].button.classList.remove('selected');
      this._dom[key].container.style.display = 'none';
    }
  }


  initEffect(effect) {
    this._unselectAllEffect();
    // Update effect toggled
    this._dom[effect].button.classList.add('selected');
    this._dom[effect].container.style.display = 'block';
  }


  getActiveEffect() {
    // Find selected effect in destination mode
    for (const [key] of Object.entries(this._dom)) {
      if (this._dom[key].button.classList.contains('selected')) {
        this._dom[key].container.style.display = 'block';
        return this._dom[key].button.dataset.effect;
      }
    }

    return 'UNIFORM';
  }


  getOptions() {
    let options = {};
    if (window.LF440.effect === 'UNIFORM') {
      options = {
        peakDetection: this._dom.UNIFORM.peakDetection.checked
      };
    } else if (window.LF440.effect === 'PROGRESSIVE') {
      options = {
        lightNumber: parseInt(this._dom.PROGRESSIVE.lightNumber.value),
        reverse: this._dom.PROGRESSIVE.reverse.checked
      };
    } else if (window.LF440.effect === 'PULSE') {
      options = {
        color: Utils.hexToRgb(this._dom.PULSE.color),
        maxLength: parseInt(this._dom.PULSE.maxLength.value)
      };
    }

    return options;
  }


}


export default AnalyzerController;
