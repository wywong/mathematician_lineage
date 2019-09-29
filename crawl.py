from mathematician_declarative import Mathematician, Mentorship
from scrape import MathematicanScraper
import logging


class MathCrawler:
    def __init__(self, session):
        self.session = session

    def crawl(self, id):
        try:
            scraped_data = MathematicanScraper.scrape(id)
            if scraped_data is not None:
                math_id = scraped_data.id
                if scraped_data.id != id:
                    raise "scraped mismatch: (id, scraped_id)=(%s, %s)" % \
                        (id, math_id)
                self.addMathematician(scraped_data.id,
                                      scraped_data.full_name,
                                      True)

                for advisor_id in scraped_data.advisor_ids:
                    self.addMathematician(advisor_id, "", False)
                    self.addMentorship(advisor_id, math_id)

                for student_id in scraped_data.student_ids:
                    self.addMathematician(student_id, "", False)
                    self.addMentorship(math_id, student_id)
                self.session.commit()
        except Exception as e:
            logging.exception(e)
            self.session.rollback()

    def addMathematician(self, id, full_name, visited):
        try:
            mathematician = self.session.query(Mathematician) \
                .get(id)

            if mathematician is None:
                self.session.add(
                    Mathematician(id=id,
                                  full_name=full_name,
                                  visited=visited)
                )
            elif mathematician.visited:
                logging.warn("Visiting visited mathematician: (id)=(%s)" % id)
            else:
                mathematician.full_name = full_name
                mathematician.visited = visited
                logging.info("Visited mathematician: (id)=(%s)" % id)
        except Exception as e:
            logging.error(
                'An error occurred adding the mathematician: (id)=(%s)' % id
            )
            raise e

    def addMentorship(self, advisor_id, student_id):
        try:
            if advisor_id == student_id:
                raise "Self references detected: (id)=(student_id)"

            exist_query = self.session.query(Mentorship) \
                .filter(Mentorship.advisor_id == advisor_id,
                        Mentorship.student_id == student_id)
            exists = self.session.query(exist_query.exists()).scalar()
            if exists:
                logging.info('Skipping existing edge: (a, s)=(%s, %s)' % \
                    (advisor_id, student_id))
            else:
                self.session.add(Mentorship(advisor_id=advisor_id,
                                            student_id=student_id))
        except Exception as e:
            logging.error(
                'An error occurred adding the mentorship: (a, s)=(%s, %s)' % \
                    (advisor_id, student_id)
            )
            raise e

