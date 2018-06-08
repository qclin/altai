from __future__ import unicode_literals
from random import choice
import json
import os.path
import datetime
import nltk
#from nltk.corpus import gutenberg
import urllib2
import os.path
import spacy
import numpy as np
from numpy import dot
from numpy.linalg import norm

animal_data = json.loads(open("animals.json").read())
activities_data = json.loads(open("atus_activities.json").read())
pairs_data = json.loads(open("closed_pairs.json").read())

activities_categories = activities_data['categories']
pairs = pairs_data['pairs']
pair = [item for item in pairs]

#activities_examples = [item ['examples'] for item in activities_categories]
#activity = [item for item in activities_examples]

#print choice(activity)

#macbeth_sentences = gutenberg.sents('shakespeare-macbeth.txt')

#story = macbeth_sentences[1116]

num = choice(range(10000, 57000, 1))
num_str = str(num)

url = ''.join("http://www.gutenberg.org/cache/epub/" + num_str + "/pg" + num_str + ".txt")

#print url

text = urllib2.urlopen(url).read().decode('utf-8')

nlp = spacy.load('en_core_web_md')
doc = nlp(text)

#sents = [str(item) for item in doc.sents]
#sent = choice(sents)

#print sent

sentences = list(doc.sents)
words = [w for w in list(doc) if w.is_alpha]

def cosine(v1, v2):
    if norm(v1) > 0 and norm(v2) > 0:
        return dot(v1, v2) / (norm(v1) * norm(v2))
    else:
        return 0.0

def sentence_vector(sent):
    vec = np.array([w.vector for w in sent if w.has_vector and np.any(w.vector)])
    if len(vec) > 0:
        return np.mean(vec, axis=0)
    else:
        raise ValueError("no words with vectors found")   

def similar_sentences(input_str, num=1):
    input_vector = sentence_vector(nlp(input_str))
    return sorted(sentences,
                  key=lambda x: cosine(np.mean([w.vector for w in x], axis=0), input_vector),
                  reverse=True)[:num]

sentence_to_check = "There is ritual happening between two actors."

def get_sentence():
	for item in similar_sentences(sentence_to_check):
		return item.text.strip()

story = "The swamp forest speaks:\n" + "'" + get_sentence() + "'"

save_path_json = "./output_swamp_forest_story"

dict = {"url": [url], "story": [story]}

complete_name_json = os.path.join(save_path_json, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_swamp_forest_story" + ".json")
with open(complete_name_json, "w") as f:
    f.write(json.dumps(dict))