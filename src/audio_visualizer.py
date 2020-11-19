import collections
import colorsys
import time
from threading import *

import numpy as np
import pyaudio

from src.microphone_recorder import MicrophoneRecorder

class AudioVisualizer(object):
  def __init__(self):
    self.RATE = 44100
    self.CHUNKSIZE = 1024
    self.N_FFT = 2048

    self.previous_hue = None
    self.hue_offset = 0
    self.previous_spectrum = collections.deque(maxlen=10)

    self.peak_history = collections.deque(maxlen=1000)

    self.recorder = MicrophoneRecorder(sample_rate=self.RATE, chunksize=self.CHUNKSIZE)

  def start(self):
    self.recorder.start_stream()

  def stop(self):
    self.recorder.stop_stream()

  def get_color_from_analysis(self):
    frames = self.recorder.get_frames()
    if len(frames) == 0:
      data = np.zeros((self.recorder.chunksize,), dtype=np.int)
    else:
      data = frames[-1]

    if not data.max() > 1:
      return {'color': None, 'peak': None}
    
    bark_split = self.get_bark_split(data)
    rgb_split = self.get_rgb_split(bark_split)

    peak = self.get_peak(data)

    return {'color': rgb_split, 'peak': peak}

  def get_peak(self, data):
    self.peak_history.append(data.max())
    peak = data.max() / np.array(self.peak_history).max()

    return peak

  def get_bark_split(self, data):
    spectrum = np.fft.fft(np.hanning(data.size) * data, n=self.N_FFT)

    bark_scale = [
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
      value = spectrum[i]

      for bark in bark_scale[::-1]:
        if freq >= bark['freq']:
          bark['data'].append(value)
          break

    bark_split = []
    for bark in bark_scale:
      magnitude = np.sqrt(np.real(bark['data']) ** 2 + np.imag(bark['data']) ** 2)
      d = np.linalg.norm(magnitude)
      bark['value'] = int(d)

      bark_split.append(bark['value'])

    bark_split = np.array(bark_split)
    bark_split = (bark_split - bark_split.min()) / (bark_split.max() - bark_split.min())

    return bark_split

  def get_rgb_split(self, data):
    blue = np.linalg.norm(data[0:8])
    green = np.linalg.norm(data[8:16])
    red = np.linalg.norm(data[16:])

    sum = blue + green + red

    red_ratio = red / sum
    green_ratio = green / sum
    blue_ratio = blue / sum

    hue, saturation, value = colorsys.rgb_to_hsv(red_ratio, green_ratio, blue_ratio)
    r = colorsys.hsv_to_rgb(hue, 1, 1)
    rgb = [int(r[0] * 255), int(r[1] * 255), int(r[2] * 255)]

    return rgb


if __name__ == '__main__':
  audio_visualizer = AudioVisualizer()
  audio_visualizer.start()

  try:
    while True:
      rgb = audio_visualizer.get_color_from_analysis()
      time.sleep(0.1)

  except KeyboardInterrupt:
    audio_visualizer.stop()
    audio_visualizer.recorder.close()
