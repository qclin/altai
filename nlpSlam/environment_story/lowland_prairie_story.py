from random import choice
import json
import os.path
import datetime
import spacy

nlp = spacy.load('en_core_web_md')

text = open("altai_stories_brodsky.txt").read().decode('utf-8')
doc = nlp(text)

occupations_data = json.loads(open("occupations.json").read())

occupations = occupations_data['occupations']
occupation = [item for item in occupations]

agent1 = choice(occupation)
agent2 = choice(occupation)

noun_singular = [item.text for item in doc if item.tag_ == 'NN']
noun_plural = [item.text for item in doc if item.tag_ == 'NNS']
verb_past = [item.text for item in doc if item.tag_ == 'VBD']

noun1 = choice(noun_singular)
noun2 = choice(noun_singular)

noun_s1 = ["universe", "spirits", "police station", "danger", "peace", "loved ones", "neighbours", "village", "town", "farmers", "shepherds", "dogs", "Chinese", "Russians", "Mongolians", "Kazakhs"]

verb_s1 = ['reminded me of', 'reminded you of', 'reminded us of', 'recalled', 'brought to mind', 'evoked', 'suggested', 'seemed like', 'resembled', 'had the quality of']

opening_s1 = ["When", "As soon as"]

verb_s2_1 = ["escaped to countryside", "moved to highland prairie", "entered the state of peaceful contemplation", "finished meditation on nature of things", "planned a trip to lowlands", "visited the river", "found a shelter for the night", "continued to the town"]

verb_s2_2 = ["walked", "talked", "layed", "fought", "got high", "ran", "made a shelter"]

specification_s1 = ["nearby", "in the distance", "again", "somewhere", "intermittently", "accidentally"]

location = ["hill", "mountain", "forest", "field",
        "lake", "prairie", "river", "valley",
        "grassland", "soil", "landscape", "land", "grass"]

event1 = ["the earth has opened.", "the wisdom has been received.", "the judge decided.", "the sky was clear.", "the forest was calm.", "the fimilies reunited.", "the peasants celebrated."]

event2 = ["a sunrise came", "a moonlight came", "a twilight came", "a full moon showed up", "a sunset came", "a sunshine came", "a comet appeared", "an asteroid appeared", "a rocket fell from the sky"]

verb_s3 = ["were saved.", "found redemption.", "entered the cave.", "established a new settlement.", "spoke in foreign langauges.", "constructed a yurt.", "climbed up to highlands."]



story = "The " + choice(noun_s1) + " " + choice(verb_s1) + " the story about " + noun1 + " and " + noun2 + ". " + choice(opening_s1) + " " + agent1 + " and " + agent2 + " " + choice(verb_s2_1) + ", they " + choice(verb_s2_2) + " " + choice(specification_s1) + " on the " + choice(location) + ". After, " + choice(event1) + " Then " + choice(event2) + " and " + agent1 + " with " + agent2 + " " + choice(verb_s3)

save_path = "./output_lowland_prairie_story"

dict = {"story": 
        [story]
        }

complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_lowland_prairie_story" + ".json")
with open(complete_name_json, "w") as f:
    f.write(json.dumps(dict))