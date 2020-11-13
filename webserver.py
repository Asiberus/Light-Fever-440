import os, os.path
import cherrypy

from light_fever import LightFever

class WebServer(object):
    def __init__(self, light_fever):
        self.light_fever = light_fever

    @cherrypy.expose
    def index(self):
        return open('index.html')

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def action(self):
        data = cherrypy.request.json
        action = data.get('action', None)
        if action == 'ON':
            self.light_fever.start()
        elif action == 'OFF':
            self.light_fever.stop()
        
        return {'success': True}


if __name__ == '__main__':
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './public'
        }
    }

    light_fever = LightFever()

    cherrypy.quickstart(WebServer(light_fever), '/', conf)