from bottle import Bottle, run, template, static_file, request, response, HTTPResponse

app = Bottle()

@app.get('/')
def index():
    return template('index')

@app.post('/action')
def action():
    action = request.json.get('action', None)

    if(action == 'ON'):
        print('switch on audio analyse')
    elif (action == 'OFF'):
        print('switch off audio analyse')
    

    return HTTPResponse(status=204)

@app.route('/static/:path#.+#', name='static')
def static(path):
    return static_file(path, root='static')

run(app, host='localhost', port=8080, reloader=True, debug=True)