import random
import json
import os.path
import datetime


exoplanets_data = json.loads(open("./nlpSlam/environment_story/exoplanets.json").read())
lovecraft_names_data = json.loads(open("./nlpSlam/environment_story/lovecraft.json").read())
lovecraft_words_data = json.loads(open("./nlpSlam/environment_story/lovecraft_words.json").read())

exoplanet = random.choice([item for item in exoplanets_data])
deities = lovecraft_names_data['deities']
supernatural_creatures = lovecraft_names_data['supernatural_creatures']

host_star_name = exoplanet['pl_hostname']
planet_letter = exoplanet['pl_letter']

planet_name = ''.join(host_star_name + planet_letter)
monster1 = random.choice(deities)
monster2 = random.choice(supernatural_creatures)

verb1 = ["was observing planet", "was imagining planet", "was contemplating planet", "was watching planet", "was colliding with planet", "was travelling from planet"]
element = ["ice", "stone", "rock", "rain", "cloud", "wind", "air"]
adj1 = ["was wet", "was fresh", "was fine", "was calm", "was strong", "was agnostic towards all creatures", "was healing our wounds"]

prep1 = ["As", "When", "As soon as", "As far as"]
verb2 = ["approached", "spoken", "materialized", "came", "was born"]
event = ["the sky has opened.", "the truth has been told.", "the judgement was received.", "the earth was burning.", "the forest was in fire."]

closing = ["Finally", "Eventually", "Lately", "Secretely", "Spontaneously"]
modal = ["decided to", "resolved to", "agreed to", "elected to"]
verb3 = ["escape to countryside", "continue to tundra", "enter the state of peaceful contemplation", "meditate on nature of things", "plan a trip to lowlands", "visit the river", "find a shelter for the night"]


story = monster1 + " " + random.choice(verb1) + " " + planet_name + ". The " + random.choice(element) + " " + random.choice(adj1) + ". " + random.choice(prep1) + " the " + monster2 + " " + random.choice(verb2) + ", " + random.choice(event) + " " + random.choice(closing) + " they both " + random.choice(modal) + " " + random.choice(verb3) + "."

save_path = "./output_glacier_story"

#### ------ uncomment to output file
#
# dict = {"story":
#         [story]
#         }
#
# complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_glacier_story" + ".json")
# with open(complete_name_json, "w") as f:
#     f.write(json.dumps(dict))

print(story)
