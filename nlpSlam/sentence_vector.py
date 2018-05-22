# coding: utf-8

from __future__ import unicode_literals
from collections import Counter

import spacy
import random

import numpy as np
from numpy import dot
from numpy.linalg import norm

nlp = spacy.load('en_core_web_md')
text = open("altai_stories.txt").read().decode('utf-8')
doc = nlp(text)

sentences = list(doc.sents)
words = [w for w in list(doc) if w.is_alpha]
noun_chunks = list(doc.noun_chunks)
entities = list(doc.ents)

nouns = [w for w in words if w.pos_ == "NOUN"]
verbs = [w for w in words if w.pos_ == "VERB"]
adjs = [w for w in words if w.pos_ == "ADJ"]
advs = [w for w in words if w.pos_ == "ADV"]
pron = [w for w in words if w.pos_ == "PRON"]

# cosine similarity
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
def similar_sentences(input_str, num=10):
    input_vector = sentence_vector(nlp(input_str))
    return sorted(sentences,
                  key=lambda x: cosine(np.mean([w.vector for w in x], axis=0), input_vector),
                  reverse=True)[:num]

sentence_to_check = "Rituals are mystical practices of shamanism."
for item in similar_sentences(sentence_to_check):
    print(item.text.strip())
    print("")