import * as Utils from './Utils.js';


class InputFactory {


  constructor(options) {
    this._scope = options.scope;
    this._update = options.update;
    // This flag allow to start a transaction on a slider. When true, the change evt can be fire.
    // We only want to fire change when the user is actually moving a slider.
    this._changeEventLock = false;
  }


  new(type, options) {
    if (type === 'CLICK') {
      this._clickEvent(options);
    } else if (type === 'SWITCH') {
      this._createSwitch(options);
    } else if (type === 'SLIDER') {
      this._createSlider(options);
    } else if (type === 'COLOR') {
      this._createColor(options);
    } else if (type === 'COLOR_OVERRIDE') {
      this._createColorOverride(options);
    } else if (type === 'SWITCH_OVERRIDE') {
      this._createSwitchOverride(options);
    }
  }


  _clickEvent(options) {
    // Mouse clicked on element
    this._event('click', options, false);
  }


  _createSwitch(options) {
    options.element.checked = (window.localStorage.getItem(options.lsKey) === 'true');
    // Mouse release the input, to send action for effect
    this._event('change', options, true, true);
  }


  _event(verb, options, lsSave, isSwitch = true) {
    options.element.addEventListener(verb, () => {
      if (verb === 'click' || this._changeEventLock === true) {
        if (lsSave === true) {
          if (isSwitch === true) {
            window.localStorage.setItem(options.lsKey, options.element.checked);
          } else {
            window.localStorage.setItem(options.lsKey, options.element.value);
          }
        }
        this._update.call(this._scope, options.effect);
        this._changeEventLock = false;
      }
    });
  }


  _createSlider(options) {
    options.label.innerHTML = window.localStorage.getItem(options.lsKey) || options.default;
    window.rangesliderJs.create(options.element, { value: window.localStorage.getItem(options.lsKey) || options.default });
    this._event('change', options, true, false);
    options.element.addEventListener('input', () => {
      this._changeEventLock = true;
      window.localStorage.setItem(options.lsKey, options.element.value);
      options.label.innerHTML = options.element.value;
    });
  }


  _createColor(options) {
    options.element.value = window.localStorage.getItem(options.lsKey) || options.default;
    options.element.addEventListener('click', event => {
      event.preventDefault(); // Avoid native color picker to open
      Utils.colorPickerModal(window.localStorage.getItem(options.lsKey), color => {
        window.localStorage.setItem(options.lsKey, color);
        options.element.value = color;
        this._update.call(this._scope, options.effect);
      });
    });
  }


  _createColorOverride(options) {
    options.element.checked = (window.localStorage.getItem(`${options.lsKey}-switch`) === 'true');
    if (options.element.checked === true) {
      options.color.parentNode.style.filter = 'opacity(1)';
    }

    this._event('change', options, false);
    options.element.addEventListener('input', () => {
      window.localStorage.setItem(`${options.lsKey}-switch`, options.element.checked);
      if (options.element.checked === true) {
        options.color.parentNode.style.filter = 'opacity(1)';
      } else {
        options.color.parentNode.style.filter = 'opacity(0.1)';
      }
    });

    options.color.value = window.localStorage.getItem(options.lsKey) || options.default;
    options.color.addEventListener('click', event => {
      event.preventDefault();
      if (options.element.checked === true) {
        Utils.colorPickerModal(window.localStorage.getItem(options.lsKey), color => {
          window.localStorage.setItem(options.lsKey, color);
          options.color.value = color;
          this._update.call(this._scope, options.effect);
        });
      }
    });
  }


  _createSwitchOverride(options) {
    options.element.checked = (window.localStorage.getItem(`${options.lsKeySwitch}`) === 'true');
    if (options.element.checked === true) {
      options.color.parentNode.style.filter = 'opacity(0.1)';
    }

    this._event('change', options, false);
    options.element.addEventListener('input', () => {
      window.localStorage.setItem(`${options.lsKeySwitch}`, options.element.checked);
      if (options.element.checked === false) {
        options.color.parentNode.style.filter = 'opacity(1)';
      } else {
        options.color.parentNode.style.filter = 'opacity(0.1)';
      }
    });

    options.color.value = window.localStorage.getItem(options.lsKey) || options.default;
    options.color.addEventListener('click', event => {
      event.preventDefault();
      if (options.element.checked === false) {
        Utils.colorPickerModal(window.localStorage.getItem(options.lsKey), color => {
          window.localStorage.setItem(options.lsKey, color);
          options.color.value = color;
          this._update.call(this._scope, options.effect);
        });
      }
    });
  }


}


export default InputFactory;
