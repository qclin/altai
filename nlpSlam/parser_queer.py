# coding: utf-8
#if doesn't work in terminal, type following commands
#export LC_ALL=en_US.UTF-8
#export LANG=en_US.UTF-8

from __future__ import unicode_literals
import spacy
import sys
import datetime
from random import choice, shuffle
import json


nlp = spacy.load('en_core_web_md')

text = open("./queer_stories.txt").read().decode('utf-8') #NOTe: path is relative to root
doc = nlp(text)

adverbs = [item.text for item in doc if item.pos_ == 'ADV']
gerunds = [item.text for item in doc if item.tag_ == 'VBG']
entities = [item.text for item in doc.ents]
# for item in doc.noun_chunks:
#     print len(item.text.split(' '))

def flatten_subtree(st):
    return ''.join([w.text_with_ws for w in list(st)]).strip()

noun_phrase = [item.text.strip() for item in doc.noun_chunks if len(item.text.split(' ')) > 1]

subjects = []
for word in doc:
    if word.dep_ in ('nsubj', 'nsubjpass'):
        subjects.append(flatten_subtree(word.subtree))


prep_phrases = []
for word in doc:
    if word.dep_ == 'prep':
        prep_phrases.append(flatten_subtree(word.subtree))

verbs_non_modal = []

for item in doc:
    if item.pos_ == 'VERB':
      # print item.text, item.tag_
      if item.tag_ == 'MD':
        #   do nothing
        string = "useless"
      else:
        verbs_non_modal.append(item.text)

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

data = { "verbs_non_modal": verbs_non_modal, "prep_phrases": prep_phrases, "subjects": subjects,  "noun_phrase": noun_phrase, "entities": entities, "gerunds": gerunds, "adverbs": adverbs, "pronoun_possessive" :pronoun_possessive , "pronoun_personal" :pronoun_personal, "adjective_superlative": adjective_superlative, "noun_singular": noun_singular, "noun_plural": noun_plural, "verb_singular_third_present": verb_singular_third_present, "verb_non_third_present": verb_non_third_present, "infinitival_to": infinitival_to, "verb_base": verb_base, "verbs_modal": verbs_modal, "determiner": determiner, "conjunction_sub_pre" : conjunction_sub_pre, "existential_there": existential_there, "adjective_base": adjective_base, "conjunction_coor": conjunction_coor, "verb_past": verb_past, "adverb": adverb, "adposition": adposition }


with open('data.txt', 'w') as outfile:
    json.dump(data, outfile)
