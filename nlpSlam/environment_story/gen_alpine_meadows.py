import json
from random import choice
import requests
import datetime
import os.path

with open('./parsed_altai_stories_brodsky/data.txt') as json_file:
    data = json.load(json_file)

entity = data['entity']

chemicals_data = json.loads(open("PeriodicTableJSON.json").read())

elements = chemicals_data['elements']
element_summary = [item ['summary'] for item in elements]

event = ["a sunrise came", "a moonlight came", "a twilight came", "a full moon showed up", "a sunset came", "a sunshine came", "a comet appeared", "an asteroid appeared", "a rocket fell from the sky"]
situation = ["It was raining", "A fog covered the meadows", "A light breeze was moving the air", "The earth was crumbling", "The mountains has spoken", "The trees were falling", "The sky was bright", "The alpine streams were flowing"]
closing = ["Finally, ", "Eventually, ", "Lately, ", "Secretely, ", "Spontaneously, "]
verb1 = [" told the story: '", " told the truth: '", " came to life and then spoke: '", " was awaken and then spoke: '"]
modal = ["decided to", "resolved to", "agreed to", "elected to"]
verb2 = ["escape to countryside", "move to glacier", "enter the state of peaceful contemplation", "meditate on nature of things", "plan a trip to lowlands", "visit the river", "find a shelter for the night"]

actor = choice(entity)

story = choice(situation) + " and " + choice(event) + ". " + choice(closing) + actor + choice(verb1) + choice(element_summary) + "'" + " Then, " + actor + " " + choice(modal) + " " + choice(verb2) + "."

save_path = "./output_alpine_meadows_story"

#### ------ uncomment to output file

# dict = {"story": [story]}
#
# complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_alpine_meadows_story" + ".json")
#
# with open(complete_name_json, "w") as f:
# 	f.write(json.dumps(dict))

print(story)
