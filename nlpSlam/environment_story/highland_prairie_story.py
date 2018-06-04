from random import choice
import json
import os.path
import datetime

animal_data = json.loads(open("animals.json").read())
mood_data = json.loads(open("moods.json").read())
time_data = json.loads(open("units_of_time.json").read())
monster_data = json.loads(open("monsters.json").read())

animals = animal_data['animals']
moods = mood_data['moods']
monsters = monster_data['names']
times = time_data['formal_time_units']

monster = choice([item for item in monsters])
animal = choice([item for item in animals])
time = choice([item for item in times])

location_s1 = ["hill", "mountain", "forest", "field",
        "lake", "prairie", "river", "valley",
        "grassland", "soil", "landscape", "land"]

verb_s1 = ["was", "has been"]
state_s1 = ["floating", "looming", "standing", "situated", "flowing", "fixed"]
specification_s1 = ["nearby", "in the distance", "again", "somewhere", "intermittently", "accidentally"]


verb1_s2 = ['reminded me of', 'reminded you of', 'reminded us of', 'recalled', 'brought to mind', 'evoked', 'suggested', 'seemed like', 'resembled', 'had the quality of']
pronoun_s2 = ['I', 'you', 'we', 'they']
adverb_s2 = ['somehow', 'at the time', 'sometimes', 'at first', 'maybe']
modal_s2 = ["decided to", "resolved to", "agreed to", "elected to"]
adverb_s2 = ["reluctantly", "discreetly", "foolishly", "regretfully", "at last", "finally", "hastily"]
verb2_s2 = ["became aware of", "sensed", "saw", "approached", "felt the presence of", "found", "came across", "heard", "encountered", "happened upon", "smelled", "perceived"]
noun_s2 = ["universe", "spirits", "police station", "danger", "peace", "loved ones", "neighbours", "village", "town", "farmers", "shepherds", "dogs", "Chinese", "Russians", "Mongolians", "Kazakhs"]

verb_s3 = ["feeding", "educating", "explaining wisdom to", "teaching"]

event = ["a sunrise came", "a moonlight came", "a twilight came", "a full moon showed up", "a sunset came", "a sunshine came", "a comet appeared", "an asteroid appeared", "a rocket fell from the sky"]

situation = ["it was raining", "a light breeze was moving the air", "the earth was crumbling", "the mountains has spoken", "the trees were falling", "the sky was bright", "the rivers moved"]


story = "There was " + choice(location_s1) + " " + choice(state_s1) + " " + choice(specification_s1) + " on horizon. " + "When " + animal + " " + choice(verb2_s2) + " the " + monster + ", " + choice(situation) + ". The scene " + choice(verb1_s2) + " ritual dance. The " + animal + " " + choice(verb_s1) + " " + choice(verb_s3) + " the " + monster + ". It took " + time + ". Then " + choice(event) + ", and " + animal + " with " + monster + " " + choice(modal_s2) + " return to " + choice(noun_s2) + "."

save_path = "./output_highland_prairie_story"

dict = {"story": 
        [story]
        }

complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_highland_prairie_story" + ".json")
with open(complete_name_json, "w") as f:
    f.write(json.dumps(dict))