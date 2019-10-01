import json
import urllib.request
from bs4 import BeautifulSoup
from urllib.parse import quote


class ScrapedMathematician:
    def __init__(self,
                 id,
                 full_name,
                 advisor_ids,
                 student_ids,
                 image=None,
                 wiki_url=None):
        self.id = id
        self.full_name = full_name
        self.advisor_ids = advisor_ids
        self.student_ids = student_ids
        self.image = image
        self.wiki_url = wiki_url

    def __str__(self):
        return "%s,%s,%s,%s" % (self.id, self.full_name, self.advisor_ids,
                                self.student_ids)


class MathematicianScraper:
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
                    advisor_ids.append(MathematicianScraper.extract_id(a))

            student_ids = []
            for table in soup.find_all('table'):
                for student in table.find_all('a'):
                    student_ids.append(MathematicianScraper.extract_id(student))

            image = None
            wiki_url = None
            try:
                wiki_url, image = MathematicianScraper.get_image(full_name)
            except Exception as e:
                pass
            return ScrapedMathematician(id,
                                        full_name,
                                        advisor_ids,
                                        student_ids,
                                        image,
                                        wiki_url)

    def get_image(name):
        base_wiki_url = 'https://en.wikipedia.org/w/api.php'
        request_url = base_wiki_url + '?action=opensearch&search=%s&format=json' \
            % quote(name)
        resp_json = json.load(
            urllib.request.urlopen(request_url)
        )
        redirects = resp_json[-1]
        if len(redirects) > 0:
            request_page_url = redirects[0]
            html = urllib.request.urlopen(request_page_url).read()
            soup = BeautifulSoup(html, "html.parser")
            for select in soup.select('table.infobox.biography.vcard'):
                for img in select.select('img'):
                    img_url = 'https:' + img['src']
                    resp = urllib.request.urlopen(img_url)
                    if resp.status == 200:
                        return (request_page_url, resp.read())

    def extract_id(atag):
        return int(atag['href'].split('=')[-1])


