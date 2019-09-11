from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()


class Mathematician(Base):
    __tablename__ = 'mathematician'
    id = Column(Integer, primary_key=True, nullable=False)
    full_name = Column(String, nullable=False)

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
    advisor = relationship(
        Mathematician, primaryjoin=advisor_id == Mathematician.id,
        backref="learnt"
    )

    student = relationship(
        Mathematician, primaryjoin=student_id == Mathematician.id,
        backref="taught"
    )


engine = create_engine('sqlite:///mathematician.db')

Base.metadata.create_all(engine)
