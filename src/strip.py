import collections
import time
import colorsys
from rpi_ws281x import *

import src.utils as utils

class StripLed(object):
    def __init__(self):
        #Initiate strip led object
        self.LED_COUNT = 150
        self.LED_PIN = 18
        self.LED_FREQ_HZ = 800000
        self.LED_DMA = 10
        self.LED_BRIGHTNESS = 255
        self.LED_INVERT = False
        self.LED_CHANNEL = 0
        self.strip = Adafruit_NeoPixel(self.LED_COUNT, self.LED_PIN, self.LED_FREQ_HZ, self.LED_DMA, self.LED_INVERT, self.LED_BRIGHTNESS, self.LED_CHANNEL)
        self.strip.begin()

        self.rainbow_iterator = 0
        self.chase_iterator = 0

        self.strip_color = collections.deque(maxlen=self.LED_COUNT)
        for i in range(self.LED_COUNT):
            self.strip_color.append((0, 0, 0))


    def show_strip_color_array(self, array = None):
        if not array:
            array = self.strip_color

        for i in range(len(array)):
            red, green, blue = array[i]
            self.strip.setPixelColorRGB(i, red, green, blue)

        self.strip.show()

    def set_uniform_color(self, red, green, blue):
        for i in range(self.strip.numPixels()):
            self.strip.setPixelColor(i, Color(red, green, blue))
        self.strip.show()

    def audio_uniform(self, data, options):
        red, green, blue = options.get('color') if 'color' in options else data.get('color')
        peak = data.get('peak')
        peak_sensitivity = options.get('peakSensitivity', 0)

        if peak_sensitivity > 1 or peak_sensitivity < 0:
            peak_sensitivity = 0
        
        for i in range(self.strip.numPixels()):
            self.strip.setPixelColor(i, Color(red, green, blue))

        brightness = int(255 - ((1 - peak) * (peak_sensitivity * 255)))
        self.strip.setBrightness(brightness)

        self.strip.show()

        
    def progressive_color(self, data, options):
        red, green, blue = data.get('color', (127, 127, 127))
        reverse = options.get('reverse', False)
        size = options.get('size', 5)

        for i in range(size):
            self.strip_color.appendleft((red, green, blue))

        strip_color_split = list(self.strip_color)[:self.strip_color.maxlen // 2]

        if reverse:
            strip_color_mirror = strip_color_split + strip_color_split[::-1]
        else:    
            strip_color_mirror = strip_color_split[::-1] + strip_color_split

        self.show_strip_color_array(strip_color_mirror)


    def pulse(self, data, options):
        red, green, blue = options.get('color') if 'color' in options else data.get('color')
        peak = data.get('peak')
        reverse = options.get('reverse', False)
        max_size = options.get('max', 1)

        max_size = max_size if max_size > 0.02 else 0.02

        size = int(((self.strip.numPixels() / 2) * max_size) * peak)

        strip_color_split = list()

        for i in range(self.strip.numPixels() // 2):
            if i <= size:
                strip_color_split.append((red, green, blue))
            else:
                strip_color_split.append((0, 0, 0))

        if reverse:
            strip_color_mirror = strip_color_split + strip_color_split[::-1]
        else:
            strip_color_mirror = strip_color_split[::-1] + strip_color_split

        self.show_strip_color_array(strip_color_mirror)
        

    def pulse_progressive(self, data, options):
        peak = data.get('peak')
        red, green, blue = options.get('color', (127, 127, 127))
        reverse = options.get('reverse', False)
        peak_threshold = options.get('peakTreshold', 0)
        size = options.get('size', 5)

        peak = peak if peak >= peak_threshold else 0

        for i in range(size):
            self.strip_color.appendleft(self.set_color_brightness((red, green, blue), (1 - i / size) * peak))
        
        strip_color_split = list(self.strip_color)[:self.strip_color.maxlen // 2]

        if reverse:
            strip_color_mirror = strip_color_split + strip_color_split[::-1]
        else:    
            strip_color_mirror = strip_color_split[::-1] + strip_color_split
        
        self.show_strip_color_array(strip_color_mirror)


    # Manual effect

    def manual_uniform(self, options):
        red, green, blue = options.get('color', (127, 127, 127))
        wave_delta = options.get('waveDelta', 0)

        self.set_uniform_color(red, green, blue)

    def stroboscope(self, options):
        red, green, blue = options.get('color', (127, 127, 127))
        delay = options.get('delay', 50)

        self.set_uniform_color(red, green, blue)
        time.sleep(delay/1000.0)
        self.set_uniform_color(0, 0, 0)
        time.sleep(delay/1000.0)

    def chase(self, options):
        rainbow = options.get('rainbow')

        if rainbow:
            self.rainbow_chase(options)
        else:
            self.theater_chase(options)
    
    def theater_chase(self, options):
        red, green, blue = options.get('color', (127, 127, 127))
        speed = options.get('speed', 50)
        size = options.get('size', 1)
        spacing = options.get('spacing', 2)

        delay = utils.mapRange((0, 100), (200, 10), speed)
        pixel_range = size + spacing

        for i in range(0, self.strip.numPixels(), pixel_range):
            for j in range(pixel_range):
                if j < size:
                    self.strip.setPixelColor(i + j + self.chase_iterator, Color(red, green, blue))
                else:
                    self.strip.setPixelColor(i + j + self.chase_iterator, Color(0, 0, 0))

        self.strip.show()
        time.sleep(delay/1000.0)

        self.chase_iterator = (self.chase_iterator + 1) % pixel_range

    def rainbow_chase(self, options):
        speed = options.get('speed', 50)
        size = options.get('size', 1)
        spacing = options.get('spacing', 2)

        delay = utils.mapRange((0, 100), (200, 10), speed)
        pixel_range = size + spacing

        for i in range(0, self.strip.numPixels(), pixel_range):
            for j in range(pixel_range):
                if j < size:
                    self.strip.setPixelColor(i + j + self.chase_iterator, self.color_wheel((i+self.rainbow_iterator) % 255))
                else:
                    self.strip.setPixelColor(i + j + self.chase_iterator, Color(0, 0, 0))

        self.strip.show()
        time.sleep(delay/1000.0)

        self.chase_iterator = (self.chase_iterator + 1) % pixel_range

        self.rainbow_iterator = (self.rainbow_iterator + 1) % 255

    """Draw rainbow that uniformly distributes itself across all pixels."""
    def rainbow(self, options):
        speed = options.get('speed', 50)

        delay = utils.mapRange((0, 100), (100, 10), speed)

        for i in range(self.strip.numPixels()):
            self.strip.setPixelColor(i, self.color_wheel((int(i * 256 / self.strip.numPixels()) + self.rainbow_iterator) % 255))
        self.strip.show()
        time.sleep(delay/1000.0)

        self.rainbow_iterator = (self.rainbow_iterator + 1) % 255

    def color_wheel(self, position):
        """Generate rainbow colors across 0-255 positions."""
        if position < 85:
            return Color(position * 3, 255 - position * 3, 0)
        elif position < 170:
            position -= 85
            return Color(255 - position * 3, 0, position * 3)
        else:
            position -= 170
            return Color(0, position * 3, 255 - position * 3)

    def set_color_brightness(self, color, brightness):
        if brightness == 1:
            return color

        hue, saturation, value = colorsys.rgb_to_hsv(color[0], color[1], color[2])
        red, green, blue = colorsys.hsv_to_rgb(hue, saturation, brightness)

        return (int(red * 255), int(green * 255), int(blue * 255))

    def switch_off_strip(self, options=dict()):
        for i in range(self.strip.numPixels()):
            self.strip_color.append((0, 0, 0))
            self.strip.setPixelColor(i, Color(0, 0, 0))
            self.strip.show()
