# coding: utf-8
#if doesn't work in terminal, type following commands
#export LC_ALL=en_US.UTF-8
#export LANG=en_US.UTF-8

from __future__ import unicode_literals
import spacy
import sys
import datetime
from random import choice, shuffle

nlp = spacy.load('en_core_web_md')

text = open("./nlpSlam/queer_stories.txt").read().decode('utf-8') #NOTe: path is relative to root
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
    return ' '.join(["I", choice(verb_past), choice(determiner), choice(adjective_base),choice(noun_singular), choice(conjunction_sub_pre), choice(noun_singular)])#,"-", "but"]),
    # print ' '.join([choice(pronoun_personal), choice(verb_past), choice(adjective_base)]) #, choice(adjective_base), choice(noun_singular)]),
    # print ' '.join([choice(conjunction_sub_pre), choice(adjective_base), choice(noun_singular)])
    # print '----------------------------------------------'

def gen_sentence_g():
    string = "Our highest priority is to satisfy the customer through early and continuous delivery of valuable software"
    return ' '.join([choice(pronoun_possessive), choice(adjective_base), choice(noun_singular), choice(verb_singular_third_present),choice(infinitival_to), choice(verb_base), choice(determiner), choice(noun_singular), choice(conjunction_sub_pre), choice(adjective_base), choice(noun_singular), choice(conjunction_sub_pre), choice(adjective_base), choice(noun_singular)])
    # print '----------------------------------------------'


file = open(datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_pamphlet" + ".txt","w")

#s0A = gen_sentence_c()
#s0B = gen_sentence_b()
#s0C = gen_sentence_f()
#s0D = gen_sentence_b()
#s0E = gen_sentence_e()

#s01 = gen_sentence_a()
#s02 = gen_sentence_d()
#s03 = gen_sentence_f()
#s04 = gen_sentence_a()
#s05 = gen_three_adj()
#s06 = gen_sentence_d()
#s07 = gen_sentence_d()

#s08 = gen_sentence_f()
#s09 = gen_sentence_f()
#s10 = gen_three_adj()
#s11 = gen_sentence_a()

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


#file.write((s0A + "\n" + s0B + "\n" + s0C + "\n" + s0D + "\n" + s0E + "\n" + s01 + "\n" + s02 + "\n" + s03 + "\n" + s04 + "\n" + s05 + "\n" +
file.write((s18 + "\n" + s19 + "\n" + s20 + "\n" + s21 + "\n" + s22).lower())

# + "\n" + s05 + "\n" + s06 + "\n" + s07 + "\n" + s08 + "\n" + s09 + "\n" + s10 + "\n" + s11 + "\n" + s12 + "\n" + s13 + "\n" + s14 + "\n" + s15 + "\n" + s16 + "\n" + s17 + "\n" + s18 + "\n" + s19 + "\n" + s20 + "\n" + s21).lower())
#i know this solution is terrible, need to think more about something flexible

file.close()


### section is to pass to node server
output= (s18 + "\n" + s19 + "\n" + s20 + "\n" + s21 + "\n" + s22).lower()
print(output)
