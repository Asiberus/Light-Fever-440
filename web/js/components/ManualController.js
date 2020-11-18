import InputFactory from './InputFactory.js';
import * as Utils from './Utils.js';


class ManualController {


  constructor() {
    this._dom = {
      UNIFORM: {
        button: document.getElementById('manual-uniform'),
        container: document.getElementById('manual-uniform-options'),
        color: document.getElementById('manual-uniform-color'),
        waveDelta: document.getElementById('manual-uniform-wave-delta'),
        waveDeltaText: document.getElementById('manual-uniform-wave-delta-value')
      },
      CHASE: {
        button: document.getElementById('manual-chase'),
        container: document.getElementById('manual-chase-options'),
        color: document.getElementById('manual-chase-color'),
        delay: document.getElementById('manual-chase-delay'),
        delayText: document.getElementById('manual-chase-delay-value'),
        size: document.getElementById('manual-chase-size'),
        sizeText: document.getElementById('manual-chase-size-value'),
        spacing: document.getElementById('manual-chase-spacing'),
        spacingText: document.getElementById('manual-chase-spacing-value'),
        rainbow: document.getElementById('manual-chase-rainbow')
      },
      RAINBOW: {
        button: document.getElementById('manual-rainbow'),
        container: document.getElementById('manual-rainbow-options'),
        speed: document.getElementById('manual-rainbow-speed'),
        speedText: document.getElementById('manual-rainbow-speed-value')
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
    this._dom.UNIFORM.color.value = window.localStorage.getItem('manual-uniform-color') || '#FFFFFF';
    this._dom.CHASE.color.value = window.localStorage.getItem('manual-chase-color') || '#FFFFFF';
    this._dom.UNIFORM.waveDeltaText.innerHTML = window.localStorage.getItem('manual-uniform-wave-delta') || '0';
    this._dom.CHASE.delayText.innerHTML = window.localStorage.getItem('manual-chase-delay') || '50';
    this._dom.CHASE.sizeText.innerHTML = window.localStorage.getItem('manual-chase-size') || '1';
    this._dom.CHASE.spacingText.innerHTML = window.localStorage.getItem('manual-chase-spacing') || '2';
    this._dom.CHASE.rainbow.checked = window.localStorage.getItem('manual-chase-rainbow') === 'true';
    this._dom.RAINBOW.speedText.innerHTML = window.localStorage.getItem('manual-rainbow-speed') || '50';
  }


  _initEvents() {
    /* Uniform effect options */
    this._inputFactory.new('CLICK', {
      effect: 'UNIFORM',
      element: this._dom.UNIFORM.button
    });
    this._inputFactory.new('COLOR', {
      effect: 'UNIFORM',
      element: this._dom.UNIFORM.color,
      lsKey: 'manual-uniform-color'
    });
    this._inputFactory.new('SLIDER', {
      effect: 'UNIFORM',
      element: this._dom.UNIFORM.waveDelta,
      label: this._dom.UNIFORM.waveDeltaText,
      default: '0',
      lsKey: 'manual-uniform-wave-delta'
    });
    /* Chase effect options */
    this._inputFactory.new('CLICK', {
      effect: 'CHASE',
      element: this._dom.CHASE.button
    });
    this._inputFactory.new('COLOR', {
      effect: 'CHASE',
      element: this._dom.CHASE.color,
      lsKey: 'manual-chase-color'
    });
    this._inputFactory.new('SLIDER', {
      effect: 'CHASE',
      element: this._dom.CHASE.delay,
      label: this._dom.CHASE.delayText,
      default: '0',
      lsKey: 'manual-chase-delay'
    });
    this._inputFactory.new('SLIDER', {
      effect: 'CHASE',
      element: this._dom.CHASE.size,
      label: this._dom.CHASE.sizeText,
      default: '0',
      lsKey: 'manual-chase-size'
    });
    this._inputFactory.new('SLIDER', {
      effect: 'CHASE',
      element: this._dom.CHASE.spacing,
      label: this._dom.CHASE.spacingText,
      default: '0',
      lsKey: 'manual-chase-spacing'
    });
    this._inputFactory.new('SWITCH', {
      effect: 'CHASE',
      element: this._dom.CHASE.rainbow,
      lsKey: 'manual-chase-rainbow'
    });
    /* Rainbow effect options */
    this._inputFactory.new('CLICK', {
      effect: 'RAINBOW',
      element: this._dom.RAINBOW.button
    });
    this._inputFactory.new('SLIDER', {
      effect: 'RAINBOW',
      element: this._dom.RAINBOW.speed,
      label: this._dom.RAINBOW.speedText,
      default: '0',
      lsKey: 'manual-rainbow-speed'
    });
  }


  _updateEffect(arg) { // Either event or string
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
        window.LF440.status = `Effect ${window.LF440.effect} activated`;
        console.log(`ManualController : Successfully activate effect ${window.LF440.effect}`);
      }).catch(() => {
        window.LF440.status = `Unable to set effect ${window.LF440.effect}`;
        console.error(`ManualController : Failed to activate effect ${window.LF440.effect}`);
      });
    } else {
      window.LF440.status = `Please start LightFever440`;
      console.error(`ManualController : Failed to activate effect ${window.LF440.effect}, LightFever440 isn't activated`);
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
    // Find selected effect in destination mode (when switching to manual, re-open proper effect and options)
    for (const [key] of Object.entries(this._dom)) {
      if (this._dom[key].button.classList.contains('selected')) {
        this._dom[key].container.style.display = 'block';
        return this._dom[key].button.dataset.effect;
      }
    }
    // Default is UNIFORM, but may never get called
    return 'UNIFORM';
  }


  getOptions() {
    let options = {};
    if (window.LF440.effect === 'UNIFORM') {
      options = {
        color: Utils.hexToRgb(window.localStorage.getItem('manual-uniform-color')),
        waveDelta: parseInt(this._dom.UNIFORM.waveDelta.value)
      };
    } else if (window.LF440.effect === 'CHASE') {
      options = {
        color: Utils.hexToRgb(window.localStorage.getItem('manual-chase-color')),
        delay: parseInt(this._dom.CHASE.delay.value),
        size: parseInt(this._dom.CHASE.size.value),
        spacing: parseInt(this._dom.CHASE.spacing.value),
        rainbow: this._dom.CHASE.rainbow.checked
      };
    } else if (window.LF440.effect === 'RAINBOW') {
      options = {
        speed: parseInt(this._dom.RAINBOW.speed.value)
      };
    }
    return options;
  }


}


export default ManualController;
