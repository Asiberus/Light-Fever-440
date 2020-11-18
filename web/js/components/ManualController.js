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

    this._initState();
    this._initEvents();
  }


  _initEvents() {
    // Listeners for manual effects
    this._dom.UNIFORM.button.addEventListener('click', this._updateEffect.bind(this));
    this._dom.CHASE.button.addEventListener('click', this._updateEffect.bind(this));
    this._dom.RAINBOW.button.addEventListener('click', this._updateEffect.bind(this));

    this._dom.UNIFORM.color.addEventListener('click', event => {
      event.preventDefault();
      Utils.colorPickerModal(window.localStorage.getItem('manual-uniform-color'), color => {
        window.localStorage.setItem('manual-uniform-color', color);
        this._dom.UNIFORM.color.value = color;
        this._updateEffect('UNIFORM');
      });
    });
    this._dom.UNIFORM.waveDelta.addEventListener('input', () => {
      this._dom.UNIFORM.waveDeltaText.innerHTML = this._dom.UNIFORM.waveDelta.value;
      window.localStorage.setItem('manual-uniform-wave-delta', this._dom.UNIFORM.waveDelta.value);
    });

    this._dom.CHASE.color.addEventListener('click', () => {
      event.preventDefault();
      Utils.colorPickerModal(window.localStorage.getItem('manual-chase-color'), color => {
        window.localStorage.setItem('manual-chase-color', color);
        this._dom.CHASE.color.value = color;
        this._updateEffect('CHASE');
      });
    });
    this._dom.CHASE.delay.addEventListener('input', () => {
      this._dom.CHASE.delayText.innerHTML = this._dom.CHASE.delay.value;
      window.localStorage.setItem('manual-chase-delay', this._dom.CHASE.delay.value);
    });
    this._dom.CHASE.size.addEventListener('input', () => {
      this._dom.CHASE.sizeText.innerHTML = this._dom.CHASE.size.value;
      window.localStorage.setItem('manual-chase-size', this._dom.CHASE.size.value);
    });

    this._dom.CHASE.spacing.addEventListener('input', () => {
      this._dom.CHASE.spacingText.innerHTML = this._dom.CHASE.spacing.value;
      window.localStorage.setItem('manual-chase-spacing', this._dom.CHASE.spacing.value);
    });

    this._dom.CHASE.rainbow.addEventListener('input', () => {
      window.localStorage.setItem('manual-chase-rainbow', this._dom.CHASE.rainbow.checked);
    });

    this._dom.RAINBOW.speed.addEventListener('input', () => {
      this._dom.RAINBOW.speedText.innerHTML = this._dom.RAINBOW.speed.value;
      window.localStorage.setItem('manual-rainbow-speed', this._dom.RAINBOW.speed.value);
    });
    // Mouse release the input, to send action for all manual effects
    this._dom.UNIFORM.waveDelta.addEventListener('change', this._updateEffect.bind(this, 'UNIFORM'));
    this._dom.CHASE.delay.addEventListener('change', this._updateEffect.bind(this, 'CHASE'));
    this._dom.CHASE.size.addEventListener('change', this._updateEffect.bind(this, 'CHASE'));
    this._dom.CHASE.spacing.addEventListener('change', this._updateEffect.bind(this, 'CHASE'));
    this._dom.CHASE.rainbow.addEventListener('change', this._updateEffect.bind(this, 'CHASE'));
    this._dom.RAINBOW.speed.addEventListener('change', this._updateEffect.bind(this, 'RAINBOW'));
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
    /* Init manual mode sliders */
    window.rangesliderJs.create(this._dom.UNIFORM.waveDelta, { value: window.localStorage.getItem('manual-uniform-wave-delta') || '0' });
    window.rangesliderJs.create(this._dom.CHASE.delay, { value: window.localStorage.getItem('manual-chase-delay') || '50' });
    window.rangesliderJs.create(this._dom.CHASE.size, { value: window.localStorage.getItem('manual-chase-size') || '1' });
    window.rangesliderJs.create(this._dom.CHASE.spacing, { value: window.localStorage.getItem('manual-chase-spacing') || '2' });
    window.rangesliderJs.create(this._dom.RAINBOW.speed, { value: window.localStorage.getItem('manual-rainbow-speed') || '50' });
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
