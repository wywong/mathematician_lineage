from mathematician_declarative import Mathematician, Mentorship
from scrape import MathematicianScraper
import logging


class MathCrawler:
    def __init__(self, session):
        self.session = session

    def crawl(self, id):
        try:
            scraped_data = MathematicianScraper.scrape(id)
            if scraped_data is not None:
                math_id = scraped_data.id
                if scraped_data.id != id:
                    raise "scraped mismatch: (id, scraped_id)=(%s, %s)" % \
                        (id, math_id)
                self.updateMathematician(scraped_data.id,
                                         scraped_data.full_name,
                                         True,
                                         scraped_data.image,
                                         scraped_data.wiki_url)

                for advisor_id in scraped_data.advisor_ids:
                    self.addMathematician(advisor_id)
                    self.addMentorship(advisor_id, math_id)

                for student_id in scraped_data.student_ids:
                    self.addMathematician(student_id)
                    self.addMentorship(math_id, student_id)
                self.session.commit()
        except Exception as e:
            logging.exception(e)
            self.session.rollback()

    def addMathematician(self, id):
        try:
            exist_query = self.session.query(Mathematician) \
                                .filter(Mathematician.id == id)
            exists = self.session.query(exist_query.exists()).scalar()
            if not exists:
                self.session.add(
                    Mathematician(id=id,
                                  full_name="",
                                  visited=False,
                                  image=None,
                                  wiki_url=None)
                )
            else:
                logging.warn("Skip adding existing mathematician: (id)=(%s)" % id)


        except Exception as e:
            logging.error(
                'An error occurred adding the mathematician: (id)=(%s)' % id
            )
            raise e

    def updateMathematician(self, id, full_name, visited, image=None, wiki_url=None):
        try:
            mathematician = self.session.query(Mathematician) \
                .get(id)

            if mathematician is None:
                self.session.add(
                    Mathematician(id=id,
                                  full_name=full_name,
                                  visited=visited,
                                  image=image,
                                  wiki_url=wiki_url)
                )
            elif mathematician.visited:
                logging.warn("Visiting visited mathematician: (id)=(%s)" % id)
            else:
                mathematician.full_name = full_name
                mathematician.visited = visited
                mathematician.image = image
                mathematician.wiki_url = wiki_url
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

