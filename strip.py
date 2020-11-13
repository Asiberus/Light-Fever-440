import collections
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


    def set_uniform_color(self, red, green, blue):
        for i in range(self.strip.numPixels()):
            self.strip.setPixelColor(i, Color(red, green, blue))
        self.strip.show()

    def set_progressive_color(self, red, green, blue, num_pixel=5):
        for i in range(num_pixel):
            self.strip_color.appendleft(Color(red, green, blue))

        for i in range(len(self.strip_color)):
            self.strip.setPixelColor(i, self.strip_color[i])
            
        self.strip.show()

    def set_progressive_mirror_color(self, red, green, blue, num_pixel=5):
        for i in range(num_pixel):
            self.strip_color.appendleft(Color(red, green, blue))

        strip_color_split = list(self.strip_color)[:self.strip_color.maxlen // 2]
        strip_color_mirror = strip_color_split[::-1] + strip_color_split

        for i in range(len(strip_color_mirror)):
            self.strip.setPixelColor(i, strip_color_mirror[i])
        
        self.strip.show()
        
    def switch_off_strip(self):
        self.set_uniform_color(0, 0, 0)