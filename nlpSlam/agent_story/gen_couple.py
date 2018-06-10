# coding: utf-8
#if doesn't work in terminal, type following commands
#export LC_ALL=en_US.UTF-8
#export LANG=en_US.UTF-8

import datetime
import random
from random import choice
import json
import os.path
from nltk.corpus import wordnet as wn
from nltk.corpus import framenet as fn
from pattern.en import comparative, superlative

sentences_data = json.loads(open("./nlpSlam/agent_story/harvard_sentences.json").read())
descriptions_data = json.loads(open("./nlpSlam/agent_story/descriptions.json").read())
scientists_data = json.loads(open("./nlpSlam/agent_story/scientists.json").read())
occupations_data = json.loads(open("./nlpSlam/agent_story/occupations.json").read())
exoplanets_data = json.loads(open("./nlpSlam/agent_story/exoplanets.json").read())
animal_data = json.loads(open("./nlpSlam/agent_story/animals.json").read())

exoplanet = random.choice([item for item in exoplanets_data])
host_star_name = exoplanet['pl_hostname']
planet_letter = exoplanet['pl_letter']
planet_name = ''.join(host_star_name + planet_letter)

sentences = sentences_data['data']
sentence = [item for item in sentences]
description = descriptions_data['descriptions']
scientist = scientists_data['scientists']
occupations = occupations_data['occupations']
animals = animal_data['animals']

occupation = [item for item in occupations]
animal = choice([item for item in animals])

with open('./nlpSlam/agent_story/parsed_altai_stories_brodsky/data.txt') as json_file:
    data = json.load(json_file)

adjective_base = data['adjective_base']

adjective = choice(adjective_base)
adjective_synset = wn.synsets(adjective)[0]
#contra_adjective = adjective_synset.lemmas()[0].antonyms()

adjective_comparative = comparative(adjective)
adjective_superlative = superlative(adjective)

story = ("A: " + choice(sentence) + "\n" + "B: " + choice(scientist) + " is " + adjective + "\n" + "A: The " + choice(occupation) + " has been " + adjective_comparative + "\nB: There was " + animal + " that was " + choice(description) + "\nA: " + planet_name + " is " + adjective_superlative)

save_path = "./output_couple_story"

# dict = {"story":
#         [story]
#         }
#
# complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_couple_story" + ".json")
# with open(complete_name_json, "w") as f:
#     f.write(json.dumps(dict))
#
# #synsets are not giving me antonyms, this relation is defined only on lemmas
# #cf. http://www.nltk.org/howto/wordnet.html

print(story)
