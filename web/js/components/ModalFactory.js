class ModalFactory {


  constructor(type, options) {
    this._dom = {
      overlay: document.getElementById('modal-overlay'),
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

    if (type === 'STROBOSCOPE') {
      // Declare range sliders to make input range touch friendly
      window.rangesliderJs.create(this._dom.stroboscope.delay, { value: window.localStorage.getItem('stroboscope-delay') || '50' });
      this._stroboscopeModal();
    } else if (type === 'COLOR_PICKER') {
      this._colorPickerModal(options.color, options.callback)
    }
  }


  _stroboscopeModal() {
    // Make modal visible
    this._dom.overlay.classList.add('visible');
    this._dom.stroboscope.container.classList.add('visible');
    this._dom.stroboscope.delayText.innerHTML = window.localStorage.getItem('stroboscope-delay') || '50';
    // Update range
    let range = event => {
      this._dom.stroboscope.delayText.innerHTML = event.target.value;
      window.localStorage.setItem('stroboscope-delay', event.target.value);
    };

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
        this._dom.stroboscope.delay.removeEventListener('click', range);
        this._dom.overlay.removeEventListener('click', close);
        document.getElementById('stroboscope-modal-close').removeEventListener('click', close);
      }
    };
    // Binding now to be able to remove events properly
    range = range.bind(this);
    close = close.bind(this);

    document.getElementById('stroboscope-color').addEventListener('click', event => { event.preventDefault(); });
    // Event listeners for modal
    this._dom.stroboscope.delay.addEventListener('input', range);
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
