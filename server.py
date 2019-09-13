from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from mathematician_declarative import Base, Mathematician
import logging
import cherrypy

engine = create_engine('sqlite:///mathematician.db')

Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)


class Students(object):
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def index(self, mathematician_id):
        try:
            session = DBSession()
            mathematician = session.query(Mathematician).get(mathematician_id)
            if mathematician is not None:
                return list(map(dict, mathematician.students()))
            else:
                return []
        except Exception as e:
            logging.error(e)
            raise
        finally:
            session.close()


class Advisors(object):
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def index(self, mathematician_id):
        try:
            session = DBSession()
            mathematician = session.query(Mathematician).get(mathematician_id)
            if mathematician is not None:
                return list(map(dict, mathematician.students()))
            else:
                return []
        except Exception as e:
            logging.error(e)
            raise
        finally:
            session.close()


@cherrypy.popargs('mathematician_id')
class MathematicianController(object):
    def __init__(self):
        self.advisors = Advisors()
        self.students = Students()

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def index(self, mathematician_id):
        try:
            session = DBSession()
            mathematician = session.query(Mathematician).get(mathematician_id)
            if mathematician is not None:
                return dict(mathematician)
            else:
                return None
        except Exception as e:
            logging.error(e)
            raise
        finally:
            session.close()


class Server(object):
    def __init__(self):
        self.mathematician = MathematicianController()

    @cherrypy.expose
    def index(self):
        return "Hello world!"

if __name__ == '__main__':
    cherrypy.quickstart(Server())
