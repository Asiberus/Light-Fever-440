# Light Fever 440

![](https://badgen.net/badge/version/0.1.0/blue)
[![License](https://img.shields.io/github/license/Asiberus/Light-Fever-440.svg)](https://github.com/Asiberus/Light-Fever-440/blob/master/LICENSE.md)

Why not connecting both an audio source and a LED strip to a Raspberry, and let some piece of software manage this light system ? Say no more, here is **Light Fever 440** ! The raspberry will host a basic web server so you can control this application using your phone or computer and try all the modes and effects it contains.

*Coming soon* : See our tutorial on how to build one for about 100€/150€ and make your parties looks like never before!

## Get started

Refer to the building guide (*coming soon*) to connect the Raspberry and the LED strip. Once the system is built, connect the Raspberry to a wireless network. You also need to install `nginx` into the raspberry before going any further.

Clone this repository into your raspberry, then `cd` inside it. Install the Python dependencies, using `pip install -r requirements.txt` (or manually install dependencies if `pip` isn't installed on the Raspberry). Configure the nginx server (see our example configuration file in the wiki). You can now launch the web server by calling `python webserver.py`.

If you want to build the web assets yourself, `cd` in the `web` folder, then run `npm install`. You can use `npm run build` (minified ES5 JavaScript) or `npm run watch` (ES6 JavaScript) depending on your needs. Note that this repository already includes those bundled assets, so this action is not mandatory to make it run.

Now connect your control device (phone or computer) to the wireless network used by the raspberry, and open a browser at the `RASPBERRY_LOCAL_IP`. You can now enjoy **Light Fever 440** !

## Features

*Coming soon*

## Contributors

- [Raphaël Beekmann](https://github.com/Asiberus)
- [Arthur Beaulieu](https://github.com/ArthurBeaulieu)

## External libraries

- [rangeslider-js](https://github.com/stbaer/rangeslider-js) (MIT)
- [HTML5-Color-Picker](https://github.com/NC22/HTML5-Color-Picker) (GPL-3.0)
