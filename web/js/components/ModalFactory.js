class ModalFactory {


  constructor(type, options) {
    this._dom = {
      overlay: document.getElementById('modal-overlay'),
      stroboscope: {
        container: document.getElementById('stroboscope-modal'),
        delay: document.getElementById('strob-delay'),
        delayText: document.getElementById('strob-delay-value'),
        color: document.getElementById('strob-color')
      },
      colorPicker: {
        container: document.getElementById('color-picker-modal'),
      }
    };

    if (type === 'STROBOSCOPE') {
      // Declare range sliders to make input range touch friendly
      rangesliderJs.create(this._dom.stroboscope.delay, { value: window.localStorage.getItem('strob-delay') || '50' });
      this._stroboscopeModal();
    } else if (type === 'COLOR_PICKER') {
      this._colorPickerModal(options.localStorageKey, options.callback)
    }
  }


  _stroboscopeModal() {
    // Make modal visible
    this._dom.overlay.classList.add('visible');
    this._dom.stroboscope.container.classList.add('visible');
    // Update range
    let range = event => {
      this._dom.stroboscope.delayText.innerHTML = event.target.value;
      window.localStorage.setItem('strob-delay', event.target.value);
    };
    // Close modal internal metohd
    let close = event => {
      if (event.target.id === 'strob-modal-close' || event.target.id === 'modal-overlay') {
        this._dom.overlay.classList.remove('visible');
        this._dom.stroboscope.container.classList.remove('visible');
        this._dom.stroboscope.delay.removeEventListener('click', range);
        this._dom.overlay.removeEventListener('click', close);
        document.getElementById('strob-modal-close').removeEventListener('click', close);
      }
    };
    // Binding now to be able to remove events properly
    range = range.bind(this);
    close = close.bind(this);

    const colorPicker = new KellyColorPicker({
      place : 'strob-color-picker',
      color : window.localStorage.getItem('strob-color') || '#ffffff',
      changeCursor: false,
      userEvents: {
        change: self => {
          const color = self.getCurColorRgb();
          window.localStorage.setItem('strob-color', self.getCurColorHex());
          document.getElementById('strob-color').value = self.getCurColorHex();
        }
      }
    });
    document.getElementById('strob-color').addEventListener('click', event => { event.preventDefault(); });
    // Event listeners for modal
    this._dom.stroboscope.delay.addEventListener('input', range);
    this._dom.overlay.addEventListener('click', close);
    document.getElementById('strob-modal-close').addEventListener('click', close);
  }


  _colorPickerModal(localStorageKey, callback) {
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

    const colorPicker = new KellyColorPicker({
      place : 'color-picker',
      color : window.localStorage.getItem(localStorageKey) || '#ffffff',
      changeCursor: false,
      userEvents: {
        change: self => {
          const color = self.getCurColorRgb();
          window.localStorage.setItem(localStorageKey, self.getCurColorHex());
          document.getElementById('output-color').value = self.getCurColorHex();
        }
      }
    });

    this._dom.overlay.addEventListener('click', close);
    document.getElementById('color-picker-modal-close').addEventListener('click', close);
  }


}


export default ModalFactory;
