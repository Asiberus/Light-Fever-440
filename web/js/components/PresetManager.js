class PresetManager {


  constructor(options) {
    this._type = options.type.toLowerCase();
    this._getOptions = options.getOptions;
    this._applyPresetOptions = options.applyPresetOptions;

    this._presets = {
      slots: [
        document.getElementById(`${this._type}-preset0`),
        document.getElementById(`${this._type}-preset1`),
        document.getElementById(`${this._type}-preset2`),
        document.getElementById(`${this._type}-preset3`),
        document.getElementById(`${this._type}-preset4`),
        document.getElementById(`${this._type}-preset5`),
        document.getElementById(`${this._type}-preset6`)
      ],
      save: document.getElementById(`${this._type}-preset-save`),
      del: document.getElementById(`${this._type}-preset-del`),
      selected: null
    };

    this._initEvents();
    this._initPresets(options.effect);
  }


  _initEvents() {
    /* Preset events */
    this._presets.save.addEventListener('click', this._savePreset.bind(this));
    this._presets.del.addEventListener('click', this._deletePreset.bind(this));
    for (let i = 0; i < this._presets.slots.length; ++i) {
      this._presets.slots[i].addEventListener('click', this._selectPreset.bind(this));
    }
  }


  _initPresets(effect) {
    for (let i = 0; i < this._presets.slots.length; ++i) {
      if (window.localStorage.getItem(`${this._type}-${effect.toLowerCase()}-preset-${i}`) !== null) {
        this._presets.slots[i].classList.add('saved');
        this._presets.slots[i].innerHTML = i + 1;
      } else {
        this._presets.slots[i].classList.remove('saved');
        this._presets.slots[i].classList.remove('selected');
        this._presets.slots[i].innerHTML = '';
      }
    }
  }


  _savePreset() {
    const save = index => {
      this._presets.slots[index].classList.add('saved');
      this._presets.slots[index].innerHTML = parseInt(index) + 1;
      window.localStorage.setItem(`${this._type}-${window.LF440.effect.toLowerCase()}-preset-${index}`, JSON.stringify(this._getOptions()));
    };

    if (this._presets.selected) {
      save(parseInt(this._presets.selected.dataset.index));
    } else {
      for (let i = 0; i < this._presets.slots.length; ++i) {
        if (!this._presets.slots[i].classList.contains('saved')) {
          save(i);
          // TODO status
          return;
        }
      }
    }
  }


  _deletePreset() {
    if (this._presets.selected) {
      window.localStorage.removeItem(`${this._type}-${window.LF440.effect.toLowerCase()}-preset-${this._presets.selected.dataset.index}`);
      this._presets.slots[this._presets.selected.dataset.index].innerHTML = '';
      this._presets.selected.classList.remove('saved');
      this._presets.selected.classList.remove('selected');
      this._presets.selected = null;
      // TODO status
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
    const options = JSON.parse(window.localStorage.getItem(`${this._type}-${window.LF440.effect.toLowerCase()}-preset-${event.target.dataset.index}`));
    if (options) {
      this._applyPresetOptions(options);
      this._updateEffect(window.LF440.effect);
    }
  }


  initPresets(effect) {
    this._initPresets(effect);
  }


}


export default PresetManager;
