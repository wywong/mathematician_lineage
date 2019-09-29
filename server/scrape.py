import urllib.request
from bs4 import BeautifulSoup


class ScrapedMathematician:
    def __init__(self, id, full_name, advisor_ids, student_ids):
        self.id = id
        self.full_name = full_name
        self.advisor_ids = advisor_ids
        self.student_ids = student_ids

    def __str__(self):
        return "%s,%s,%s,%s" % (self.id, self.full_name, self.advisor_ids,
                                self.student_ids)


class MathematicanScraper:
    def scrape(id):
        baseUrl = "https://genealogy.math.ndsu.nodak.edu/id.php?id="
        html = urllib.request.urlopen(baseUrl + str(id)).read()
        soup = BeautifulSoup(html, "html.parser")
        name_header = soup.find('h2')
        if name_header is not None:
            full_name = name_header.text.strip()
            advisors = soup.find_all(lambda tag: tag.name == 'p' and
                                     'Advisor' in tag.text)
            advisor_ids = []
            for advisor in advisors:
                for a in advisor.find_all('a'):
                    advisor_ids.append(MathematicanScraper.extract_id(a))

            student_ids = []
            for table in soup.find_all('table'):
                for student in table.find_all('a'):
                    student_ids.append(MathematicanScraper.extract_id(student))

            return ScrapedMathematician(id,
                                        full_name,
                                        advisor_ids,
                                        student_ids)

    def extract_id(atag):
        return int(atag['href'].split('=')[-1])
