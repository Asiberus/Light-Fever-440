'use strict';

const AJAX = new Kom();
const LF440 = new window.LightFever440();

// document.querySelector('.js-btn-start').addEventListener('click', () => {
//   LF440.ajax({
//     type: 'POST',
//     url: 'action',
//     data: {
//       action: 'ON'
//     },
//     success: (response) => {
//       console.log('Strip led successfuly started');
//     },
//     error: (status) => {
//       console.warn('Something went wrong', status);
//     }
//   });
// });
//
// document.querySelector('.js-btn-stop').addEventListener('click', () => {
//   LF440.ajax({
//     type: 'POST',
//     url: 'action',
//     data: {
//       action: 'OFF'
//     },
//     success: (response) => {
//       console.log('Strip led successfuly stoped');
//     },
//     error: (status) => {
//       console.warn('Something went wrong', status);
//     }
//   });
// });
