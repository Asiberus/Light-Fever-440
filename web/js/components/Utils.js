import ModalFactory from './ModalFactory.js';


export const CONST = {
  MAX_COLOR: 155
};


/** @method
 * @name _hexToRgb
 * @private
 * @memberof LightFever440
 * @description <blockquote>Useful method to convert hexadecimal string into a RGB array of numbers.</blockquote>
 * @param {string} hex - The hexadecimal string to convert in RGB
 * @return {number[]} - The converted RGB array **/
export function hexToRgb(hex) {
  // Real MV : https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb/5624139#5624139
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [255, 255, 255];
}


export function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


export function mapColor(color, max) {
  return [(color[0] * max) / (255), (color[1] * max) / (255), (color[2] * max) / (255)];
}


/** @method
 * @name _ajax
 * @private
 * @memberof LightFever440
 * @description <blockquote>Server call abstraction method that will dispatch a GET or a POST request to
 * the server, depending on the given parameters. It covers both the _getState and the sendAction method.</blockquote>
 * @param {string} url - The url to reach, either <code>state</code> (GET) or <code>action</code> (POST)
 * @param {object} data - The data to attach to the <code>action</code> calls. No required for <code>state</code> call
 * @returns {promise} The request <code>Promise</code>, format response as JSON on resolve, as error code string on reject **/
export function ajax(url, data) {
  return new Promise((resolve, reject) => {
    // Prepare sent options with proper verb, headers and body (for POST only)
    const options = {
      method: data ? 'POST' : 'GET',
      headers: new Headers([['Content-Type','application/json; charset=UTF-8'],['Accept','application/json']]),
      body: JSON.stringify(data)
    };
    // Perform fetch call and handle its output
    fetch(url, options).then(response => {
      if (response) {
        if (response.ok) {
          resolve(response.json());
        } else {
          reject(`ERROR_${response.status}`);
        }
      } else {
        reject('ERROR_MISSING_ARGUMENT');
      }
    }).catch(reject);
  });
}


export function colorPickerModal(color, callback) {
  const intermediateCallback = hex => {
    callback(hex);
  };

  return new ModalFactory('COLOR_PICKER', {
    color: color,
    callback: intermediateCallback
  });
}
