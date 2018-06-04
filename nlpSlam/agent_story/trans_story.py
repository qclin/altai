# coding: utf-8
#if doesn't work in terminal, type following commands
#export LC_ALL=en_US.UTF-8
#export LANG=en_US.UTF-8

from __future__ import unicode_literals
import spacy
import sys
import datetime
import random
from random import choice, shuffle
import json
import os.path

nlp = spacy.load('en_core_web_md')

text = open("trans_stories.txt").read().decode('utf-8')
doc = nlp(text)

adverbs = [item.text for item in doc if item.pos_ == 'ADV']
gerunds = [item.text for item in doc if item.tag_ == 'VBG']
entity = [item.text for item in doc.ents if item.tag__ == 'PRODUCT']



def flatten_subtree(st):
    return ''.join([w.text_with_ws for w in list(st)]).strip()

noun_phrase = [item.text.strip() for item in doc.noun_chunks if len(item.text.split(' ')) > 1]
noun_chunk = [item.text for item in doc.noun_chunks]

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

# location = [e for e in entities if e.label_ == 'LOC']

def gen_three_adj():
    return ', '.join([choice(adjective_base), choice(adjective_base), choice(adjective_base)])
def gen_sentence_a():
    string = "Our highest priority is to satisfy the customer through early and continuous delivery of valuable software"
    return ' '.join([choice(pronoun_possessive), choice(adjective_base), choice(noun_singular), choice(verb_singular_third_present),choice(infinitival_to), choice(verb_base), choice(determiner), choice(noun_singular), choice(conjunction_sub_pre), choice(adjective_base), choice(conjunction_coor), choice(adjective_base), choice(noun_singular), choice(conjunction_sub_pre), choice(adjective_base), choice(noun_singular)])
    # print '----------------------------------------------'

def gen_sentence_b():
    string = "You claim there are problems among us that you need to solve."
    #return pronoun_personal, verb_non_third_present, existential_there
    #for i in range(1):
    return ' '.join(["You", choice(verb_non_third_present), choice(adverbs), "what", "we", choice(verb_past), choice(verb_singular_third_present), choice(adverbs), choice(noun_plural), choice(conjunction_sub_pre), "us", choice(adverbs), choice(noun_singular), choice(verb_singular_third_present)])
        #print ' '.join([choice(verb_non_third_present), choice(infinitival_to), choice(verb_base)])
        #print '----------------------------------------------'


def gen_sentence_c():
        return ' '.join(["You", choice(verb_non_third_present), choice(noun_phrase)])


def gen_sentence_d():
        # DT + NN + MD + VB + NNS
        # noun_singular maybe replace with entity
        return ' '.join([choice(determiner), choice(noun_singular), choice(verbs_modal), choice(verb_base), choice(noun_plural)])

def gen_sentence_d_alt():
        # DT + NN + MD + VB + NNS
        # noun_singular maybe replace with entity
        return ' '.join([choice(determiner), choice(noun_singular), choice(verbs_modal), choice(verb_base), choice(adjective_base), choice(noun_plural)])

def gen_sentence_e():
    for i in range(1):
        # TO + VB + DT + NN + VBZ + RB + DT + NN
        # [this is not that] should try to use antynomns
        return ' '.join([choice(infinitival_to), choice(verb_base), choice(determiner), choice(noun_singular), "is not", "the", choice(adjective_superlative)]) 
        #choice(verb_non_third_present), choice(adverbs)
        # print ' '.join([choice(determiner), choice(noun_singular)])
        print choice(subjects)

def gen_sentence_f():
    string = "I thought the heavenly axis was God, but I was wrong."
    return ' '.join(["I", choice(verb_past), choice(determiner), choice(adjective_base), choice(noun_singular), choice(verb_past), choice(noun_singular)])#,"-", "but"]),
    # print ' '.join([choice(pronoun_personal), choice(verb_past), choice(adjective_base)]) #, choice(adjective_base), choice(noun_singular)]),
    # print ' '.join([choice(conjunction_sub_pre), choice(adjective_base), choice(noun_singular)])
    # print '----------------------------------------------'

def gen_sentence_g():
    string = "Our highest priority is to satisfy the customer through early and continuous delivery of valuable software"
    return ' '.join([choice(pronoun_possessive), choice(adjective_base), choice(noun_singular), choice(verb_singular_third_present),choice(infinitival_to), choice(verb_base), choice(determiner), choice(noun_singular), choice(conjunction_sub_pre), choice(adjective_base), choice(noun_singular), choice(conjunction_sub_pre), choice(adjective_base), choice(noun_singular)])
    # print '----------------------------------------------'

def gen_noun_chunk():
    return choice(noun_chunk)

def gen_sentence_h():
    return ' '.join([choice(noun_chunk), choice(verbs_modal), choice(verb_base), choice(noun_plural)])

def gen_sentence_i():
    return ' '.join(["If", choice(noun_chunk), "will", choice(verb_base), choice(adjective_base), choice(pronoun_personal), "will", choice(verb_base), choice(noun_singular)])


s0A = gen_sentence_c()
s0B = gen_sentence_b()
s0C = gen_sentence_f()
s0D = gen_sentence_b()
s0E = gen_sentence_e()

#s01 = gen_sentence_a()
#s02 = gen_sentence_d()
#s03 = gen_sentence_f()
#s04 = gen_sentence_a()
#s05 = gen_three_adj()
#s06 = gen_sentence_d()
#s07 = gen_sentence_d()

s08 = gen_sentence_f()
s09 = gen_sentence_f()
s10 = gen_three_adj()
s11 = gen_sentence_a()

#s12 = gen_sentence_g()
#s13 = gen_sentence_d()
#s14 = gen_sentence_g()
#s15 = gen_three_adj()
#s16 = gen_sentence_d()
#s17 = gen_sentence_d()

s18 = gen_sentence_d()
s19 = gen_sentence_d()
s20 = gen_sentence_d()
s21 = gen_sentence_d_alt()
s22 = gen_three_adj()

s23 = gen_noun_chunk()
s24 = gen_sentence_h()
s25 = gen_sentence_h()
s26 = gen_sentence_i()


poem1 = (s0A + "\n" + s0B + "\n" + s0C + "\n" + s0D  + "\n" + s0E).lower()
poem2 = (s18 + "\n" + s19 + "\n" + s20 + "\n" + s21 + "\n" + s22).lower()
poem3 = (s08 + "\n" + s09 + "\n" + s10 + "\n" + s11).lower()
poem4 = (s23 + "\n" + s24 + "\n" + s25 + "\n" + s26).lower()

poems = [poem1, poem2, poem3, poem4]
poem = choice(poems)

save_path = "./output_trans_story"
#complete_name_txt = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_trans_story" + ".txt")
#file_txt = open(complete_name_txt, "w")

#file_txt.write(poem)
#file_txt.close() 

dict = {"story": 
        [poem]
        }

complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_trans_story" + ".json")
with open(complete_name_json, "w") as f:
    f.write(json.dumps(dict))




