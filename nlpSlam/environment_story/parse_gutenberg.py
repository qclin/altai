import urllib2
import os.path
import spacy
from random import choice
import json


def do_spacy(text, num):
	nlp = spacy.load('en_core_web_md')
	doc = nlp(text)
	sentences = list(str(doc.sents))
	words = [str(w) for w in list(doc) if w.is_alpha]
	data = {"sentences": sentences, "words": words}
	save_path_txt = "./parsed_gutenberg"
	complete_name_txt = os.path.join(save_path_txt, "doc" + str(num) + "_data" + ".txt")
	file_txt = open(complete_name_txt, "w")
	file_txt.write(str(data))
	file_txt.close()

def get_gutenberg():
	num = choice(range(10000, 57000, 1))
	num_str = str(num)
	url = ''.join("http://www.gutenberg.org/cache/epub/" + num_str + "/pg" + num_str + ".txt")

	try:
	    req = urllib2.Request(url)
	    # create a request object

	    handle = urllib2.urlopen(req)
	    # and open it to return a handle on the url
	except urllib2.HTTPError, e:
	    print 'We failed with error code - %s.' % e.code

	    if e.code == 404:
	        # do stuff..  
	        print('FAILED 404')
	        get_gutenberg()
	    else:
	        # other stuff...

		    return False
	else: 
		print(url)
		with open("./num_gutenberg/num.txt", "a+") as f:
			f.write("\n" + num_str)
		text = urllib2.urlopen(url).read().decode('utf-8')
		do_spacy(text, num)

get_gutenberg()