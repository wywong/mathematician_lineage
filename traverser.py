from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from mathematician_declarative import Base, Mathematician, Mentorship
from crawl import MathCrawler
import logging
import sys
import time

logging.getLogger().setLevel(logging.INFO)

seed = []

if len(sys.argv) == 2:
    seed = [int(sys.argv[1])]

engine = create_engine('sqlite:///mathematician.db')

Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)

session = DBSession()
crawler = MathCrawler(DBSession())

TRAVERSAL_LIMIT = 5

unvisited_advisors_query = session.query(Mentorship.advisor_id) \
    .outerjoin(Mathematician, Mathematician.id == Mentorship.advisor_id) \
    .filter(Mathematician.id.__eq__(None)) \
    .distinct() \
    .limit(TRAVERSAL_LIMIT)
unvisited_students_query = session.query(Mentorship.student_id) \
    .outerjoin(Mathematician, Mathematician.id == Mentorship.student_id) \
    .filter(Mathematician.id.__eq__(None)) \
    .distinct() \
    .limit(TRAVERSAL_LIMIT)


class Traverser:
    def __init__(self, queue):
        self.queue = queue

    def traverse(self):
        if not self.queue:
            unvisited_advisor_ids = \
                [id for (id,) in unvisited_advisors_query.all()]
            logging.info("Unvisited advisors: %s" % unvisited_advisor_ids)
            self.queue = unvisited_advisor_ids

        if not self.queue:
            unvisited_student_ids = \
                [id for (id,) in unvisited_students_query.all()]
            logging.info("Unvisited students: %s" % unvisited_student_ids)
            self.queue = unvisited_student_ids

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
