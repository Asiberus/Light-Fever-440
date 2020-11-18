import * as Utils from './Utils.js';


class ManualController {


  constructor() {
    this._dom = {
      UNIFORM: {
        button: document.getElementById('manual-uniform'),
        container: document.getElementById('manual-uniform-options'),
        color: document.getElementById('manual-uniform-color')
      },
      CHASE: {
        button: document.getElementById('manual-chase'),
        container: document.getElementById('manual-chase-options'),
        color: document.getElementById('manual-chase-color')
      },
      RAINBOW: {
        button: document.getElementById('manual-rainbow'),
        container: document.getElementById('manual-rainbow-options')
      },
      CHASE_RAINBOW: {
        button: document.getElementById('manual-chase-rainbow'),
        container: document.getElementById('manual-chase-rainbow-options')
      }
    };

    this._initEvents();
  }


  _initEvents() {
    // Listeners for manual effects
    this._dom.UNIFORM.button.addEventListener('click', this._updateEffect.bind(this));
    this._dom.CHASE.button.addEventListener('click', this._updateEffect.bind(this));
    this._dom.RAINBOW.button.addEventListener('click', this._updateEffect.bind(this));
    this._dom.CHASE_RAINBOW.button.addEventListener('click', this._updateEffect.bind(this));
    // Options slider etc events
    this._dom.UNIFORM.color.addEventListener('click', () => {
      event.preventDefault();
      Utils.colorPickerModal('uniform-color', color => {
        this._dom.UNIFORM.color.value = color
      });
    });
    this._dom.CHASE.color.addEventListener('click', () => {
      event.preventDefault();
      Utils.colorPickerModal('chase-color', color => {
        this._dom.CHASE.color.value = color
      });
    });
  }


  _updateEffect(event) {
    this._unselectAllEffect();
    // Then use target as current selection
    event.target.classList.add('selected');
    LF440.effect = event.target.dataset.effect;
    this._dom[LF440.effect].container.style.display = 'block';

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


  _unselectAllEffect() {
    // Unselect all buttons and hide all associated options
    for (const [key, value] of Object.entries(this._dom)) {
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
    for (const [key, value] of Object.entries(this._dom)) {
      if (this._dom[key].button.classList.contains('selected')) {
        this._dom[key].container.style.display = 'block';
        return this._dom[key].button.dataset.effect;
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


}


export default ManualController;
