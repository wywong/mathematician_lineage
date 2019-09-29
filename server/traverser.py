from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from mathematician_declarative import Base, Mathematician, Mentorship
from crawl import MathCrawler
import logging
import os
import sys
import time

logging.getLogger().setLevel(logging.INFO)

seed = []

DB_CONF = os.environ['MATH_DB_CONFIG']

if len(sys.argv) == 2:
    seed = [int(sys.argv[1])]

engine = create_engine(DB_CONF)

Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)

session = DBSession()
crawler = MathCrawler(DBSession())

TRAVERSAL_LIMIT = 5

unvisited_mathematicians_query = session.query(Mathematician.id) \
    .filter(Mathematician.visited.__eq__(False)) \
    .limit(TRAVERSAL_LIMIT)


class Traverser:
    def __init__(self, queue):
        self.queue = queue

    def traverse(self):
        if not self.queue:
            unvisited_mathematician_ids = \
                [id for (id,) in unvisited_mathematicians_query.all()]
            logging.info("Unvisited mathematicians: %s" %
                         unvisited_mathematician_ids)
            self.queue = unvisited_mathematician_ids


        if not self.queue:
            logging.info('No more unvisited ids')
            return 0
        id = self.queue.pop()
        logging.info("Begin crawling: %s" % id)
        crawler.crawl(id)
        logging.info("End crawling: %s" % id)
        time.sleep(30)
        self.traverse()

Traverser(seed).traverse()
