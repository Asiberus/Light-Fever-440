import InputFactory from './InputFactory.js';
import PresetManager from './PresetManager.js';
import * as Utils from './Utils.js';


class AnalyzerController {


  constructor() {
    this._dom = {
      UNIFORM: {
        button: document.getElementById('auto-uniform'),
        container: document.getElementById('auto-uniform-options'),
        peak: document.getElementById('auto-uniform-peak'),
        peakText: document.getElementById('auto-uniform-peak-value'),
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
        reverse: document.getElementById('auto-pulse-reverse'),
        colorSwitch: document.getElementById('auto-pulse-color-switch'),
        color: document.getElementById('auto-pulse-color')
      },
      PROGRESSIVE_PULSE: {
        button: document.getElementById('auto-progressive-pulse'),
        container: document.getElementById('auto-progressive-pulse-options'),
        size: document.getElementById('auto-progressive-pulse-size'),
        sizeText: document.getElementById('auto-progressive-pulse-size-value'),
        reverse: document.getElementById('auto-progressive-pulse-reverse'),
        colorSwitch: document.getElementById('auto-progressive-pulse-color-switch'),
        color: document.getElementById('auto-progressive-pulse-color'),
        threshold: document.getElementById('auto-progressive-pulse-threshold'),
        thresholdText: document.getElementById('auto-progressive-pulse-threshold-value'),
      }
    };

    this._inputFactory = new InputFactory({
      scope: this,
      update: this._updateEffect
    });

    this._presetManager = new PresetManager({
      type: 'AUTO',
      effect: 'UNIFORM',
      getOptions: this.getOptions.bind(this),
      applyPresetOptions: this._applyPresetOptions.bind(this)
    });

    this._initEvents();
  }


