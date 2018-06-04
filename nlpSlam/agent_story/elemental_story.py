from __future__ import unicode_literals
import spacy
import sys
import datetime
import random
from random import choice, shuffle
import json
import os.path
from nltk.corpus import wordnet as wn

nlp = spacy.load('en_core_web_md')

text = open("altai_stories_brodsky.txt").read().decode('utf-8')
doc = nlp(text)

pronoun_possessive = [item.text for item in doc if item.tag_ == 'PRP$']
pronoun_personal = [item.text for item in doc if item.tag_ == 'PRP']
adjective_superlative = [item.text for item in doc if item.tag_ == 'JJS']
noun_singular = [item.text for item in doc if item.tag_ == 'NN']
noun_plural = [item.text for item in doc if item.tag_ == 'NNS']

verb_singular_third_present = [item.text for item in doc if item.tag_ == 'VBZ']
verb_non_third_present = [item.text for item in doc if item.tag_ == 'VBP']
infinitival_to = [item.text for item in doc if item.tag_ == 'TO']
verb_base = [item.text for item in doc if item.tag_ == 'VB']
verbs_modal = [item.text for item in doc if item.tag_ == 'MD']
determiner = [item.text for item in doc if item.tag_ == 'DT']
conjunction_sub_pre = [item.text for item in doc if item.tag_ == 'IN']
existential_there = [item.text for item in doc if item.tag_ == 'EX']
adjective_base = [item.text for item in doc if item.tag_ == 'JJ']
conjunction_coor = [item.text for item in doc if item.tag_ == 'CC']
verb_past = [item.text for item in doc if item.tag_ == 'VBD']
adverb = [item.text for item in doc if item.tag_ == 'RB']
adposition = [item.text for item in doc if item.tag_ == 'ADP']


determiner1 = choice(determiner)
object1 = choice(noun_singular)
possesive_pronoun1 = choice(pronoun_possessive)
property_of_object1 = choice(adjective_base)
object2 = choice(noun_singular)
state_of_object2 = choice(adjective_base)
adj1 = choice(adjective_base)
object3_plural = choice(noun_plural)
noun1 = choice(noun_singular)
noun2 = choice(noun_singular)
object4_plural = choice(noun_plural)
object5_plural = choice(noun_plural)
verb1 = choice(verb_non_third_present)
verb2 = choice(verb_non_third_present)
object6_plural = choice(noun_plural)
verb3 = choice(verb_non_third_present)
possesive_pronoun2 = choice(pronoun_possessive)
adj2 = choice(adjective_base)
object7 = choice(noun_singular)
verb4_third_person = choice(verb_singular_third_present)
adj3 = choice(adjective_base)
object6 = wn.morphy(object6_plural)
adj4 = choice(adjective_base)



story = (determiner1 + " " + object1 + ". " + possesive_pronoun1 + " " + property_of_object1 + ", " + "and\n" + object2 + ", " + state_of_object2 + ".\n" + adj1 + " " + object3_plural + ".\n" + noun1 + " and " + noun2 + " of " + object4_plural + ".\n" + object5_plural + " " + verb1 + " and " + verb2 + ".\n" + object6_plural + " " + verb3 + " " + possesive_pronoun2 + " " + adj2 + " " + object7 + "\n" + "which" + " " + verb4_third_person + " " + adj3 + ".\n" + "this" + " " + object6 + " is " + adj4 + ".").lower()

save_path = "./output_elemental_story"

dict = {"story": 
        [story]
        }

complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_elemental_story" + ".json")
with open(complete_name_json, "w") as f:
    f.write(json.dumps(dict))