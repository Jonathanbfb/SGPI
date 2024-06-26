from set_proxy import SetProxies
from search_links import SearchLinks
from collect_pdf import CollectPdf
from datetime import datetime
import sys
import threading
#------------------------------------------------------------------------------------------------------
from google_patent_scraper import scraper_class
import json
#------------------------------------------------------------------------------------------------------


class GooglePatentsScraper():

    def __init__(self, search_term):
        super().__init__()
        self.collectpdf = None
        self.searchlinks = None
        self.setproxies_dialog = None
        self.collectpdf_thread = None
        self.numbers = None
        self.titles = None
        self.links = None
        self.proxy = None
        self.start_search(search_term)

    #------------------------------------------------------------------------------------------------------
    def scrapping_specific_information(self, patent):
        scraper = scraper_class()
        
        err_1, soup_1, url_1 = scraper.request_single_patent(patent)
        patent_parsed = scraper.get_scraped_data(soup_1,patent,url_1)

        print('\n\n-----------------------------------------------------------------------\n\n')
        print(patent_parsed['inventor_name'])
        print('\n\n-----------------------------------------------------------------------\n\n')

        self.dados_resultados.append(patent_parsed)
    #------------------------------------------------------------------------------------------------------

    def set_proxy(self, ip):
        self.proxy = ip
        self.proxyLabel.setText(f'<span style="color:Chocolate">Current Proxy: {self.proxy}</span>')

    def on_setproxies_selected(self):
        """Setta os proxies"""

        self.proxies = input()

        if not self.proxies:
            self.proxies = SetProxies()
            #self.proxies.proxy_selected.connect(self.set_proxy)
        print(self.proxies)

    def start_search(self, search_term):

        self.searchtermsEdit = search_term

        if self.searchtermsEdit == '':
            print('Please enter your search terms first.')

        else:
            self.searchlinks = SearchLinks(self.proxy)
            self.searchlinks.search(self.searchtermsEdit)
            self.numbers, self.titles = self.searchlinks.collect_links()

            self.dados_resultados = []

            '''
            #------------------------------------------------------------------------------------------------------
            i = 0 
            for s in self.numbers:
                if i <= 10:
                    self.scrapping_test(s)
                i+=1
            #------------------------------------------------------------------------------------------------------
            '''

            self.links = [f'https://patents.google.com/patent/{s}/en' for s in self.numbers]

            self.resultados = []
            self.print_search_result()

            #return (self.resultados, self.dados_resultados)

    def on_downloadButton_clicked(self):
        self.update_log('Preparing your download...')
        self.collectpdf = CollectPdf(self.directoryEdit.text())
        self.collectpdf.signal_update.connect(self.update_log)
        self.collectpdf.signal_download_progress.connect(self.update_progressbar)
        self.collectpdf_thread = threading.Thread(target=self.collectpdf.start_download,
                                                  args=(self.links, self.searchtermsEdit(),
                                                        self.downloadoptionsBox.currentIndex()))
        self.collectpdf_thread.start()

    def update_progressbar(self, percentage):
        self.progressBar.setValue(percentage)

    def update_log(self, message):
        self.logBrowser.append(f'({datetime.today().strftime("%H:%M:%S")}) {message}')

    def print_search_result(self):
        s = []

        for index, (number, title) in enumerate(zip(self.numbers, self.titles), start=1):
            link = f'https://patents.google.com/patent/{number}/en'
            a = f'{f"({index})":<4}{number:<12} : {title}'
            var = {'link':link, 'titulo':title}
            s.append(var)
        self.resultados = s
        '''
        for i in s:
            print(i)
        print('\n\n------------------------ END PROCESS ------------------------\n\n')
        print(f'(About {len(self.numbers)} results)')
        '''

    '''
    def print_search_result(self):
        s = ''
        s += '<style type="text/css">a{text-decoration: none; cursor: pointer;}</style>'
        # remember to set font of TextBrowser to "Monospaced Font" (I choose Monaco)
        for index, (number, title) in enumerate(zip(self.numbers, self.titles), start=1):
            link = f'https://patents.google.com/patent/{number}/en'
            a = f'{f"({index})":<4}{number:<12} : {title}'
            #--------------------------------------------------
            k = {'patent link':link}
            self.resultados.append(k) 
            #--------------------------------------------------
            #s += f'<a href="{link}">{a.replace(" ", "&nbsp;")}</a><br>'
            s += link + '\n\n'

        #print(s)
        #print('\n\n------------------------ END PROCESS ------------------------\n\n')
        #print(f'(About {len(self.numbers)} results)')
    '''
    
    def on_openfolderButton_selected(self):
        if not open('file://' + self.directoryEdit.text()):
            print('Could not open output directory.')


#print(GooglePatentsScraper('Fourrier').resultados)