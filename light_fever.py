import time
from threading import Thread

from strip import StripLed
from audio_visualizer import AudioVisualizer

# TODO : Stop stream when webserver is kill

class LightFever(object):
    _instance = None

    # def __new__(class_, *args, **kwargs):
    #     print(class_._instance)
    #     if not isinstance(class_._instance, class_):
    #         class_._instance = object.__new__(class_, *args, **kwargs)
    #     return class_._instance

    def __init__(self):
        print('INITIALIZE LIGHT FEVER START')
        self.strip = StripLed()
        # self.audio_visualizer = None
        self.audio_visualizer = AudioVisualizer()

        self.audio_analize_running = False
        self.TIMER = 100
        print('INITIALIZE LIGHT FEVER FINISH')

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
            print(rgb)
            if rgb:
                self.strip.set_strip_uniform_color(rgb[0], rgb[1], rgb[2])
            time.sleep(self.TIMER/1000.0)

    


if __name__ == '__main__':
    light_fever = LightFever()

    light_fever.start()
    time.sleep(2)
    light_fever.stop()