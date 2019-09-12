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
                self.session.add(
                    Mathematician(id=math_id,
                                  full_name=scraped_data.full_name))

                for advisor_id in scraped_data.advisor_ids:
                    exist_query = self.session.query(Mentorship) \
                        .filter(Mentorship.advisor_id == advisor_id,
                                Mentorship.student_id == id)
                    exists = self.session.query(exist_query.exists()).scalar()
                    if not exists:
                        self.session.add(
                            Mentorship(advisor_id=advisor_id,
                                       student_id=math_id))

                for student_id in scraped_data.student_ids:
                    exist_query = self.session.query(Mentorship) \
                        .filter(Mentorship.advisor_id == id,
                                Mentorship.student_id == student_id)
                    exists = self.session.query(exist_query.exists()).scalar()
                    if not exists:
                        self.session.add(
                            Mentorship(advisor_id=math_id,
                                       student_id=student_id))
                self.session.commit()
        except Exception as e:
            logging.exception(e)
            self.session.rollback()
