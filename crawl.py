from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from mathematician_declarative import Base, Mathematician, Mentorship
from scrape import MathematicanScraper
import logging

engine = create_engine('sqlite:///mathematician.db')

Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)

session = DBSession()

seed_ids = [38586]

for id in seed_ids:
    try:
        scraped_data = MathematicanScraper.scrape(id)
        if scraped_data is not None:
            math_id = scraped_data.id
            if scraped_data.id != id:
                raise "scraped mismatch: (id, scraped_id)=(%s, %s)" % (id,
                                                                       math_id)
            session.add(Mathematician(id=math_id,
                                      full_name=scraped_data.full_name))
            for advisor_id in scraped_data.advisor_ids:
                session.add(Mentorship(advisor_id=advisor_id,
                                       student_id=math_id))

            for student_id in scraped_data.student_ids:
                session.add(Mentorship(advisor_id=math_id,
                                       student_id=student_id))
            session.commit()
    except Exception as e:
        logging.exception(e)
        session.rollback()
