import time
from threading import Thread

from src.strip import StripLed
from src.audio_visualizer import AudioVisualizer

# TODO : Stop stream when webserver is kill

class LightFever(object):

    def __init__(self):
        self.strip = StripLed()
        self.audio_visualizer = AudioVisualizer()

        self.is_audio_analyse_running = False
        self.is_manual_mode_running = False
        self.TIMER = 50

        self.state = { 'state': 'OFF', 'mode': 'MANUAL', 'effect': 'UNIFORM', 'options': None }

    def get_state(self):
        return self.state

    def handle_action(self, action):
        state = action.get('state', 'OFF')
        mode = action.get('mode', None)
        effect = action.get('effect', None)
        options = action.get('options', None)

        if state == 'ON':
            if mode == 'MANUAL':
                if self.is_audio_analyse_running:
                    self.stop_audio_analyse()
                self.start_manual_mode(effect, options)

            elif mode == 'AUDIO_ANALYSE':
                if self.is_manual_mode_running:
                    self.stop_manual_mode()
                self.start_audio_analyse(effect)

        elif state == 'OFF':
            self.stop_audio_analyse()
            self.stop_manual_mode()
            self.strip.switch_off_strip()

        self.state['state'] = state
        self.state['mode'] = mode
        self.state['effect'] = effect
        self.state['options'] = options


    def start_audio_analyse(self, effect):
        self.strip_color_effect = self.get_audio_analyse_strip_effect(effect)

        if not self.is_audio_analyse_running:
            self.is_audio_analyse_running = True
            self.audio_visualizer.start()
            self.audio_analize_thread = Thread(target=self.audio_analyze)
            self.audio_analize_thread.start()

    def stop_audio_analyse(self):
        if self.is_audio_analyse_running:
            self.is_audio_analyse_running = False
            self.audio_analize_thread.join()

        self.audio_visualizer.stop()

    def get_audio_analyse_strip_effect(self, effect):
        if effect == 'UNIFORM':
            return self.strip.set_uniform_color
        elif effect == 'PROGRESSIVE':
            return self.strip.set_progressive_color
        elif effect == 'PROGRESSIVE_MIRROR':
            return self.strip.set_progressive_mirror_color
        elif effect == 'PULSE':
            return self.strip.pulse
        else:
            return self.strip.switch_off_strip

    def audio_analyze(self):
        while self.is_audio_analyse_running:
            data = self.audio_visualizer.get_color_from_analysis()
            if data['color']:
                self.strip_color_effect(data)
            time.sleep(self.TIMER/1000.0)

    def start_manual_mode(self, effect, options):
        if effect == 'UNIFORM':
            if self.is_manual_mode_running:
                self.stop_manual_mode()

            # red, green, blue = options.get('color', (127, 127, 127))
            self.strip.set_uniform_color(options)
            return

        self.strip_color_effect = self.get_manual_strip_effect(effect)
        self.manual_options = options

        if not self.is_manual_mode_running:
            self.is_manual_mode_running = True
            self.manual_mode_thread = Thread(target=self.manual_mode)
            self.manual_mode_thread.start()

    def stop_manual_mode(self):
        if self.is_manual_mode_running:
            self.is_manual_mode_running = False
            self.manual_mode_thread.join()

    def get_manual_strip_effect(self, effect):
        if effect == 'STROBOSCOPE':
            return self.strip.stroboscope
        elif effect == 'THEATER_CHASE':
            return self.strip.theater_chase
        elif effect == 'RAINBOW_CYCLE':
            return self.strip.rainbow_cycle
        elif effect == 'THEATER_CHASE_RAINBOW':
            return self.strip.theater_chase_rainbow
        else:
            return self.strip.switch_off_strip

    def manual_mode(self):
        while self.is_manual_mode_running:
            if self.manual_options:
                self.strip_color_effect(self.manual_options)
            else:
                self.strip_color_effect()



if __name__ == '__main__':
    light_fever = LightFever()

    # light_fever.start()
    # time.sleep(2)
    # light_fever.stop()