  _initEvents() {
    /* Uniform effect options */
    this._inputFactory.new('CLICK', {
      effect: 'UNIFORM',
      element: this._dom.UNIFORM.button
    });
    this._inputFactory.new('SLIDER', {
      effect: 'UNIFORM',
      element: this._dom.UNIFORM.peak,
      label: this._dom.UNIFORM.peakText,
      default: '0',
      lsKey: 'auto-uniform-peak'
    });
    this._inputFactory.new('COLOR_OVERRIDE', {
      effect: 'UNIFORM',
      element: this._dom.UNIFORM.colorSwitch,
      color: this._dom.UNIFORM.color,
      default: '#FFFFFF',
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
    this._inputFactory.new('SWITCH', {
      effect: 'PULSE',
      element: this._dom.PULSE.reverse,
      lsKey: 'auto-pulse-reverse'
    });
    this._inputFactory.new('COLOR_OVERRIDE', {
      effect: 'PULSE',
      element: this._dom.PULSE.colorSwitch,
      color: this._dom.PULSE.color,
      default: '#FFFFFF',
      lsKey: 'auto-pulse-color'
    });
    /* Progressive pulse */
    this._inputFactory.new('CLICK', {
      effect: 'PROGRESSIVE_PULSE',
      element: this._dom.PROGRESSIVE_PULSE.button
    });
    this._inputFactory.new('SWITCH', {
      effect: 'PROGRESSIVE_PULSE',
      element: this._dom.PROGRESSIVE_PULSE.reverse,
      lsKey: 'auto-progressive-pulse-reverse'
    });
    this._inputFactory.new('SLIDER', {
      effect: 'PROGRESSIVE_PULSE',
      element: this._dom.PROGRESSIVE_PULSE.threshold,
      label: this._dom.PROGRESSIVE_PULSE.thresholdText,
      default: '0',
      lsKey: 'auto-progressive-pulse-threshold'
    });
    this._inputFactory.new('SLIDER', {
      effect: 'PROGRESSIVE_PULSE',
      element: this._dom.PROGRESSIVE_PULSE.size,
      label: this._dom.PROGRESSIVE_PULSE.sizeText,
      default: '5',
      lsKey: 'auto-progressive-pulse-size'
    });
    this._inputFactory.new('COLOR_OVERRIDE', {
      effect: 'PROGRESSIVE_PULSE',
      element: this._dom.PROGRESSIVE_PULSE.colorSwitch,
      color: this._dom.PROGRESSIVE_PULSE.color,
      default: '#FFFFFF',
      lsKey: 'auto-progressive-pulse-color'
    });
  }


  /** @method
   * @name _updateEffect
   * @private
   * @memberof LightFever440
   * @description <blockquote>Switch the Light Fever 440 effect using the HTML data-effect set on each of the concerned buttons.
   * See <code>README.md</code> for the detailled API description.</blockquote>
   * @param {object} event - The event data (click) to retrieve the event target and update it **/
  _updateEffect(effect) {
    if (effect !== window.LF440.effect) {
      this._unselectAllEffect();
      window.LF440.effect = effect;
      this._dom[window.LF440.effect].container.style.display = 'block';
      this._dom[window.LF440.effect].button.classList.add('selected');
      this._presetManager.initPresets(window.LF440.effect);
    }

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


  _applyPresetOptions(options) {
    if (window.LF440.effect === 'UNIFORM') {
      this._dom.UNIFORM.peak['rangeslider-js'].update({ value: (options.peak * 100) });
      if (options.color) {
        this._dom.UNIFORM.colorSwitch.checked = true;
        this._dom.UNIFORM.color.parentNode.style.filter = 'opacity(1)';
      } else {
        this._dom.UNIFORM.colorSwitch.checked = false;
        this._dom.UNIFORM.color.parentNode.style.filter = 'opacity(0.1)';
      }
    } else if (window.LF440.effect === 'PROGRESSIVE') {
      this._dom.PROGRESSIVE.size['rangeslider-js'].update({ value: options.size });
      if (options.reverse === true) {
        this._dom.PROGRESSIVE.reverse.checked = true;
      } else {
        this._dom.PROGRESSIVE.reverse.checked = false;
      }
    } else if (window.LF440.effect === 'PULSE') {
      this._dom.PULSE.maxLength['rangeslider-js'].update({ value: (options.size * 100) });
      if (options.reverse === true) {
        this._dom.PULSE.reverse.checked = true;
      } else {
        this._dom.PULSE.reverse.checked = false;
      }
      if (options.color) {
        this._dom.PULSE.colorSwitch.checked = true;
        this._dom.PULSE.color.parentNode.style.filter = 'opacity(1)';
      } else {
        this._dom.PULSE.colorSwitch.checked = false;
        this._dom.PULSE.color.parentNode.style.filter = 'opacity(0.1)';
      }
    } else if (window.LF440.effect === 'PROGRESSIVE_PULSE') {
      this._dom.PROGRESSIVE_PULSE.size['rangeslider-js'].update({ value: options.size });
      if (options.reverse === true) {
        this._dom.PROGRESSIVE_PULSE.reverse.checked = true;
      } else {
        this._dom.PROGRESSIVE_PULSE.reverse.checked = false;
      }
      if (options.color) {
        this._dom.PROGRESSIVE_PULSE.colorSwitch.checked = true;
        this._dom.PROGRESSIVE_PULSE.color.parentNode.style.filter = 'opacity(1)';
      } else {
        this._dom.PROGRESSIVE_PULSE.colorSwitch.checked = false;
        this._dom.PROGRESSIVE_PULSE.color.parentNode.style.filter = 'opacity(0.1)';
      }
    }

    this._updateEffect(window.LF440.effect);
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
        peak: parseInt(this._dom.UNIFORM.peak.value) / 100
      };

      if (this._dom.UNIFORM.colorSwitch.checked) {
        options.color = Utils.mapColor(Utils.hexToRgb(this._dom.UNIFORM.color.value), window.LF440.maxColor);
      }
    } else if (window.LF440.effect === 'PROGRESSIVE') {
      options = {
        size: parseInt(this._dom.PROGRESSIVE.size.value),
        reverse: this._dom.PROGRESSIVE.reverse.checked
      };
    } else if (window.LF440.effect === 'PULSE') {
      options = {
        max: parseInt(this._dom.PULSE.maxLength.value) / 100,
        reverse: this._dom.PULSE.reverse.checked
      };

      if (this._dom.PULSE.colorSwitch.checked) {
        options.color = Utils.mapColor(Utils.hexToRgb(this._dom.PULSE.color.value), window.LF440.maxColor);
      }
    } else if (window.LF440.effect === 'PROGRESSIVE_PULSE') {
      options = {
        size: parseInt(this._dom.PROGRESSIVE_PULSE.size.value),
        reverse: this._dom.PROGRESSIVE_PULSE.reverse.checked,
        peakTreshold: parseInt(this._dom.PROGRESSIVE_PULSE.threshold.value) / 100
      };
      console.log(options);
      if (this._dom.PROGRESSIVE_PULSE.colorSwitch.checked) {
        options.color = Utils.mapColor(Utils.hexToRgb(this._dom.PROGRESSIVE_PULSE.color.value), window.LF440.maxColor);
      }
    }

    return options;
  }


}


export default AnalyzerController;
