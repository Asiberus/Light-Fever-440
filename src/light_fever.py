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

        self.state = {'state': 'OFF', 'mode': 'MANUAL', 'effect': 'UNIFORM', 'options': None }

    def get_state(self):
        return self.state

    def handle_action(self, action):
        print(action)

        state = action.get('state', 'OFF')
        mode = action.get('mode', None)
        effect = action.get('effect', None)
        options = action.get('options', None)

        try:
            message = ''
            if state == 'ON':
                if mode == 'MANUAL':
                    if self.is_audio_analyse_running:
                        self.stop_audio_analyse()
                        
                    self.start_manual_mode(effect, options)

                elif mode == 'AUDIO_ANALYSE':
                    if self.is_manual_mode_running:
                        self.stop_manual_mode()
                    self.start_audio_analyse(effect, options)
                
                message = '{0} started'.format(effect.capitalize().replace('_', ' '))

            elif state == 'OFF':
                self.stop_audio_analyse()
                self.stop_manual_mode()
                self.strip.switch_off_strip()
                message = 'Light Fever has stopped'

            self.state['state'] = state
            self.state['mode'] = mode
            self.state['effect'] = effect
            self.state['options'] = options
            return True, message
        except:
            return False, 'An error occured'

    def start_audio_analyse(self, effect, options):
        self.strip_color_effect = self.get_audio_analyse_strip_effect(effect)
        self.audio_analyse_options = options

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
            return self.strip.audio_uniform
        elif effect == 'PROGRESSIVE':
            return self.strip.progressive_color
        elif effect == 'PULSE':
            return self.strip.pulse
        elif effect == 'PROGRESSIVE_PULSE':
            return self.strip.pulse_progressive
        else:
            return self.strip.switch_off_strip

    def audio_analyze(self):
        while self.is_audio_analyse_running:
            data = self.audio_visualizer.get_color_from_analysis()
            if data['color']:
                self.strip_color_effect(data, self.audio_analyse_options)
            time.sleep(self.TIMER/1000.0)

    def start_manual_mode(self, effect, options):
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
        if effect == 'UNIFORM':
            return self.strip.manual_uniform
        elif effect == 'STROBOSCOPE':
            return self.strip.stroboscope
        elif effect == 'CHASE':
            return self.strip.chase
        elif effect == 'RAINBOW':
            return self.strip.rainbow
        else:
            return self.strip.switch_off_strip

    def manual_mode(self):
        while self.is_manual_mode_running:
            self.strip_color_effect(self.manual_options)
        



if __name__ == '__main__':
    light_fever = LightFever()

    # light_fever.start()
    # time.sleep(2)
    # light_fever.stop()
