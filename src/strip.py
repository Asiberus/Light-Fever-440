import collections
import time
import colorsys
from rpi_ws281x import *

#Todo : add default for every options
#Todo : chase différencier spacing et size

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

        num_pixel = options.get('size', 5)

        for i in range(num_pixel):
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
        reverse = options.get('reverse')
        max_size = options.get('max')

        test = options.get('test')

        max_size = max_size if max_size > 0.02 else 0.02

        num_pixel = int(((self.strip.numPixels() / 2) * max_size) * peak)

        strip_color_split = list()

        for i in range(self.strip.numPixels() // 2):
            if test:
                if i < num_pixel - 5:
                    brightness = 1
                elif i > num_pixel - 5 and i <= num_pixel:
                    brightness =  1 - (5 - (num_pixel - i))/5
                else:
                    brightness = 0

                strip_color_split.append(self.set_color_brightness((red, green, blue), brightness))
            else:
                if i <= num_pixel:
                    strip_color_split.append((red, green, blue))
                else:
                    strip_color_split.append((0, 0, 0))

        if reverse:
            strip_color_mirror = strip_color_split + strip_color_split[::-1]
        else:    
            strip_color_mirror = strip_color_split[::-1] + strip_color_split

        self.show_strip_color_array(strip_color_mirror)
        

    def pulse_progressive(self, data, options):
        red, green, blue = options.get('color')
        peak = data.get('peak')
        reverse = options.get('reverse')
        peak_threshold = options.get('peakTreshold')
        num_pixel = options.get('size', 5)

        test = options.get('test')

        peak = peak if peak >= peak_threshold else 0

        color = self.set_color_brightness((red, green, blue), peak)

        for i in range(num_pixel):
            if test:
                self.strip_color.appendleft(self.set_color_brightness((red, green, blue), (1 - i/num_pixel) * peak))
            else:
                self.strip_color.appendleft(color)

        strip_color_split = list(self.strip_color)[:self.strip_color.maxlen // 2]

        if reverse:
            strip_color_mirror = strip_color_split + strip_color_split[::-1]
        else:    
            strip_color_mirror = strip_color_split[::-1] + strip_color_split
        
        self.show_strip_color_array(strip_color_mirror)


    # Manual effect

    def manual_uniform(self, options):
        red, green, blue = options.get('color')
        wave_delta = options.get('waveDelta')

        self.set_uniform_color(red, green, blue)

    def stroboscope(self, options):
        red, green, blue = options.get('color')
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
        delay = options.get('delay', 50)
        size = options.get('size', 1)
        spacing = options.get('spacing', 2)

        pixel_range = spacing + 1

        for q in range(pixel_range):
            for i in range(0, self.strip.numPixels(), pixel_range):
                for j in range(size):
                    self.strip.setPixelColor(i+j+q, Color(red, green, blue))
            self.strip.show()
            time.sleep(delay/1000.0)
            for i in range(0, self.strip.numPixels(), pixel_range):
                for j in range(size):
                    self.strip.setPixelColor(i+j+q, Color(0, 0, 0))

    def rainbow_chase(self, options):
        delay = options.get('delay', 50)
        size = options.get('size', 1)
        spacing = options.get('spacing', 2)

        pixel_range = spacing + 1

        for q in range(pixel_range):
            for i in range(0, self.strip.numPixels(), pixel_range):
                for j in range(size):
                    self.strip.setPixelColor(i+j+q, self.color_wheel((i+self.rainbow_iterator) % 255))
            self.strip.show()
            time.sleep(delay/1000.0)
            for i in range(0, self.strip.numPixels(), pixel_range):
                for j in range(size):
                    self.strip.setPixelColor(i+j+q, Color(0, 0, 0))

        self.rainbow_iterator = (self.rainbow_iterator + 1) % 255

    """Draw rainbow that uniformly distributes itself across all pixels."""
    def rainbow(self, options):
        delay_max = 100

        speed = options.get('speed')
        delay = delay_max - delay_max * (speed / 100) if speed < 95 else 5

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

    def switch_off_strip(self):
        for i in range(self.strip.numPixels()):
            self.strip_color.append((0, 0, 0))
            self.strip.setPixelColor(i, Color(0, 0, 0))
            self.strip.show()
