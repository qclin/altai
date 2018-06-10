import json
from random import choice
import requests
import datetime
import os.path


with open('./nlpSlam/agent_story/parsed_altai_stories_brodsky/data.txt') as json_file:
    data = json.load(json_file)

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

def gen_sentence_f():
    string = "I thought the heavenly axis was God, but I was wrong."
    return ' '.join(["I", choice(verb_past), choice(determiner), choice(adjective_base), choice(noun_singular), choice(verb_past), choice(noun_singular)])

story = (gen_sentence_f() + "\n" + gen_sentence_f())

save_path = "./output_predator_story"

# dict = {"story":
#         [story]
#         }
#
# complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_predator_story" + ".json")
# with open(complete_name_json, "w") as f:
#     f.write(json.dumps(dict))

print(story)
