window.LightFever440=function(){"use strict";var e={87:function(e,t,o){function s(e,t){for(var o=0;o<t.length;o++){var s=t[o];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}o.d(t,{default:function(){return I}});var n=function(){function e(t,o){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._dom={overlay:document.getElementById("modal-overlay"),options:{container:document.getElementById("options-modal")},stroboscope:{container:document.getElementById("stroboscope-modal"),delay:document.getElementById("stroboscope-delay"),delayText:document.getElementById("stroboscope-delay-value"),color:document.getElementById("stroboscope-color")},colorPicker:{container:document.getElementById("color-picker-modal")}},"OPTIONS"===t?this._optionsModal():"STROBOSCOPE"===t?this._stroboscopeModal():"COLOR_PICKER"===t&&this._colorPickerModal(o.color,o.callback)}var t,o;return t=e,(o=[{key:"_optionsModal",value:function(){var e=this;this._dom.overlay.classList.add("visible"),this._dom.options.container.classList.add("visible");var t=function(o){"options-modal-close"!==o.target.id&&"modal-overlay"!==o.target.id||(e._dom.overlay.classList.remove("visible"),e._dom.options.container.classList.remove("visible"),e._dom.overlay.removeEventListener("click",t),document.getElementById("options-modal-close").removeEventListener("click",t))};t=t.bind(this),this._dom.overlay.addEventListener("click",t),document.getElementById("options-modal-close").addEventListener("click",t),document.getElementById("reset-app").addEventListener("click",(function(){window.localStorage.clear(),setTimeout((function(){return window.location.reload(),!1}),100)}))}},{key:"_stroboscopeModal",value:function(){var e=this;window.rangesliderJs.create(this._dom.stroboscope.delay,{value:window.localStorage.getItem("stroboscope-delay")||"50",onSlideEnd:function(t){e._dom.stroboscope.delayText.innerHTML=t,window.localStorage.setItem("stroboscope-delay",t)}}),this._dom.overlay.classList.add("visible"),this._dom.stroboscope.container.classList.add("visible"),this._dom.stroboscope.delayText.innerHTML=window.localStorage.getItem("stroboscope-delay")||"50",new window.KellyColorPicker({place:"stroboscope-color-picker",color:window.localStorage.getItem("stroboscope-color")||"#ffffff",changeCursor:!1,userEvents:{change:function(e){window.localStorage.setItem("stroboscope-color",e.getCurColorHex()),document.getElementById("stroboscope-color").value=e.getCurColorHex()}}});var t=function(o){"stroboscope-modal-close"!==o.target.id&&"modal-overlay"!==o.target.id||(e._dom.overlay.classList.remove("visible"),e._dom.stroboscope.container.classList.remove("visible"),e._dom.overlay.removeEventListener("click",t),document.getElementById("stroboscope-modal-close").removeEventListener("click",t))};t=t.bind(this),document.getElementById("stroboscope-color").addEventListener("click",(function(e){e.preventDefault()})),this._dom.overlay.addEventListener("click",t),document.getElementById("stroboscope-modal-close").addEventListener("click",t)}},{key:"_colorPickerModal",value:function(e,t){var o=this;this._dom.overlay.classList.add("visible"),this._dom.colorPicker.container.classList.add("visible");var s=function(e){"color-picker-modal-close"!==e.target.id&&"modal-overlay"!==e.target.id||(o._dom.overlay.classList.remove("visible"),o._dom.colorPicker.container.classList.remove("visible"),o._dom.overlay.removeEventListener("click",s),document.getElementById("color-picker-modal-close").removeEventListener("click",s),t(n.getCurColorHex()))};s=s.bind(this);var n=new window.KellyColorPicker({place:"color-picker",color:e||"#ffffff",changeCursor:!1,userEvents:{change:function(e){document.getElementById("output-color").value=e.getCurColorHex()}}});this._dom.overlay.addEventListener("click",s),document.getElementById("color-picker-modal-close").addEventListener("click",s)}}])&&s(t.prototype,o),e}();function i(e){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]:[255,255,255]}function a(e,t,o){return"#"+((1<<24)+(e<<16)+(t<<8)+o).toString(16).slice(1)}function c(e,t){return new Promise((function(o,s){var n={method:t?"POST":"GET",headers:new Headers([["Content-Type","application/json; charset=UTF-8"],["Accept","application/json"]]),body:JSON.stringify(t)};fetch(e,n).then((function(e){e?e.ok?o(e.json()):s("ERROR_".concat(e.status)):s("ERROR_MISSING_ARGUMENT")})).catch(s)}))}function l(e,t){return new n("COLOR_PICKER",{color:e,callback:function(e){t(e)}})}function r(e,t){for(var o=0;o<t.length;o++){var s=t[o];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}var d=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._scope=t.scope,this._update=t.update}var t,o;return t=e,(o=[{key:"new",value:function(e,t){"CLICK"===e?this._clickEvent(t):"SWITCH"===e?this._createSwitch(t):"SLIDER"===e?this._createSlider(t):"COLOR"===e?this._createColor(t):"COLOR_OVERRIDE"===e?this._createColorOverride(t):"SWITCH_OVERRIDE"===e&&this._createSwitchOverride(t)}},{key:"_clickEvent",value:function(e){this._event("click",e,!1)}},{key:"_createSwitch",value:function(e){e.element.checked="true"===window.localStorage.getItem(e.lsKey),this._event("change",e,!0,!0)}},{key:"_event",value:function(e,t,o){var s=this,n=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];t.element.addEventListener(e,(function(){!0===o&&(!0===n?window.localStorage.setItem(t.lsKey,t.element.checked):window.localStorage.setItem(t.lsKey,t.element.value)),s._update.call(s._scope,t.effect)}))}},{key:"_createSlider",value:function(e){var t=this;e.label.innerHTML=window.localStorage.getItem(e.lsKey)||e.default,window.rangesliderJs.create(e.element,{value:window.localStorage.getItem(e.lsKey)||e.default,onSlideEnd:function(o){t._changeEventLock=!0,window.localStorage.setItem(e.lsKey,o),e.label.innerHTML=o,t._update.call(t._scope,e.effect)}})}},{key:"_createColor",value:function(e){var t=this;e.element.value=window.localStorage.getItem(e.lsKey)||e.default,e.element.addEventListener("click",(function(o){o.preventDefault(),l(window.localStorage.getItem(e.lsKey),(function(o){window.localStorage.setItem(e.lsKey,o),e.element.value=o,t._update.call(t._scope,e.effect)}))}))}},{key:"_createColorOverride",value:function(e){var t=this;e.element.checked="true"===window.localStorage.getItem("".concat(e.lsKey,"-switch")),!0===e.element.checked&&(e.color.parentNode.style.filter="opacity(1)"),this._event("change",e,!1),e.element.addEventListener("input",(function(){window.localStorage.setItem("".concat(e.lsKey,"-switch"),e.element.checked),!0===e.element.checked?e.color.parentNode.style.filter="opacity(1)":e.color.parentNode.style.filter="opacity(0.1)"})),e.color.value=window.localStorage.getItem(e.lsKey)||e.default,e.color.addEventListener("click",(function(o){o.preventDefault(),!0===e.element.checked&&l(window.localStorage.getItem(e.lsKey),(function(o){window.localStorage.setItem(e.lsKey,o),e.color.value=o,t._update.call(t._scope,e.effect)}))}))}},{key:"_createSwitchOverride",value:function(e){var t=this;e.element.checked="true"===window.localStorage.getItem("".concat(e.lsKeySwitch)),!0===e.element.checked&&(e.color.parentNode.style.filter="opacity(0.1)"),this._event("change",e,!1),e.element.addEventListener("input",(function(){window.localStorage.setItem("".concat(e.lsKeySwitch),e.element.checked),!1===e.element.checked?e.color.parentNode.style.filter="opacity(1)":e.color.parentNode.style.filter="opacity(0.1)"})),e.color.value=window.localStorage.getItem(e.lsKey)||e.default,e.color.addEventListener("click",(function(o){o.preventDefault(),!1===e.element.checked&&l(window.localStorage.getItem(e.lsKey),(function(o){window.localStorage.setItem(e.lsKey,o),e.color.value=o,t._update.call(t._scope,e.effect)}))}))}}])&&r(t.prototype,o),e}();function u(e,t){for(var o=0;o<t.length;o++){var s=t[o];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}var m=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._type=t.type.toLowerCase(),this._getOptions=t.getOptions,this._applyPresetOptions=t.applyPresetOptions,this._presets={slots:[document.getElementById("".concat(this._type,"-preset0")),document.getElementById("".concat(this._type,"-preset1")),document.getElementById("".concat(this._type,"-preset2")),document.getElementById("".concat(this._type,"-preset3")),document.getElementById("".concat(this._type,"-preset4")),document.getElementById("".concat(this._type,"-preset5")),document.getElementById("".concat(this._type,"-preset6"))],save:document.getElementById("".concat(this._type,"-preset-save")),del:document.getElementById("".concat(this._type,"-preset-del")),selected:null,count:0},this._isDelDisabled=!0,this._initEvents(),this._initPresets(t.effect)}var t,o;return t=e,(o=[{key:"_initEvents",value:function(){this._presets.save.addEventListener("click",this._savePreset.bind(this)),this._presets.del.addEventListener("click",this._deletePreset.bind(this));for(var e=0;e<this._presets.slots.length;++e)this._presets.slots[e].addEventListener("click",this._selectPreset.bind(this))}},{key:"_initPresets",value:function(e){this._presets.selected=null,this._isSaveDisabled=!1,this._isDelDisabled=!0,this._presets.del.style.filter="opacity(0.1)";for(var t=0;t<this._presets.slots.length;++t)null!==window.localStorage.getItem("".concat(this._type,"-").concat(e.toLowerCase(),"-preset-").concat(t))?(this._presets.slots[t].classList.add("saved"),this._presets.slots[t].innerHTML=t+1,++this._presets.count):(this._presets.slots[t].classList.remove("saved"),this._presets.slots[t].classList.remove("selected"),this._presets.slots[t].innerHTML="")}},{key:"_savePreset",value:function(){var e=this,t=function(t){window.localStorage.setItem("".concat(e._type,"-").concat(window.LF440.effect.toLowerCase(),"-preset-").concat(t),JSON.stringify(e._getOptions())),window.LF440.status="".concat(window.LF440.effect," preset ").concat(t+1," saved"),e._presets.slots[t].classList.add("saved"),e._presets.slots[t].innerHTML=parseInt(t)+1,e._presets.selected=e._presets.slots[t],e._isDelDisabled=!1,e._presets.del.style.filter="opacity(1)",++e._presets.count};if(this._presets.selected)t(parseInt(this._presets.selected.dataset.index));else for(var o=0;o<this._presets.slots.length;++o)if(!this._presets.slots[o].classList.contains("saved"))return this._presets.slots[o].classList.add("selected"),void t(o)}},{key:"_deletePreset",value:function(){this._presets.selected&&!1===this._isDelDisabled&&(window.localStorage.removeItem("".concat(this._type,"-").concat(window.LF440.effect.toLowerCase(),"-preset-").concat(this._presets.selected.dataset.index)),window.LF440.status="".concat(window.LF440.effect," preset ").concat(parseInt(this._presets.selected.dataset.index)+1," deleted"),this._presets.slots[this._presets.selected.dataset.index].innerHTML="",this._presets.selected.classList.remove("saved"),this._presets.selected.classList.remove("selected"),--this._presets.count,this._presets.selected=null,this._isDelDisabled=!0,this._presets.del.style.filter="opacity(0.1)")}},{key:"_selectPreset",value:function(e){for(var t=0;t<this._presets.slots.length;++t)this._presets.slots[t].classList.remove("selected");this._presets.selected=e.target,this._presets.selected.classList.add("selected");var o=JSON.parse(window.localStorage.getItem("".concat(this._type,"-").concat(window.LF440.effect.toLowerCase(),"-preset-").concat(e.target.dataset.index)));o?(this._applyPresetOptions(o),window.LF440.status="Apply ".concat(window.LF440.effect," preset ").concat(parseInt(e.target.dataset.index)+1),this._isDelDisabled=!1,this._presets.del.style.filter="opacity(1)"):(this._isDelDisabled=!0,this._presets.del.style.filter="opacity(0.1)")}},{key:"initPresets",value:function(e){this._initPresets(e)}}])&&u(t.prototype,o),e}();function h(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var o=[],s=!0,n=!1,i=void 0;try{for(var a,c=e[Symbol.iterator]();!(s=(a=c.next()).done)&&(o.push(a.value),!t||o.length!==t);s=!0);}catch(e){n=!0,i=e}finally{try{s||null==c.return||c.return()}finally{if(n)throw i}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return f(e,t);var o=Object.prototype.toString.call(e).slice(8,-1);return"Object"===o&&e.constructor&&(o=e.constructor.name),"Map"===o||"Set"===o?Array.from(e):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?f(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,s=new Array(t);o<t;o++)s[o]=e[o];return s}function p(e,t){for(var o=0;o<t.length;o++){var s=t[o];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}var _=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._dom={UNIFORM:{button:document.getElementById("manual-uniform"),container:document.getElementById("manual-uniform-options"),color:document.getElementById("manual-uniform-color"),waveDelta:document.getElementById("manual-uniform-wave-delta"),waveDeltaText:document.getElementById("manual-uniform-wave-delta-value")},CHASE:{button:document.getElementById("manual-chase"),container:document.getElementById("manual-chase-options"),color:document.getElementById("manual-chase-color"),speed:document.getElementById("manual-chase-speed"),speedText:document.getElementById("manual-chase-speed-value"),size:document.getElementById("manual-chase-size"),sizeText:document.getElementById("manual-chase-size-value"),spacing:document.getElementById("manual-chase-spacing"),spacingText:document.getElementById("manual-chase-spacing-value"),rainbow:document.getElementById("manual-chase-rainbow")},RAINBOW:{button:document.getElementById("manual-rainbow"),container:document.getElementById("manual-rainbow-options"),speed:document.getElementById("manual-rainbow-speed"),speedText:document.getElementById("manual-rainbow-speed-value")}},this._inputFactory=new d({scope:this,update:this._updateEffect}),this._presetManager=new m({type:"MANUAL",effect:"UNIFORM",getOptions:this.getOptions.bind(this),applyPresetOptions:this._applyPresetOptions.bind(this)}),this._initEvents()}var t,o;return t=e,(o=[{key:"_initEvents",value:function(){this._inputFactory.new("CLICK",{effect:"UNIFORM",element:this._dom.UNIFORM.button}),this._inputFactory.new("COLOR",{effect:"UNIFORM",element:this._dom.UNIFORM.color,default:"#FFFFFF",lsKey:"manual-uniform-color"}),this._inputFactory.new("SLIDER",{effect:"UNIFORM",element:this._dom.UNIFORM.waveDelta,label:this._dom.UNIFORM.waveDeltaText,default:"0",lsKey:"manual-uniform-wave-delta"}),this._inputFactory.new("CLICK",{effect:"CHASE",element:this._dom.CHASE.button}),this._inputFactory.new("SWITCH_OVERRIDE",{effect:"CHASE",element:this._dom.CHASE.rainbow,color:this._dom.CHASE.color,default:"#FFFFFF",lsKey:"manual-chase-color",lsKeySwitch:"manual-chase-rainbow"}),this._inputFactory.new("SLIDER",{effect:"CHASE",element:this._dom.CHASE.speed,label:this._dom.CHASE.speedText,default:"50",lsKey:"manual-chase-speed"}),this._inputFactory.new("SLIDER",{effect:"CHASE",element:this._dom.CHASE.size,label:this._dom.CHASE.sizeText,default:"1",lsKey:"manual-chase-size"}),this._inputFactory.new("SLIDER",{effect:"CHASE",element:this._dom.CHASE.spacing,label:this._dom.CHASE.spacingText,default:"2",lsKey:"manual-chase-spacing"}),this._inputFactory.new("CLICK",{effect:"RAINBOW",element:this._dom.RAINBOW.button}),this._inputFactory.new("SLIDER",{effect:"RAINBOW",element:this._dom.RAINBOW.speed,label:this._dom.RAINBOW.speedText,default:"50",lsKey:"manual-rainbow-speed"})}},{key:"_updateEffect",value:function(e){e!==window.LF440.effect&&(this._unselectAllEffect(),window.LF440.effect=e,this._dom[window.LF440.effect].container.style.display="block",this._dom[window.LF440.effect].button.classList.add("selected"),this._presetManager.initPresets(window.LF440.effect)),!0===window.LF440.isActive?window.LF440.sendAction().then((function(){window.LF440.status="Effect ".concat(window.LF440.effect," activated"),console.log("ManualController : Successfully activate effect ".concat(window.LF440.effect))})).catch((function(){window.LF440.status="Unable to set effect ".concat(window.LF440.effect),console.error("ManualController : Failed to activate effect ".concat(window.LF440.effect))})):(window.LF440.status="Please start LightFever440",console.error("ManualController : Failed to activate effect ".concat(window.LF440.effect,", LightFever440 isn't activated")))}},{key:"_unselectAllEffect",value:function(){for(var e=0,t=Object.entries(this._dom);e<t.length;e++){var o=h(t[e],1)[0];this._dom[o].button.classList.remove("selected"),this._dom[o].container.style.display="none"}}},{key:"_applyPresetOptions",value:function(e){"UNIFORM"===window.LF440.effect?(this._dom.UNIFORM.color.value=a(e.color[0],e.color[1],e.color[2]),this._dom.UNIFORM.waveDelta["rangeslider-js"].update({value:e.waveDelta})):"CHASE"===window.LF440.effect?(this._dom.CHASE.speed["rangeslider-js"].update({value:e.speed}),this._dom.CHASE.size["rangeslider-js"].update({value:e.size}),this._dom.CHASE.spacing["rangeslider-js"].update({value:e.spacing}),!0===e.rainbow?(this._dom.CHASE.rainbow.checked=e.rainbow,this._dom.CHASE.color.parentNode.style.filter="opacity(0.1)"):(this._dom.CHASE.rainbow.checked=!1,this._dom.CHASE.color.value=a(e.color[0],e.color[1],e.color[2]),this._dom.CHASE.color.parentNode.style.filter="opacity(1)")):"RAINBOW"===window.LF440.effect&&this._dom.RAINBOW.speed["rangeslider-js"].update({value:e.speed})}},{key:"initEffect",value:function(e){this._unselectAllEffect(),this._dom[e].button.classList.add("selected"),this._dom[e].container.style.display="block"}},{key:"getActiveEffect",value:function(){for(var e=0,t=Object.entries(this._dom);e<t.length;e++){var o=h(t[e],1)[0];if(this._dom[o].button.classList.contains("selected"))return this._dom[o].container.style.display="block",this._dom[o].button.dataset.effect}return"UNIFORM"}},{key:"getOptions",value:function(){var e={};return"UNIFORM"===window.LF440.effect?e={color:i(window.localStorage.getItem("manual-uniform-color")),waveDelta:parseInt(this._dom.UNIFORM.waveDelta.value)}:"CHASE"===window.LF440.effect?(e={color:i(window.localStorage.getItem("manual-chase-color")),speed:parseInt(this._dom.CHASE.speed.value),size:parseInt(this._dom.CHASE.size.value),spacing:parseInt(this._dom.CHASE.spacing.value)},!0===this._dom.CHASE.rainbow.checked&&(delete e.color,e.rainbow=this._dom.CHASE.rainbow.checked)):"RAINBOW"===window.LF440.effect&&(e={speed:parseInt(this._dom.RAINBOW.speed.value)}),e}}])&&p(t.prototype,o),e}();function v(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var o=[],s=!0,n=!1,i=void 0;try{for(var a,c=e[Symbol.iterator]();!(s=(a=c.next()).done)&&(o.push(a.value),!t||o.length!==t);s=!0);}catch(e){n=!0,i=e}finally{try{s||null==c.return||c.return()}finally{if(n)throw i}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return y(e,t);var o=Object.prototype.toString.call(e).slice(8,-1);return"Object"===o&&e.constructor&&(o=e.constructor.name),"Map"===o||"Set"===o?Array.from(e):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?y(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function y(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,s=new Array(t);o<t;o++)s[o]=e[o];return s}function g(e,t){for(var o=0;o<t.length;o++){var s=t[o];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}var w=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._dom={UNIFORM:{button:document.getElementById("auto-uniform"),container:document.getElementById("auto-uniform-options"),peakSensitivity:document.getElementById("auto-uniform-peak-sensitivity"),peakSensitivityText:document.getElementById("auto-uniform-peak-sensitivity-value"),colorSwitch:document.getElementById("auto-uniform-color-switch"),color:document.getElementById("auto-uniform-color")},PROGRESSIVE:{button:document.getElementById("auto-progressive"),container:document.getElementById("auto-progressive-options"),size:document.getElementById("auto-progressive-size"),sizeText:document.getElementById("auto-progressive-size-value"),reverse:document.getElementById("auto-progressive-reverse")},PULSE:{button:document.getElementById("auto-pulse"),container:document.getElementById("auto-pulse-options"),maxLength:document.getElementById("auto-pulse-length"),maxLengthText:document.getElementById("auto-pulse-length-value"),colorSwitch:document.getElementById("auto-pulse-color-switch"),color:document.getElementById("auto-pulse-color")}},this._inputFactory=new d({scope:this,update:this._updateEffect}),this._presetManager=new m({type:"AUTO",effect:"UNIFORM",getOptions:this.getOptions.bind(this),applyPresetOptions:this._applyPresetOptions.bind(this)}),this._initEvents()}var t,o;return t=e,(o=[{key:"_initEvents",value:function(){this._inputFactory.new("CLICK",{effect:"UNIFORM",element:this._dom.UNIFORM.button}),this._inputFactory.new("SLIDER",{effect:"UNIFORM",element:this._dom.UNIFORM.peakSensitivity,label:this._dom.UNIFORM.peakSensitivityText,default:"0",lsKey:"auto-uniform-peak-sensitivity"}),this._inputFactory.new("COLOR_OVERRIDE",{effect:"UNIFORM",element:this._dom.UNIFORM.colorSwitch,color:this._dom.UNIFORM.color,default:"#FFFFFF",lsKey:"auto-uniform-color"}),this._inputFactory.new("CLICK",{effect:"PROGRESSIVE",element:this._dom.PROGRESSIVE.button}),this._inputFactory.new("SWITCH",{effect:"PROGRESSIVE",element:this._dom.PROGRESSIVE.reverse,lsKey:"auto-progressive-reverse"}),this._inputFactory.new("SLIDER",{effect:"PROGRESSIVE",element:this._dom.PROGRESSIVE.size,label:this._dom.PROGRESSIVE.sizeText,default:"5",lsKey:"auto-progressive-size"}),this._inputFactory.new("CLICK",{effect:"PULSE",element:this._dom.PULSE.button}),this._inputFactory.new("SLIDER",{effect:"PULSE",element:this._dom.PULSE.maxLength,label:this._dom.PULSE.maxLengthText,default:"100",lsKey:"auto-pulse-length"}),this._inputFactory.new("COLOR_OVERRIDE",{effect:"PULSE",element:this._dom.PULSE.colorSwitch,color:this._dom.PULSE.color,default:"#FFFFFF",lsKey:"auto-pulse-color"})}},{key:"_updateEffect",value:function(e){e!==window.LF440.effect&&(this._unselectAllEffect(),window.LF440.effect=e,this._dom[window.LF440.effect].container.style.display="block",this._dom[window.LF440.effect].button.classList.add("selected"),this._presetManager.initPresets(window.LF440.effect)),!0===window.LF440.isActive?window.LF440.sendAction().then((function(){window.F440.status="Effect ".concat(window.LF440.effect," activated"),console.log("AnalyzerController : Successfully activate effect ".concat(window.LF440.effect))})).catch((function(){window.LF440.status="Unable to set effect ".concat(window.LF440.effect),console.error("AnalyzerController : Failed to activate effect ".concat(window.LF440.effect))})):(window.LF440.status="Please start LightFever440",console.error("AnalyzerController : Failed to activate effect ".concat(window.LF440.effect,", LightFever440 isn't activated")))}},{key:"_unselectAllEffect",value:function(){for(var e=0,t=Object.entries(this._dom);e<t.length;e++){var o=v(t[e],1)[0];this._dom[o].button.classList.remove("selected"),this._dom[o].container.style.display="none"}}},{key:"_applyPresetOptions",value:function(e){"UNIFORM"===window.LF440.effect?(this._dom.UNIFORM.peakSensitivity["rangeslider-js"].update({value:100*e.peakSensitivity}),e.color?(this._dom.UNIFORM.colorSwitch.checked=!0,this._dom.UNIFORM.color.parentNode.style.filter="opacity(1)"):(this._dom.UNIFORM.colorSwitch.checked=!1,this._dom.UNIFORM.color.parentNode.style.filter="opacity(0.1)")):"PROGRESSIVE"===window.LF440.effect?(this._dom.PROGRESSIVE.size["rangeslider-js"].update({value:e.size}),!0===e.reverse?this._dom.PROGRESSIVE.reverse.checked=!0:this._dom.PROGRESSIVE.reverse.checked=!1):"PULSE"===window.LF440.effect&&(this._dom.PULSE.maxLength["rangeslider-js"].update({value:100*e.size}),e.color?(this._dom.PULSE.colorSwitch.checked=!0,this._dom.PULSE.color.parentNode.style.filter="opacity(1)"):(this._dom.PULSE.colorSwitch.checked=!1,this._dom.PULSE.color.parentNode.style.filter="opacity(0.1)"))}},{key:"initEffect",value:function(e){this._unselectAllEffect(),this._dom[e].button.classList.add("selected"),this._dom[e].container.style.display="block"}},{key:"getActiveEffect",value:function(){for(var e=0,t=Object.entries(this._dom);e<t.length;e++){var o=v(t[e],1)[0];if(this._dom[o].button.classList.contains("selected"))return this._dom[o].container.style.display="block",this._dom[o].button.dataset.effect}return"UNIFORM"}},{key:"getOptions",value:function(){var e={};return"UNIFORM"===window.LF440.effect?(e={peakSensitivity:parseInt(this._dom.UNIFORM.peakSensitivity.value)/100},this._dom.UNIFORM.colorSwitch.checked&&(e.color=i(this._dom.UNIFORM.color.value))):"PROGRESSIVE"===window.LF440.effect?e={size:parseInt(this._dom.PROGRESSIVE.size.value),reverse:this._dom.PROGRESSIVE.reverse.checked}:"PULSE"===window.LF440.effect&&(e={max:parseInt(this._dom.PULSE.maxLength.value)/100},this._dom.PULSE.colorSwitch.checked&&(e.color=i(this._dom.PULSE.color.value))),e}}])&&g(t.prototype,o),e}();function E(e,t){for(var o=0;o<t.length;o++){var s=t[o];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}var L=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.VERSION="0.0.1",this._dom={title:document.getElementById("title"),version:document.getElementById("version"),appOptions:document.getElementById("app-options"),toggle:document.getElementById("toggle-light-fever"),manual:document.getElementById("manual-mode"),analyzer:document.getElementById("analyzer-mode"),selection:document.getElementById("selection-border"),manualContainer:document.getElementById("manual-container"),autoContainer:document.getElementById("auto-container"),themeSwitch:document.getElementById("theme-switch"),status:document.getElementById("status-text"),globalButtons:{STROBOSCOPE:document.getElementById("global-stroboscope"),strobOpts:document.getElementById("stroboscope-opts")}},this._isActive=!1,this._isDark=!0,this._previousEffect=null,this._previousMode=null,this._state="OFF",this._mode="MANUAL",this._effect="UNIFORM",this._options=null,this._mc=new _,this._ac=new w,console.log("LightFever440.js - Version ".concat(this.VERSION)),this._initEvents(),this._initState()}var t,o;return t=e,(o=[{key:"_initEvents",value:function(){this._dom.appOptions.addEventListener("click",this._appOptionsModal.bind(this)),this._dom.toggle.addEventListener("click",this._toggleLightFever.bind(this)),this._dom.manual.addEventListener("click",this._switchMode.bind(this)),this._dom.analyzer.addEventListener("click",this._switchMode.bind(this)),this._dom.themeSwitch.addEventListener("click",this._switchTheme.bind(this)),this._dom.globalButtons.STROBOSCOPE.addEventListener("touchstart",this._startStroboscope.bind(this)),this._dom.globalButtons.STROBOSCOPE.addEventListener("touchend",this._stopStroboscope.bind(this)),this._dom.globalButtons.strobOpts.addEventListener("click",this._stroboscopeModal.bind(this))}},{key:"_initState",value:function(){var e=this;"light"===window.localStorage.getItem("theme")&&(this._isDark=!1,document.body.classList.remove("dark-theme"),document.body.classList.add("light-theme"),this._dom.themeSwitch.checked=!0,this._dom.status.innerHTML="Switched to light theme"),this._dom.version.innerHTML=this.VERSION,this._getState().then((function(t){e._dom.status.innerHTML="Set Light Fever 440 state","ON"===t.state&&(e._state="ON",e._isActive=!0,e._dom.toggle.innerHTML="ON",e._dom.toggle.classList.remove("light-fever-off"),e._dom.toggle.classList.add("light-fever-on")),"AUDIO_ANALYSE"===t.mode&&(e._mode="AUDIO_ANALYSE",e._dom.manual.classList.remove("selected"),e._dom.analyzer.classList.add("selected"),e._dom.selection.style.left="50%",e._dom.manualContainer.style.left="-100%",e._dom.autoContainer.style.left="0"),"UNIFORM"!==t.effect&&("MANUAL"===e._mode?e._mc.initEffect(t.effect):e._ac.initEffect(t.effect)),e._effect=t.effect,console.log("LightFever440 : Light system state properly loaded")})).catch((function(t){e._dom.status.innerHTML="Unable to load state",console.error("LightFever440 : Unable to load light system state",t)}))}},{key:"_toggleLightFever",value:function(){!1===this._isActive?(this._isActive=!0,this._startLightFever()):(this._isActive=!1,this._stopLightFever())}},{key:"_startLightFever",value:function(){var e=this;this._dom.title.classList.add("animated"),this._dom.version.classList.add("animated"),this._dom.manual.classList.add("animated"),this._dom.analyzer.classList.add("animated"),this._state="ON",this.sendAction().then((function(){e._dom.status.innerHTML="Light Fever 440 started",console.log("LightFever440 : Light system successfully started")})).catch((function(t){e._dom.status.innerHTML="Unable to start Light Fever 440",console.error("LightFever440 : Unable to start light system",t)}))}},{key:"_stopLightFever",value:function(){var e=this;this._dom.title.classList.remove("animated"),this._dom.version.classList.remove("animated"),this._dom.manual.classList.remove("animated"),this._dom.analyzer.classList.remove("animated"),this._state="OFF",this.sendAction().then((function(){e._dom.status.innerHTML="Light Fever 440 stopped",console.log("LightFever440 : Light system successfully stopped")})).catch((function(t){e._dom.status.innerHTML="Unable to stop Light Fever 440",console.error("LightFever440 : Unable to stop light system",t)}))}},{key:"_switchMode",value:function(e){var t=this;"false"===e.target.dataset.manual?(this._dom.manual.classList.remove("selected"),this._dom.analyzer.classList.add("selected"),this._dom.selection.style.left="50%",this._dom.manualContainer.style.left="-100%",this._dom.autoContainer.style.left="0",this._mode="AUDIO_ANALYSE",this._dom.status.innerHTML="Audio analyzer activated",this._effect=this._ac.getActiveEffect()):(this._dom.analyzer.classList.remove("selected"),this._dom.manual.classList.add("selected"),this._dom.selection.style.left="0",this._dom.manualContainer.style.left="0",this._dom.autoContainer.style.left="100%",this._mode="MANUAL",this._dom.status.innerHTML="Manual control activated",this._effect=this._mc.getActiveEffect()),!0===this._isActive&&this.sendAction().then((function(){t._dom.status.innerHTML="Switched to mode ".concat(t._mode),console.log("LightFever440 : Light system mode successfully switched")})).catch((function(e){t._dom.status.innerHTML="Unable to switch mode",console.error("LightFever440 : Unable to switch the light system mode",e)}))}},{key:"_startStroboscope",value:function(e){var t=this;"global-stroboscope"===e.target.id&&(e.preventDefault(),this._dom.globalButtons.STROBOSCOPE.classList.add("selected"),this._previousMode=this._mode,this._previousEffect=this._effect,this._mode="MANUAL",this._effect="STROBOSCOPE",!0===this._isActive&&this.sendAction().then((function(){t._dom.status.innerHTML="Stroboscope activated",console.log("LightFever440 : Light system stroboscope successfully started")})).catch((function(e){t._dom.status.innerHTML="Unable to start stroboscope",console.error("LightFever440 : Unable to start the stroboscope effect",e)})))}},{key:"_stopStroboscope",value:function(e){var t=this;e.preventDefault(),"global-stroboscope"===e.target.id&&(this._dom.globalButtons.STROBOSCOPE.classList.remove("selected"),this._mode=this._previousMode,this._effect=this._previousEffect,this._previousMode=null,this._previousEffect=null,!0===this._isActive&&this.sendAction().then((function(){t._dom.status.innerHTML="Stroboscope deactivated",console.log("LightFever440 : Light system stroboscope successfully stopped")})).catch((function(e){t._dom.status.innerHTML="Unable to stop stroboscope",console.error("LightFever440 : Unable to stop the stroboscope effect",e)})))}},{key:"_setOptionsForEffect",value:function(){"MANUAL"===this._mode?this._options=this._mc.getOptions():this._options=this._ac.getOptions(),"STROBOSCOPE"===this._effect&&(this._options={color:i(window.localStorage.getItem("stroboscope-color")),delay:parseInt(window.localStorage.getItem("stroboscope-delay"))||50}),console.log("LightFever440 : State ".concat(this._state,", Mode ").concat(this._mode,", Effect ").concat(this._effect,", Options"),this._options)}},{key:"_switchTheme",value:function(e){!0===e.target.checked?(this._isDark=!1,document.body.classList.remove("dark-theme"),document.body.classList.add("light-theme"),this._dom.status.innerHTML="Switched to light theme",window.localStorage.setItem("theme","light")):(this._isDark=!0,document.body.classList.remove("light-theme"),document.body.classList.add("dark-theme"),this._dom.status.innerHTML="Switched to dark theme",window.localStorage.setItem("theme","dark"))}},{key:"_appOptionsModal",value:function(){new n("OPTIONS")}},{key:"_stroboscopeModal",value:function(){new n("STROBOSCOPE")}},{key:"_getState",value:function(){return new Promise((function(e,t){c("state").then(e).catch(t)}))}},{key:"sendAction",value:function(){var e=this;return new Promise((function(t,o){e._setOptionsForEffect(),c("action",{state:e._state,mode:e._mode,effect:e._effect,options:e._options}).then(t).catch(o).finally((function(){e._options=null}))}))}},{key:"isActive",get:function(){return this._isActive}},{key:"effect",get:function(){return this._effect},set:function(e){this._effect=e}},{key:"status",set:function(e){this._dom.status.innerHTML=e}}])&&E(t.prototype,o),e}();window.LF440=new L;var I=L}},t={};function o(s){if(t[s])return t[s].exports;var n=t[s]={exports:{}};return e[s](n,n.exports,o),n.exports}return o.d=function(e,t){for(var s in t)o.o(t,s)&&!o.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o(87)}().default;