import json
from random import choice, shuffle

with open('./nlpSlam/data.txt') as json_file: # path relative to root
    data = json.load(json_file)


def gen_three_adj():
    return ', '.join([choice(data["adjective_base"]), choice(data["adjective_base"]), choice(data["adjective_base"])])
def gen_sentence_a():
    string = "Our highest priority is to satisfy the customer through early and continuous delivery of valuable software"
    return ' '.join([choice(data["pronoun_possessive"]), choice(data["adjective_base"]), choice(data["noun_singular"]), choice(data["verb_singular_third_present"]),choice(data["infinitival_to"]), choice(data["verb_base"]), choice(data["determiner"]), choice(data["noun_singular"]), choice(data["conjunction_sub_pre"]), choice(data["adjective_base"]), choice(data["conjunction_coor"]), choice(data["adjective_base"]), choice(data["noun_singular"]), choice(data["conjunction_sub_pre"]), choice(data["adjective_base"]), choice(data["noun_singular"])])
    # print '----------------------------------------------'

def gen_sentence_b():
    string = "You claim there are problems among us that you need to solve."
    #return pronoun_personal, data["verb_non_third_present"], existential_there
    #for i in range(1):
    return ' '.join(["You", choice(data["verb_non_third_present"]), choice(data["adverbs"]), "what", "we", choice(data["verb_past"]), choice(data["verb_singular_third_present"]), choice(data["adverbs"]), choice(data["noun_plural"]), choice(data["conjunction_sub_pre"]), "us", choice(data["adverbs"]), choice(data["noun_singular"]), choice(data["verb_singular_third_present"])])
        #print ' '.join([choice(data["verb_non_third_present"]), choice(data["infinitival_to"]), choice(data["verb_base"])])

def gen_sentence_c():
        return ' '.join(["You", choice(data["verb_non_third_present"]), choice(data["noun_phrase"])])

def gen_sentence_d():
        # DT + NN + MD + VB + NNS
        # data["noun_singular"] maybe replace with entity
        return ' '.join([choice(data["determiner"]), choice(data["noun_singular"]), choice(data["verbs_modal"]), choice(data["verb_base"]), choice(data["noun_plural"])])

def gen_sentence_d_alt():
        # DT + NN + MD + VB + NNS
        # data["noun_singular"] maybe replace with entity
        return ' '.join([choice(data["determiner"]), choice(data["noun_singular"]), choice(data["verbs_modal"]), choice(data["verb_base"]), choice(data["adjective_base"]), choice(data["noun_plural"])])

def gen_sentence_e():
    for i in range(1):
        # TO + VB + DT + NN + VBZ + RB + DT + NN
        # [this is not that] should try to use antynomns
        return ' '.join([choice(data["infinitival_to"]), choice(data["verb_base"]), choice(data["determiner"]), choice(data["noun_singular"]), "is not", "the", choice(data["adjective_superlative"])])
        #choice(data["verb_non_third_present"]), choice(data["adverbs"])
        # print ' '.join([choice(data["determiner"]), choice(data["noun_singular"])])
        print choice(data["subjects"])

def gen_sentence_f():
    string = "I thought the heavenly axis was God, but I was wrong."
    return ' '.join(["I", choice(data["verb_past"]), choice(data["determiner"]), choice(data["adjective_base"]),choice(data["noun_singular"]), choice(data["conjunction_sub_pre"]), choice(data["noun_singular"])])#,"-", "but"]),
    # print ' '.join([choice(pronoun_personal), choice(data["verb_past"]), choice(data["adjective_base"])]) #, choice(data["adjective_base"]), choice(data["noun_singular"])]),
    # print ' '.join([choice(data["conjunction_sub_pre"]), choice(data["adjective_base"]), choice(data["noun_singular"])])

def gen_sentence_g():
    string = "Our highest priority is to satisfy the customer through early and continuous delivery of valuable software"
    return ' '.join([choice(data["pronoun_possessive"]), choice(data["adjective_base"]), choice(data["noun_singular"]), choice(data["verb_singular_third_present"]),choice(data["infinitival_to"]), choice(data["verb_base"]), choice(data["determiner"]), choice(data["noun_singular"]), choice(data["conjunction_sub_pre"]), choice(data["adjective_base"]), choice(data["noun_singular"]), choice(data["conjunction_sub_pre"]), choice(data["adjective_base"]), choice(data["noun_singular"])])


s18 = gen_sentence_d()
s19 = gen_sentence_d()
s20 = gen_sentence_d()
s21 = gen_sentence_d_alt()
s22 = gen_three_adj()

output= (s18 + "\n" + s19 + "\n" + s20 + "\n" + s21 + "\n" + s22).lower()
print(output)
