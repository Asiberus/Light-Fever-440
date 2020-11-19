import * as Utils from './Utils.js';


class InputFactory {


  constructor(options) {
    this._scope = options.scope;
    this._update = options.update;
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
      if (lsSave === true) {
        if (isSwitch === true) {
          window.localStorage.setItem(options.lsKey, options.element.checked);
        } else {
          window.localStorage.setItem(options.lsKey, options.element.value);
        }
      }
      this._update.call(this._scope, options.effect);
    });
  }


  _createSlider(options) {
    options.label.innerHTML = window.localStorage.getItem(options.lsKey) || options.default;
    window.rangesliderJs.create(options.element, { value: window.localStorage.getItem(options.lsKey) || options.default });
    this._event('change', options, true, false);
    options.element.addEventListener('input', () => {
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
    options.element.checked = (window.localStorage.getItem(`${options.lsKey}-switch`) === 'true');
    if (options.element.checked === true) {
      options.color.parentNode.style.filter = 'opacity(0.1)';
    }

    this._event('change', options, false);
    options.element.addEventListener('input', () => {
      window.localStorage.setItem(`${options.lsKey}-switch`, options.element.checked);
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
