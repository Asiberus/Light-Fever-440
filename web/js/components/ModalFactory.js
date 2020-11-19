class ModalFactory {


  constructor(type, options) {
    this._dom = {
      overlay: document.getElementById('modal-overlay'),
      options: {
        container: document.getElementById('options-modal')
      },
      stroboscope: {
        container: document.getElementById('stroboscope-modal'),
        delay: document.getElementById('stroboscope-delay'),
        delayText: document.getElementById('stroboscope-delay-value'),
        color: document.getElementById('stroboscope-color')
      },
      colorPicker: {
        container: document.getElementById('color-picker-modal'),
      }
    };

    if (type === 'OPTIONS') {
      this._optionsModal();
    } else if (type === 'STROBOSCOPE') {
      this._stroboscopeModal();
    } else if (type === 'COLOR_PICKER') {
      this._colorPickerModal(options.color, options.callback)
    }
  }
// TODO remove getElem in method, centralize in constructor

  _optionsModal() {
    this._dom.overlay.classList.add('visible');
    this._dom.options.container.classList.add('visible');
    let reset = () => {
      window.localStorage.clear();
      setTimeout(() => {
        window.location.reload();
        return false;
      }, 100);
    };
    // Close modal internal metohd
    let close = event => {
      if (event.target.id === 'options-modal-close' || event.target.id === 'modal-overlay') {
        this._dom.overlay.classList.remove('visible');
        this._dom.options.container.classList.remove('visible');
        this._dom.overlay.removeEventListener('click', close);
        document.getElementById('options-modal-close').removeEventListener('click', close);
      }
    };
    // Binding now to be able to remove events properly
    close = close.bind(this);
    // Event listeners for modal
    this._dom.overlay.addEventListener('click', close);
    document.getElementById('options-modal-close').addEventListener('click', close);
    document.getElementById('reset-app').addEventListener('click', reset);
  }


  _stroboscopeModal() {
    // Declare range sliders to make input range touch friendly
    window.rangesliderJs.create(this._dom.stroboscope.delay, {
      value: window.localStorage.getItem('stroboscope-delay') || '50',
      onSlideEnd: value => {
        this._dom.stroboscope.delayText.innerHTML = value;
        window.localStorage.setItem('stroboscope-delay', value);
      }
    });
    // Make modal visible
    this._dom.overlay.classList.add('visible');
    this._dom.stroboscope.container.classList.add('visible');
    this._dom.stroboscope.delayText.innerHTML = window.localStorage.getItem('stroboscope-delay') || '50';

    new window.KellyColorPicker({
      place : 'stroboscope-color-picker',
      color : window.localStorage.getItem('stroboscope-color') || '#ffffff',
      changeCursor: false,
      userEvents: {
        change: self => {
          window.localStorage.setItem('stroboscope-color', self.getCurColorHex());
          document.getElementById('stroboscope-color').value = self.getCurColorHex();
        }
      }
    });
    // Close modal internal metohd
    let close = event => {
      if (event.target.id === 'stroboscope-modal-close' || event.target.id === 'modal-overlay') {
        this._dom.overlay.classList.remove('visible');
        this._dom.stroboscope.container.classList.remove('visible');
        this._dom.overlay.removeEventListener('click', close);
        document.getElementById('stroboscope-modal-close').removeEventListener('click', close);
      }
    };
    // Binding now to be able to remove events properly
    close = close.bind(this);

    document.getElementById('stroboscope-color').addEventListener('click', event => { event.preventDefault(); });
    // Event listeners for modal
    this._dom.overlay.addEventListener('click', close);
    document.getElementById('stroboscope-modal-close').addEventListener('click', close);
  }


  _colorPickerModal(color, callback) {
    // Make modal visible
    this._dom.overlay.classList.add('visible');
    this._dom.colorPicker.container.classList.add('visible');
    // Close modal internal metohd
    let close = event => {
      if (event.target.id === 'color-picker-modal-close' || event.target.id === 'modal-overlay') {
        this._dom.overlay.classList.remove('visible');
        this._dom.colorPicker.container.classList.remove('visible');
        this._dom.overlay.removeEventListener('click', close);
        document.getElementById('color-picker-modal-close').removeEventListener('click', close);
        callback(colorPicker.getCurColorHex());
      }
    };

    close = close.bind(this);

    const colorPicker = new window.KellyColorPicker({
      place : 'color-picker',
      color : color || '#ffffff',
      changeCursor: false,
      userEvents: {
        change: self => {
          document.getElementById('output-color').value = self.getCurColorHex();
        }
      }
    });

    this._dom.overlay.addEventListener('click', close);
    document.getElementById('color-picker-modal-close').addEventListener('click', close);
  }


}


export default ModalFactory;
