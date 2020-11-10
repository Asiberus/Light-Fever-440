import collections
import colorsys
import time
from threading import *

import numpy as np
import pyaudio
from rpi_ws281x import *

from microphone_recorder import MicrophoneRecorder

class AudioVisualizer():
  def __init__(self):
    # Thread.__init__(self)
    # self.stopped = event

    self.FORMAT = pyaudio.paInt16
    self.CHANNELS = 1
    self.RATE = 44100
    self.CHUNKSIZE = 1024
    self.N_FFT = 2048

    self.previous_hue = None
    self.hue_offset = 0
    self.previous_spectrum = collections.deque(maxlen=10)

    self.recorder = MicrophoneRecorder(sample_rate=self.RATE, chunksize=self.CHUNKSIZE)
    self.recorder.start()

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

    self.strip_color = collections.deque(maxlen=self.strip.numPixels())
    self.strip_mirror_color = collections.deque(maxlen=self.strip.numPixels() // 2)

    for i in range(self.strip.numPixels() // 2):
      self.strip_mirror_color.append(Color(0,0,0))


  # def run(self):
  #   while not self.stopped.wait(0.1):
  #     self.update()

  # def stop(self):
  #   self.recorder.close()
  #   self.set_strip_color(0, 0, 0)
  #   self.stopped.set()
  #   self.join()

  def update(self):
    frames = self.recorder.get_frames()
    if len(frames) == 0:
      data = np.zeros((self.recorder.chunksize,), dtype=np.int)
    else:
      data = frames[-1]

    if data.max() > 1:
      self.get_spectrum_data(data)

  def get_spectrum_data(self, data):
    spectrum = np.fft.fft(np.hanning(data.size) * data, n=self.N_FFT)

    self.get_bark_split(spectrum)

    # spectrum_magnitude = np.sqrt(np.real(spectrum) ** 2 + np.imag(spectrum) ** 2)
    # spectrum_magnitude = spectrum_magnitude[:self.CHUNKSIZE] * 2 / (128 * self.CHUNKSIZE)

  def get_bark_split(self, data):
    bark_scale = [0, 100, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000,
                  2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500]

    bark_scale_vector = [
      {'freq': 100, 'data': [], 'value': 0},
      {'freq': 200, 'data': [], 'value': 0},
      {'freq': 300, 'data': [], 'value': 0},
      {'freq': 400, 'data': [], 'value': 0},
      {'freq': 510, 'data': [], 'value': 0},
      {'freq': 630, 'data': [], 'value': 0},
      {'freq': 770, 'data': [], 'value': 0},
      {'freq': 920, 'data': [], 'value': 0},
      {'freq': 1080, 'data': [], 'value': 0},
      {'freq': 1270, 'data': [], 'value': 0},
      {'freq': 1480, 'data': [], 'value': 0},
      {'freq': 1720, 'data': [], 'value': 0},
      {'freq': 2000, 'data': [], 'value': 0},
      {'freq': 2320, 'data': [], 'value': 0},
      {'freq': 2700, 'data': [], 'value': 0},
      {'freq': 3150, 'data': [], 'value': 0},
      {'freq': 3700, 'data': [], 'value': 0},
      {'freq': 4400, 'data': [], 'value': 0},
      {'freq': 5300, 'data': [], 'value': 0},
      {'freq': 6400, 'data': [], 'value': 0},
      {'freq': 7700, 'data': [], 'value': 0},
      {'freq': 9500, 'data': [], 'value': 0},
      {'freq': 12000, 'data': [], 'value': 0},
      {'freq': 15500, 'data': [], 'value': 0},
    ]

    step = self.RATE // self.N_FFT

    for i in range(self.CHUNKSIZE):
      freq = i * step
      value = data[i]

      for bark in bark_scale_vector[::-1]:
        if freq >= bark['freq']:
          bark['data'].append(value)
          break

    y = []
    for bark in bark_scale_vector:
      magnitude = np.sqrt(np.real(bark['data']) ** 2 + np.imag(bark['data']) ** 2)
      d = np.linalg.norm(magnitude)
      bark['value'] = int(d)

      y.append(bark['value'])

    y = np.array(y)
    y = (y - y.min()) / (y.max() - y.min())

    self.set_color(y)

  def set_color(self, data):
    blue = np.linalg.norm(data[1:8])
    green = np.linalg.norm(data[8:16])
    red = np.linalg.norm(data[16:])

    sum = blue + green + red

    red_ratio = red / sum
    green_ratio = green / sum
    blue_ratio = blue / sum

    hue, saturation, value = colorsys.rgb_to_hsv(red_ratio, green_ratio, blue_ratio)
    r = colorsys.hsv_to_rgb(hue, 1, 1)
    rgb = [int(r[0] * 255), int(r[1] * 255), int(r[2] * 255)]

    # print(rgb)

    # self.set_strip_uniform_color(rgb[0], rgb[1], rgb[2])
    # self.set_strip_progressive_color(rgb[0], rgb[1], rgb[2], 10)
    self.set_strip_progressive_mirror_color(rgb[0], rgb[1], rgb[2], 5)

  def set_strip_uniform_color(self, red, green, blue):
    for i in range(self.strip.numPixels()):
      self.strip.setPixelColor(i, Color(red, green, blue))
    self.strip.show()

  def set_strip_progressive_color(self, red, green, blue, num_pixel=5):
    for i in range(num_pixel):
      self.strip_color.appendleft(Color(red, green, blue))

    for i in range(len(self.strip_color)):
      self.strip.setPixelColor(i, self.strip_color[i])
      
    self.strip.show()

  def set_strip_progressive_mirror_color(self, red, green, blue, num_pixel=5):
    for i in range(num_pixel):
      self.strip_mirror_color.append(Color(red, green, blue))

    strip_color = list(self.strip_mirror_color) + list(self.strip_mirror_color)[::-1]

    for i in range(len(strip_color)):
      self.strip.setPixelColor(i, strip_color[i])
      
    self.strip.show()

    
  def switch_off_strip(self):
    self.set_strip_uniform_color(0, 0, 0)
      
  

if __name__ == '__main__':
  # stopFlag = Event()
  # thread = AudioVisualizer(stopFlag)
  # thread.start()

  audio_visualizer = AudioVisualizer()

  try:
    while True:
      audio_visualizer.update()
      time.sleep(0.01)

  except KeyboardInterrupt:
    audio_visualizer.switch_off_strip()

