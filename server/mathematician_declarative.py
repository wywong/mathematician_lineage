from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Index,
    Integer,
    LargeBinary,
    String,
    func
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
import os

DB_CONF = os.environ['MATH_DB_CONFIG']

Base = declarative_base()


class Mathematician(Base):
    __tablename__ = 'mathematician'
    id = Column(Integer, primary_key=True, nullable=False)
    full_name = Column(String, nullable=False, index=True)
    visited = Column(Boolean, nullable=False)
    image = Column(LargeBinary, nullable=True)
    wiki_url = Column(String, nullable=True)

    def __iter__(self):
        yield ("id", self.id)
        yield ("full_name", self.full_name)
        if self.image is None:
            yield ("image_url", None)
        else:
            yield ("image_url", '/api/mathematician/%s/photo/' % self.id)
        yield ("wiki_url", self.wiki_url)

    def __repr__(self):
        return "<Mathematician(id=%s, full_name=%s)>" % \
            (self.id, self.full_name)

    def advisors(self):
        return [mentorship.advisor for mentorship in self.learnt]

    def students(self):
        return [mentorship.student for mentorship in self.taught]


class Mentorship(Base):
    __tablename__ = 'mentorship'
    advisor_id = Column(Integer,
                        ForeignKey('mathematician.id'),
                        primary_key=True,
                        nullable=False)
    student_id = Column(Integer,
                        ForeignKey('mathematician.id'),
                        primary_key=True,
                        nullable=False)

    def __repr__(self):
        return "<Mentorship(advisor_id=%s, student_id=%s)>" % \
            (self.advisor_id, self.student_id)

    advisor = relationship(
        Mathematician, primaryjoin=advisor_id == Mathematician.id,
        backref="taught"
    )

    student = relationship(
        Mathematician, primaryjoin=student_id == Mathematician.id,
        backref="learnt"
    )


engine = create_engine(DB_CONF)

Base.metadata.create_all(engine)
