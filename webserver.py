import os, os.path
import cherrypy

from src.light_fever import LightFever

class WebServer(object):
    def __init__(self, light_fever):
        self.light_fever = light_fever

    @cherrypy.expose
    def index(self):
        return open('web/index.html')

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def state(self):
        return self.light_fever.get_state()

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def action(self):
        data = cherrypy.request.json
        success, message = self.light_fever.handle_action(data)
        return {'success': success, 'message': message}
    

if __name__ == '__main__':
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd()),
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './web'
        }
    }

    light_fever = LightFever()
    cherrypy.quickstart(WebServer(light_fever), '/', conf)
