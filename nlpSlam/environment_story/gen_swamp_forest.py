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
import ast


animal_data = json.loads(open("animals.json").read())
activities_data = json.loads(open("atus_activities.json").read())
pairs_data = json.loads(open("closed_pairs.json").read())

activities_categories = activities_data['categories']
pairs = pairs_data['pairs']
pair = [item for item in pairs]

save_path_txt = "./parsed_gutenberg"

lines = []
with open("./num_gutenberg/num.txt") as file:
    for line in file:
        line = line.strip() #or some other preprocessing
        lines.append(line) #storing everything in memory!

# with open("./num_gutenberg/num.txt") as f:
#     nums = f.readlines()

num = choice(lines)

##TODO:  fails to load ./parsed_gutenberg/doc#####_data.txt file, bcs of issue above
name_doc = os.path.join(save_path_txt, "doc" + num + "_data.txt")

print name_doc

with open(str(name_doc)) as json_file:
    data = json.load(json_file)

sentences = data['sentences']
words = data['words']

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

#### ------ uncomment to output file
# dict = {"url": [url], "story": [story]}
#
# complete_name_json = os.path.join(save_path_json, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_swamp_forest_story" + ".json")
# with open(complete_name_json, "w") as f:
#     f.write(json.dumps(dict))

print(story)
