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
    this._initState();
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
      Utils.colorPickerModal(window.localStorage.getItem('manual-uniform-color'), color => {
        window.localStorage.setItem('manual-uniform-color', color);
        this._dom.UNIFORM.color.value = color;
      });
    });
    this._dom.CHASE.color.addEventListener('click', () => {
      event.preventDefault();
      Utils.colorPickerModal(window.localStorage.getItem('manual-chase-color'), color => {
        window.localStorage.setItem('manual-chase-color', color);
        this._dom.CHASE.color.value = color;
      });
    });
  }


  _initState() {
    this._dom.UNIFORM.color.value = window.localStorage.getItem('manual-uniform-color');
    this._dom.CHASE.color.value = window.localStorage.getItem('manual-chase-color');
  }


  _updateEffect(event) {
    this._unselectAllEffect();
    // Then use target as current selection
    event.target.classList.add('selected');
    window.LF440.effect = event.target.dataset.effect;
    this._dom[window.LF440.effect].container.style.display = 'block';

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
        color: Utils.hexToRgb(window.localStorage.getItem('manual-uniform-color'))
      };
    } else if (window.LF440.effect === 'CHASE') {
      options = {
        color: Utils.hexToRgb(window.localStorage.getItem('manual-chase-color')),
        delay: 50 // ms
      };
    }
    return options;
  }


}


export default ManualController;
