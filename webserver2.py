from bottle import Bottle, run, template, static_file, request, response, HTTPResponse
from light_fever import LightFever

import pyaudio

# p = pyaudio.PyAudio()
print('DEVICE AUDIO +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
# print(p.get_default_input_device_info())
# print(p.get_default_output_device_info())

# stream = p.open(format=pyaudio.paInt16,
#                                   channels=1,
#                                   rate=44100,
#                                   input=True,
#                                   frames_per_buffer=1024)


light_fever = LightFever()
print(light_fever or 'aze')



app = Bottle()

@app.get('/')
def index():
    return template('index')

@app.post('/action')
def action():
    action = request.json.get('action', None)

    if(action == 'ON'):
        print('switch on audio analyse')
        # light_fever.start()
    elif (action == 'OFF'):
        # light_fever.stop()
        print('switch off audio analyse')
    
    return HTTPResponse(status=204)

@app.route('/static/:path#.+#', name='static')
def static(path):
    return static_file(path, root='static')




if __name__ == '__main__':
    print('MAIINNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN')


run(app, host='localhost', port=8080, reloader=True, debug=True)
