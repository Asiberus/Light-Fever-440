/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
window.LightFever440 =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/LightFever440.js":
/*!*****************************!*\
  !*** ./js/LightFever440.js ***!
  \*****************************/
/*! namespace exports */
/*! export default [provided] [used in main] [usage prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _iterableToArrayLimit(arr, i) { if (typeof Symbol === \"undefined\" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar LightFever440 = /*#__PURE__*/function () {\n  function LightFever440() {\n    _classCallCheck(this, LightFever440);\n\n    this._dom = {\n      toggle: document.getElementById('toggle-light-fever'),\n      manual: document.getElementById('manual-mode'),\n      analyzer: document.getElementById('analyzer-mode'),\n      selection: document.getElementById('selection-border'),\n      manualContainer: document.getElementById('manual-container'),\n      autoContainer: document.getElementById('auto-container'),\n      themeSwitch: document.getElementById('theme-switch'),\n      status: document.getElementById('status-text'),\n      manualButtons: {\n        uniform: document.getElementById('manual-uniform'),\n        chase: document.getElementById('manual-chase'),\n        rainbow: document.getElementById('manual-rainbow'),\n        rainbowChase: document.getElementById('manual-chase-rainbow')\n      },\n      autoButtons: {\n        uniform: document.getElementById('auto-uniform'),\n        progressive: document.getElementById('auto-progressive'),\n        progMirror: document.getElementById('auto-progressive-mirror')\n      },\n      globalButtons: {\n        strob: document.getElementById('global-stroboscope')\n      }\n    }; // Useful bools\n\n    this._isActive = false;\n    this._isDark = true; // Options that are sent to /action url\n\n    this._state = 'OFF';\n    this._mode = 'MANUAL';\n    this._effect = null;\n    this._options = null; // Init web view from Light Fever 440 state\n\n    this._initState(); // Make UI interactive by listening to user actions\n\n\n    this._events();\n  }\n\n  _createClass(LightFever440, [{\n    key: \"_initState\",\n    value: function _initState() {\n      var _this = this;\n\n      this.getState().then(function (response) {\n        _this._dom.status.innerHTML = 'Set Light Fever 440 state';\n        console.log(response);\n      })[\"catch\"](function (error) {\n        _this._dom.status.innerHTML = 'Unable to load state';\n      });\n    }\n  }, {\n    key: \"_events\",\n    value: function _events() {\n      this._dom.toggle.addEventListener('click', this._toggleLightFever.bind(this));\n\n      this._dom.manual.addEventListener('click', this._switchMode.bind(this));\n\n      this._dom.analyzer.addEventListener('click', this._switchMode.bind(this));\n\n      this._dom.themeSwitch.addEventListener('click', this._switchTheme.bind(this));\n\n      this._dom.manualButtons.uniform.addEventListener('click', this._updateEffect.bind(this));\n\n      this._dom.manualButtons.chase.addEventListener('click', this._updateEffect.bind(this));\n\n      this._dom.manualButtons.rainbow.addEventListener('click', this._updateEffect.bind(this));\n\n      this._dom.manualButtons.rainbowChase.addEventListener('click', this._updateEffect.bind(this));\n\n      this._dom.autoButtons.uniform.addEventListener('click', this._updateEffect.bind(this));\n\n      this._dom.autoButtons.progressive.addEventListener('click', this._updateEffect.bind(this));\n\n      this._dom.autoButtons.progMirror.addEventListener('click', this._updateEffect.bind(this));\n\n      this._dom.globalButtons.strob.addEventListener('click', this._updateEffect.bind(this));\n    }\n  }, {\n    key: \"_toggleLightFever\",\n    value: function _toggleLightFever() {\n      if (this._isActive === false) {\n        this._isActive = true;\n        this._dom.toggle.innerHTML = 'ON';\n\n        this._dom.toggle.classList.remove('light-fever-off');\n\n        this._dom.toggle.classList.add('light-fever-on');\n\n        this._startLightFever();\n      } else {\n        this._isActive = false;\n        this._dom.toggle.innerHTML = 'OFF';\n\n        this._dom.toggle.classList.remove('light-fever-on');\n\n        this._dom.toggle.classList.add('light-fever-off');\n\n        this._stopLightFever();\n      }\n    }\n  }, {\n    key: \"_startLightFever\",\n    value: function _startLightFever() {\n      var _this2 = this;\n\n      this._state = 'ON';\n      this.sendAction().then(function () {\n        _this2._dom.status.innerHTML = 'Light Fever 440 started';\n      })[\"catch\"](function () {\n        _this2._dom.status.innerHTML = 'Unable to start Light Fever 440';\n      });\n    }\n  }, {\n    key: \"_stopLightFever\",\n    value: function _stopLightFever() {\n      var _this3 = this;\n\n      this._state = 'OFF';\n      this.sendAction().then(function () {\n        _this3._dom.status.innerHTML = 'Light Fever 440 stopped';\n      })[\"catch\"](function () {\n        _this3._dom.status.innerHTML = 'Unable to stop Light Fever 440';\n      });\n    }\n  }, {\n    key: \"_switchMode\",\n    value: function _switchMode(event) {\n      var _this4 = this;\n\n      if (event.target.dataset.manual === 'false') {\n        this._dom.manual.classList.remove('selected');\n\n        this._dom.analyzer.classList.add('selected');\n\n        this._dom.selection.style.left = '50%';\n        this._dom.manualContainer.style.left = '-100%';\n        this._dom.autoContainer.style.left = '0';\n        this._mode = 'AUDIO_ANALYSE';\n        this._dom.status.innerHTML = 'Audio analyzer activated';\n      } else {\n        this._dom.analyzer.classList.remove('selected');\n\n        this._dom.manual.classList.add('selected');\n\n        this._dom.selection.style.left = '0';\n        this._dom.manualContainer.style.left = '0';\n        this._dom.autoContainer.style.left = '100%';\n        this._mode = 'MANUAL';\n        this._dom.status.innerHTML = 'Manual control activated';\n      } // Update light fever script with new internals\n\n\n      this.sendAction().then(function () {\n        _this4._dom.status.innerHTML = \"Switched to mode \".concat(_this4._mode);\n      })[\"catch\"](function () {\n        _this4._dom.status.innerHTML = 'Unable to switch mode';\n      });\n    }\n  }, {\n    key: \"_switchTheme\",\n    value: function _switchTheme(event) {\n      if (event.target.checked === true) {\n        this._isDark = false;\n        document.body.classList.remove('dark-theme');\n        document.body.classList.add('light-theme');\n        this._dom.status.innerHTML = 'Switched to light theme';\n      } else {\n        this._isDark = true;\n        document.body.classList.remove('light-theme');\n        document.body.classList.add('dark-theme');\n        this._dom.status.innerHTML = 'Switched to dark theme';\n      }\n    }\n  }, {\n    key: \"_updateEffect\",\n    value: function _updateEffect(event) {\n      var _this5 = this;\n\n      // First we unselect all buttons\n      if (this._mode === 'MANUAL') {\n        for (var _i = 0, _Object$entries = Object.entries(this._dom.manualButtons); _i < _Object$entries.length; _i++) {\n          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),\n              key = _Object$entries$_i[0],\n              value = _Object$entries$_i[1];\n\n          this._dom.manualButtons[key].classList.remove('selected');\n        }\n      } else {\n        for (var _i2 = 0, _Object$entries2 = Object.entries(this._dom.autoButtons); _i2 < _Object$entries2.length; _i2++) {\n          var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),\n              _key = _Object$entries2$_i[0],\n              _value = _Object$entries2$_i[1];\n\n          this._dom.autoButtons[_key].classList.remove('selected');\n        }\n      } // Then use target as current selection\n\n\n      event.target.classList.add('selected');\n      this._effect = event.target.dataset.effect;\n      this.sendAction().then(function () {\n        _this5._dom.status.innerHTML = \"Effect \".concat(_this5._effect, \" activated\");\n      })[\"catch\"](function () {\n        _this5._dom.status.innerHTML = \"Unable to set effect \".concat(_this5._effect);\n      });\n    }\n  }, {\n    key: \"getState\",\n    value: function getState() {\n      var _this6 = this;\n\n      return new Promise(function (resolve, reject) {\n        _this6.ajax('state').then(resolve)[\"catch\"](reject);\n      });\n    }\n  }, {\n    key: \"sendAction\",\n    value: function sendAction() {\n      var _this7 = this;\n\n      return new Promise(function (resolve, reject) {\n        _this7.ajax('action', {\n          state: _this7._state,\n          mode: _this7._mode,\n          effect: _this7._effect,\n          options: _this7._options\n        }).then(resolve)[\"catch\"](reject);\n      });\n    }\n  }, {\n    key: \"ajax\",\n    value: function ajax(url, data) {\n      return new Promise(function (resolve, reject) {\n        var options = {\n          method: data ? 'POST' : 'GET',\n          headers: new Headers([['Content-Type', 'application/json; charset=UTF-8'], ['Accept', 'application/json']]),\n          body: JSON.stringify(data)\n        };\n        fetch(url, options).then(function (response) {\n          if (response) {\n            if (response.ok) {\n              resolve(response.json());\n            } else {\n              reject(\"ERROR_\".concat(response.status));\n            }\n          } else {\n            reject('ERROR_MISSING_ARGUMENT');\n          }\n        })[\"catch\"](reject);\n      });\n    }\n  }]);\n\n  return LightFever440;\n}();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LightFever440);\n\n//# sourceURL=webpack://LightFever440/./js/LightFever440.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./js/LightFever440.js");
/******/ })()
.default;