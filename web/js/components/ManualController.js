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
        speed: document.getElementById('manual-chase-speed'),
        speedText: document.getElementById('manual-chase-speed-value'),
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

    this._presets = {
      slots: [
        document.getElementById('manual-preset0'),
        document.getElementById('manual-preset1'),
        document.getElementById('manual-preset2'),
        document.getElementById('manual-preset3'),
        document.getElementById('manual-preset4'),
        document.getElementById('manual-preset5'),
        document.getElementById('manual-preset6')
      ],
      save: document.getElementById('manual-preset-save'),
      del: document.getElementById('manual-preset-del'),
      selected: null
    };

    this._inputFactory = new InputFactory({
      scope: this,
      update: this._updateEffect
    });

    this._initPresets('UNIFORM');
    this._initEvents();
  }


  _initPresets(effect) {
    for (let i = 0; i < this._presets.slots.length; ++i) {
      if (window.localStorage.getItem(`manual-${effect.toLowerCase()}-preset-${i}`) !== null) {
        this._presets.slots[i].classList.add('saved');
        this._presets.slots[i].innerHTML = i + 1;
      } else {
        this._presets.slots[i].classList.remove('saved');
        this._presets.slots[i].classList.remove('selected');
        this._presets.slots[i].innerHTML = '';
      }
    }
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
      default: '#FFFFFF',
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
    this._inputFactory.new('SWITCH_OVERRIDE', {
      effect: 'CHASE',
      element: this._dom.CHASE.rainbow,
      color: this._dom.CHASE.color,
      default: '#FFFFFF',
      lsKey: 'manual-chase-color',
      lsKeySwitch: 'manual-chase-rainbow'
    });
    this._inputFactory.new('SLIDER', {
      effect: 'CHASE',
      element: this._dom.CHASE.speed,
      label: this._dom.CHASE.speedText,
      default: '50',
      lsKey: 'manual-chase-speed'
    });
    this._inputFactory.new('SLIDER', {
      effect: 'CHASE',
      element: this._dom.CHASE.size,
      label: this._dom.CHASE.sizeText,
      default: '1',
      lsKey: 'manual-chase-size'
    });
    this._inputFactory.new('SLIDER', {
      effect: 'CHASE',
      element: this._dom.CHASE.spacing,
      label: this._dom.CHASE.spacingText,
      default: '2',
      lsKey: 'manual-chase-spacing'
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
      default: '50',
      lsKey: 'manual-rainbow-speed'
    });
    /* Preset events */
    this._presets.save.addEventListener('click', this._savePreset.bind(this));
    this._presets.del.addEventListener('click', this._deletePreset.bind(this));
    for (let i = 0; i < this._presets.slots.length; ++i) {
      this._presets.slots[i].addEventListener('click', this._selectPreset.bind(this));
    }
  }


  _updateEffect(effect) {
    if (effect !== window.LF440.effect) {
      this._unselectAllEffect();
      window.LF440.effect = effect;
      this._dom[window.LF440.effect].container.style.display = 'block';
      this._dom[window.LF440.effect].button.classList.add('selected');
      this._initPresets(window.LF440.effect);
    }

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


  _savePreset() {
    const save = index => {
      this._presets.slots[index].classList.add('saved');
      this._presets.slots[index].innerHTML = parseInt(index) + 1;
      window.localStorage.setItem(`manual-${window.LF440.effect.toLowerCase()}-preset-${index}`, JSON.stringify(this.getOptions()));
    };

    if (this._presets.selected) {
      save(parseInt(this._presets.selected.dataset.index));
    } else {
      for (let i = 0; i < this._presets.slots.length; ++i) {
        if (!this._presets.slots[i].classList.contains('saved')) {
          save(i);
          return;
        }
      }
    }
  }


  _deletePreset() {
    if (this._presets.selected) {
      window.localStorage.removeItem(`manual-${window.LF440.effect.toLowerCase()}-preset-${this._presets.selected.dataset.index}`);
      this._presets.slots[this._presets.selected.dataset.index].innerHTML = '';
      this._presets.selected.classList.remove('saved');
      this._presets.selected.classList.remove('selected');
    }
  }


  _selectPreset(event) {
    for (let i = 0; i < this._presets.slots.length; ++i) {
      this._presets.slots[i].classList.remove('selected');
    }
    // Add to selection
    this._presets.selected = event.target;
    this._presets.selected.classList.add('selected');
    // Set options for uniform
    const options = JSON.parse(window.localStorage.getItem(`manual-${window.LF440.effect.toLowerCase()}-preset-${event.target.dataset.index}`));
    if (options) {
      if (window.LF440.effect === 'UNIFORM') {
        this._dom.UNIFORM.color.value = Utils.rgbToHex(options.color[0], options.color[1], options.color[2]);
        this._dom.UNIFORM.waveDelta['rangeslider-js'].update({ value: options.waveDelta });
      } else if (window.LF440.effect === 'CHASE') {
        this._dom.CHASE.speed['rangeslider-js'].update({ value: options.speed });
        this._dom.CHASE.size['rangeslider-js'].update({ value: options.size });
        this._dom.CHASE.spacing['rangeslider-js'].update({ value: options.spacing });
        if (options.rainbow === true) {
          this._dom.CHASE.rainbow.checked = options.rainbow;
          this._dom.CHASE.color.parentNode.style.filter = 'opacity(0.1)';
        } else {
          this._dom.CHASE.rainbow.checked = false;
          this._dom.CHASE.color.value = Utils.rgbToHex(options.color[0], options.color[1], options.color[2]);
          this._dom.CHASE.color.parentNode.style.filter = 'opacity(1)';
        }
      } else if (window.LF440.effect === 'RAINBOW') {
        this._dom.RAINBOW.speed['rangeslider-js'].update({ value: options.speed });
      }

      this._updateEffect(window.LF440.effect);
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
        speed: parseInt(this._dom.CHASE.speed.value),
        size: parseInt(this._dom.CHASE.size.value),
        spacing: parseInt(this._dom.CHASE.spacing.value)
      };

      if (this._dom.CHASE.rainbow.checked === true) {
        delete options.color;
        options.rainbow = this._dom.CHASE.rainbow.checked;
      }
    } else if (window.LF440.effect === 'RAINBOW') {
      options = {
        speed: parseInt(this._dom.RAINBOW.speed.value)
      };
    }
    return options;
  }


}


export default ManualController;
