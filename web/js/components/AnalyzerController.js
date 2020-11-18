import InputFactory from './InputFactory.js';
import * as Utils from './Utils.js';


class AnalyzerController {


  constructor() {
    this._dom = {
      UNIFORM: {
        button: document.getElementById('auto-uniform'),
        container: document.getElementById('auto-uniform-options'),
        peakDetection: document.getElementById('auto-uniform-peak-detection'),
        peakSensitivity: document.getElementById('auto-uniform-peak-sensitivity'),
        peakSensitivityText: document.getElementById('auto-uniform-peak-sensitivity-value'),
        colorSwitch: document.getElementById('auto-uniform-color-switch'),
        color: document.getElementById('auto-uniform-color')
      },
      PROGRESSIVE: {
        button: document.getElementById('auto-progressive'),
        container: document.getElementById('auto-progressive-options'),
        size: document.getElementById('auto-progressive-size'),
        sizeText: document.getElementById('auto-progressive-size-value'),
        reverse: document.getElementById('auto-progressive-reverse')
      },
      PULSE: {
        button: document.getElementById('auto-pulse'),
        container: document.getElementById('auto-pulse-options'),
        maxLength: document.getElementById('auto-pulse-length'),
        maxLengthText: document.getElementById('auto-pulse-length-value'),
        colorSwitch: document.getElementById('auto-pulse-color-switch'),
        color: document.getElementById('auto-pulse-color')
      }
    };

    this._inputFactory = new InputFactory({
      scope: this,
      update: this._updateEffect
    });

    this._initState();
    this._initEvents();
  }


  _initState() {
    /* Init all input and progress with local storage state or default values */
    this._dom.UNIFORM.peakDetection.checked = window.localStorage.getItem('auto-uniform-peak-detection') || false;
    this._dom.UNIFORM.peakSensitivity.value = window.localStorage.getItem('auto-uniform-peak-sensitivity') || '0';
    this._dom.UNIFORM.peakSensitivityText.innerHTML = window.localStorage.getItem('auto-uniform-peak-sensitivity') || '0';
    this._dom.UNIFORM.colorSwitch.checked = window.localStorage.getItem('auto-uniform-color-switch') || false;
    this._dom.UNIFORM.color.value = window.localStorage.getItem('auto-uniform-color') || '#FFFFFF';
    this._dom.PROGRESSIVE.size.value = window.localStorage.getItem('auto-progressive-size') || '5';
    this._dom.PROGRESSIVE.sizeText.value = window.localStorage.getItem('auto-progressive-size') || '5';
    this._dom.PROGRESSIVE.reverse.checked = window.localStorage.getItem('auto-progressive-reverse') || false;
    this._dom.PULSE.maxLength.value = window.localStorage.getItem('auto-pulse-length') || '100';
    this._dom.PULSE.maxLengthText.innerHTML = window.localStorage.getItem('auto-pulse-length') || '100';
    this._dom.PULSE.colorSwitch.checked = window.localStorage.getItem('auto-pulse-color-switch') || false;
    this._dom.PULSE.color.value = window.localStorage.getItem('auto-pulse-color') || '#FFFFFF';

    if (this._dom.UNIFORM.colorSwitch.checked === true) {
      this._dom.UNIFORM.color.parentNode.style.filter = 'opacity(1)';
    }

    if (this._dom.PULSE.colorSwitch.checked === true) {
      this._dom.PULSE.color.parentNode.style.filter = 'opacity(1)';
    }
  }


  _initEvents() {
    /* Uniform effect options */
    this._inputFactory.new('CLICK', {
      effect: 'UNIFORM',
      element: this._dom.UNIFORM.button
    });
    this._inputFactory.new('SWITCH', {
      effect: 'UNIFORM',
      element: this._dom.UNIFORM.peakDetection,
      lsKey: 'auto-uniform-peak-detection'
    });
    this._inputFactory.new('SLIDER', {
      effect: 'UNIFORM',
      element: this._dom.UNIFORM.peakSensitivity,
      label: this._dom.UNIFORM.peakSensitivityText,
      default: '0',
      lsKey: 'auto-uniform-peak-sensitivity'
    });
    this._inputFactory.new('COLOR_OVERRIDE', {
      effect: 'UNIFORM',
      element: this._dom.UNIFORM.colorSwitch,
      color: this._dom.UNIFORM.color,
      lsKey: 'auto-uniform-color'
    });
    /* Progressive effect options */
    this._inputFactory.new('CLICK', {
      effect: 'PROGRESSIVE',
      element: this._dom.PROGRESSIVE.button
    });
    this._inputFactory.new('SWITCH', {
      effect: 'PROGRESSIVE',
      element: this._dom.PROGRESSIVE.reverse,
      lsKey: 'auto-progressive-reverse'
    });
    this._inputFactory.new('SLIDER', {
      effect: 'PROGRESSIVE',
      element: this._dom.PROGRESSIVE.size,
      label: this._dom.PROGRESSIVE.sizeText,
      default: '5',
      lsKey: 'auto-progressive-size'
    });
    /* Pulse effect options */
    this._inputFactory.new('CLICK', {
      effect: 'PULSE',
      element: this._dom.PULSE.button
    });
    this._inputFactory.new('SLIDER', {
      effect: 'PULSE',
      element: this._dom.PULSE.maxLength,
      label: this._dom.PULSE.maxLengthText,
      default: '100',
      lsKey: 'auto-pulse-length'
    });
    this._inputFactory.new('COLOR_OVERRIDE', {
      effect: 'PULSE',
      element: this._dom.PULSE.colorSwitch,
      color: this._dom.PULSE.color,
      lsKey: 'auto-pulse-color'
    });
  }


  /** @method
   * @name _updateEffect
   * @private
   * @memberof LightFever440
   * @description <blockquote>Switch the Light Fever 440 effect using the HTML data-effect set on each of the concerned buttons.
   * See <code>README.md</code> for the detailled API description.</blockquote>
   * @param {object} event - The event data (click) to retrieve the event target and update it **/
  _updateEffect(arg) {
    let effect = arg; // Init with presumed string
    if (typeof arg !== 'string') {
      effect = arg.target.dataset.effect; // Update effect with event target specific effect info
    }

    this._unselectAllEffect();
    // Then use target as current selection
    window.LF440.effect = effect;
    this._dom[window.LF440.effect].container.style.display = 'block';
    this._dom[window.LF440.effect].button.classList.add('selected');

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
        peakDetection: this._dom.UNIFORM.peakDetection.checked,
        peakSensitivity: parseInt(this._dom.UNIFORM.peakSensitivity.value) / 100
      };
      if (this._dom.UNIFORM.colorSwitch.checked) {
        options.color = Utils.hexToRgb(this._dom.UNIFORM.color.value);
      }
    } else if (window.LF440.effect === 'PROGRESSIVE') {
      options = {
        size: parseInt(this._dom.PROGRESSIVE.size.value),
        reverse: this._dom.PROGRESSIVE.reverse.checked
      };
    } else if (window.LF440.effect === 'PULSE') {
      options = {
        max: parseInt(this._dom.PULSE.maxLength.value) / 100
      };
      if (this._dom.PULSE.colorSwitch.checked) {
        options.color = Utils.hexToRgb(this._dom.PULSE.color);
      }
    }

    return options;
  }


}


export default AnalyzerController;
