import * as Utils from './Utils.js';


class ManualController {


  constructor() {
    this._dom = {
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
      }
    };

    this._initEvents();
  }


  _initEvents() {
    // Listeners for manual effects
    this._dom.manualButtons.UNIFORM.addEventListener('click', this._updateEffect.bind(this));
    this._dom.manualButtons.CHASE.addEventListener('click', this._updateEffect.bind(this));
    this._dom.manualButtons.RAINBOW.addEventListener('click', this._updateEffect.bind(this));
    this._dom.manualButtons.CHASE_RAINBOW.addEventListener('click', this._updateEffect.bind(this));
    // Options slider etc events
    this._dom.manualOptions.opts.uniformColor.addEventListener('click', () => {
      event.preventDefault();
      Utils.colorPickerModal('uniform-color', color => {
        this._dom.manualOptions.opts.uniformColor.value = color
      });
    });
    this._dom.manualOptions.opts.chaseColor.addEventListener('click', () => {
      event.preventDefault();
      Utils.colorPickerModal('chase-color', color => {
        this._dom.manualOptions.opts.chaseColor.value = color
      });
    });
  }


  initEffect(effect) {
    // Unselect all buttons
    for (const [key, value] of Object.entries(this._dom.manualButtons)) {
      this._dom.manualButtons[key].classList.remove('selected');
      this._dom.manualOptions[key].style.display = 'none';
    }
    // Update effect toggled
    this._dom.manualButtons[effect].classList.add('selected');
    this._dom.manualOptions[effect].style.display = 'block';
  }


  getActiveEffect() {
    // Find selected effect in destination mode
    for (const [key, value] of Object.entries(this._dom.manualButtons)) {
      if (this._dom.manualButtons[key].classList.contains('selected')) {
        this._dom.manualOptions[key].style.display = 'block';
        return this._dom.manualButtons[key].dataset.effect;
      }
    }

    return 'UNIFORM';
  }


  getOptions() {
    let options = {};
    if (LF440.effect === 'UNIFORM') {
      options = {
        color: Utils.hexToRgb(window.localStorage.getItem('uniform-color'))
      };
    } else if (LF440.effect === 'CHASE') {
      options = {
        color: Utils.hexToRgb(window.localStorage.getItem('chase-color')),
        delay: 50 // ms
      };
    }
    return options;
  }


  _updateEffect(event) {
    // Unselect all buttons
    for (const [key, value] of Object.entries(this._dom.manualButtons)) {
      this._dom.manualButtons[key].classList.remove('selected');
      this._dom.manualOptions[key].style.display = 'none';
    }
    // Then use target as current selection
    event.target.classList.add('selected');
    LF440.effect = event.target.dataset.effect;
    this._dom.manualOptions[LF440.effect].style.display = 'block';

    if (LF440.isActive === true) {
      LF440.sendAction().then(() => {
        LF440.status = `Effect ${LF440.effect} activated`;
        console.log(`ManualController : Successfully activate effect ${LF440.effect}`);
      }).catch(() => {
        LF440.status = `Unable to set effect ${LF440.effect}`;
        console.error(`ManualController : Failed to activate effect ${LF440.effect}`);
      });
    } else {
      LF440.status = `Please start LightFever440`;
      console.error(`ManualController : Failed to activate effect ${LF440.effect}, LightFever440 isn't activated`);
    }
  }


}


export default ManualController;
