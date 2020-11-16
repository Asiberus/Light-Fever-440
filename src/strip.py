import collections
import time
from rpi_ws281x import *

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

        self.strip_color = collections.deque(maxlen=self.LED_COUNT)
        for i in range(self.LED_COUNT):
            self.strip_color.append(Color(0,0,0))


    def set_uniform_color(self, data):
        red, green, blue = data.get('color')
        for i in range(self.strip.numPixels()):
            self.strip.setPixelColor(i, Color(red, green, blue))
        self.strip.show()

    def set_progressive_color(self, data):
        red, green, blue = data.get('color')
        num_pixel = 5
        for i in range(num_pixel):
            self.strip_color.appendleft(Color(red, green, blue))

        for i in range(len(self.strip_color)):
            self.strip.setPixelColor(i, self.strip_color[i])

        self.strip.show()

    def set_progressive_mirror_color(self, data):
        red, green, blue = data.get('color')
        num_pixel = 5
        for i in range(num_pixel):
            self.strip_color.appendleft(Color(red, green, blue))

        strip_color_split = list(self.strip_color)[:self.strip_color.maxlen // 2]
        strip_color_mirror = strip_color_split[::-1] + strip_color_split

        for i in range(len(strip_color_mirror)):
            self.strip.setPixelColor(i, strip_color_mirror[i])

        self.strip.show()

    def pulse(self, data):
        red, green, blue = data.get('color')
        peak = data.get('peak')
        red, green, blue = (255, 0, 0)
        for i in range(self.strip.numPixels()):
            self.strip.setPixelColor(i, Color(red, green, blue))
        print(int(peak * 255))
        self.strip.setBrightness(int(peak * 255))
        self.strip.show()
        

    def stroboscope(self, options):
        # red, green, blue = options.get('color', (127, 127, 127))
        delay = options.get('delay', 50)
        self.set_uniform_color(options)
        time.sleep(delay/1000.0)
        self.set_uniform_color({'color': (0, 0, 0)})
        time.sleep(delay/1000.0)

    def theater_chase(self, options):
        red, green, blue = options.get('color', (127, 127, 127))
        delay = options.get('delay', 50)

        for q in range(3):
            for i in range(0, self.strip.numPixels(), 3):
                self.strip.setPixelColor(i+q, Color(red, green, blue))
            self.strip.show()
            time.sleep(delay/1000.0)
            for i in range(0, self.strip.numPixels(), 3):
                self.strip.setPixelColor(i+q, 0)

    def wheel(self, position):
        """Generate rainbow colors across 0-255 positions."""
        if position < 85:
            return Color(position * 3, 255 - position * 3, 0)
        elif position < 170:
            position -= 85
            return Color(255 - position * 3, 0, position * 3)
        else:
            position -= 170
            return Color(0, position * 3, 255 - position * 3)

    def rainbow_cycle(self):
        """Draw rainbow that uniformly distributes itself across all pixels."""
        for j in range(256):
            for i in range(self.strip.numPixels()):
                self.strip.setPixelColor(i, self.wheel((int(i * 256 / self.strip.numPixels()) + j) % 255))
            self.strip.show()
            time.sleep(20/1000.0)

    def theater_chase_rainbow(self):
        """Rainbow movie theater light style chaser animation."""
        for j in range(256):
            for q in range(3):
                for i in range(0, self.strip.numPixels(), 3):
                    self.strip.setPixelColor(i+q, self.wheel((i+j) % 255))
                self.strip.show()
                time.sleep(50/1000.0)
                for i in range(0, self.strip.numPixels(), 3):
                    self.strip.setPixelColor(i+q, 0)

    def switch_off_strip(self):
        for i in range(self.strip.numPixels()):
            self.strip_color.append(Color(0,0,0))
            self.strip.setPixelColor(i, Color(0, 0, 0))
            self.strip.show()
