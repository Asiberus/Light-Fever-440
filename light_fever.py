import time
from threading import Thread

from strip import StripLed
from audio_visualizer import AudioVisualizer

# TODO : Stop stream when webserver is kill

class LightFever(object):

    def __init__(self):
        self.strip = StripLed()
        self.audio_visualizer = AudioVisualizer()

        self.audio_analize_running = False
        self.TIMER = 50

        # Default mode is uniform color
        self.set_strip_color = self.strip.set_uniform_color

    def start(self):
        self.audio_analize_running = True
        self.audio_visualizer.start()

        self.audio_analize = Thread(target=self.start_audio_analyse)
        self.audio_analize.start()

    def stop(self):
        self.audio_analize_running = False
        self.audio_analize.join()
        self.audio_visualizer.stop()
        self.strip.switch_off_strip()
    
    def start_audio_analyse(self):
        while self.audio_analize_running:
            rgb = self.audio_visualizer.get_color_from_analysis()
            if rgb:
                self.set_strip_color(rgb[0], rgb[1], rgb[2])
            time.sleep(self.TIMER/1000.0)

    def set_audio_analyse_mode(self, mode):
        if mode == 'UNIFORM':
            self.set_strip_color = self.strip.set_uniform_color
        elif mode == 'PROGRESSIVE':
            self.set_strip_color = self.strip.set_progressive_color
        elif mode == 'PROGRESSIVE_MIRROR':
            self.set_strip_color = self.strip.set_progressive_mirror_color
        

    


if __name__ == '__main__':
    light_fever = LightFever()

    light_fever.start()
    time.sleep(2)
    light_fever.stop()