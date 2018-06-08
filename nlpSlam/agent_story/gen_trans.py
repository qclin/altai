import json
from random import choice, shuffle
import os.path
import datetime

with open('./parsed_trans_story/data.txt') as json_file:
    data = json.load(json_file)

adverbs = data['adverbs']
gerunds = data['gerunds']
entities = data['entities']

noun_phrase = data['noun_phrase']
noun_chunk = data['noun_chunk']

pronoun_possessive = data['pronoun_possessive']
pronoun_personal = data['pronoun_personal']
adjective_superlative = data['adjective_superlative']
noun_singular = data['noun_singular']
noun_plural = data['noun_plural']

verb_singular_third_present = data['verb_singular_third_present']
verb_non_third_present = data['verb_non_third_present']
infinitival_to = data['infinitival_to']
verb_base = data['verb_base']
verbs_modal = data['verbs_modal']
determiner = data['determiner']
conjunction_sub_pre = data['conjunction_sub_pre']
existential_there = data['existential_there']
adjective_base = data['adjective_base']
conjunction_coor = data['conjunction_coor']
verb_past = data['verb_past']
adverb = data['adverb']
adposition = data['adposition']



def gen_three_adj():
    return ', '.join([choice(adjective_base), choice(adjective_base), choice(adjective_base)])
def gen_sentence_a():
    string = "Our highest priority is to satisfy the customer through early and continuous delivery of valuable software"
    return ' '.join([choice(pronoun_possessive), choice(adjective_base), choice(noun_singular), choice(verb_singular_third_present),choice(infinitival_to), choice(verb_base), choice(determiner), choice(noun_singular), choice(conjunction_sub_pre), choice(adjective_base), choice(conjunction_coor), choice(adjective_base), choice(noun_singular), choice(conjunction_sub_pre), choice(adjective_base), choice(noun_singular)])

def gen_sentence_b():
    string = "You claim there are problems among us that you need to solve."
    return ' '.join(["You", choice(verb_non_third_present), choice(adverbs), "what", "we", choice(verb_past), choice(verb_singular_third_present), choice(adverbs), choice(noun_plural), choice(conjunction_sub_pre), "us", choice(adverbs), choice(noun_singular), choice(verb_singular_third_present)])

def gen_sentence_c():
        return ' '.join(["You", choice(verb_non_third_present), choice(noun_phrase)])


def gen_sentence_d():
        return ' '.join([choice(determiner), choice(noun_singular), choice(verbs_modal), choice(verb_base), choice(noun_plural)])

def gen_sentence_d_alt():
        return ' '.join([choice(determiner), choice(noun_singular), choice(verbs_modal), choice(verb_base), choice(adjective_base), choice(noun_plural)])

def gen_sentence_e():
    for i in range(1):
        return ' '.join([choice(infinitival_to), choice(verb_base), choice(determiner), choice(noun_singular), "is not", "the", choice(adjective_superlative)])

def gen_sentence_f():
    string = "I thought the heavenly axis was God, but I was wrong."
    return ' '.join(["I", choice(verb_past), choice(determiner), choice(adjective_base), choice(noun_singular), choice(verb_past), choice(noun_singular)])

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

s08 = gen_sentence_f()
s09 = gen_sentence_f()
s10 = gen_three_adj()
s11 = gen_sentence_a()

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

dict = {"story":
        [poem]
        }

complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_trans_story" + ".json")
with open(complete_name_json, "w") as f:
    f.write(json.dumps(dict))


print("\n\n\n".join(poems))
