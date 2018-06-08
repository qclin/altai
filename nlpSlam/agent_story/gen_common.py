import json
import random
import requests
import datetime
import os.path


fillers_data = json.loads(open("fillers.json").read())

filler = fillers_data['fillers']

filler_a = random.choice(filler)
filler_b = random.choice(filler)
filler_c = random.choice(filler)

# General_Data_Protection_Regulation
verbs = fillers_data['verbs']
propositions = fillers_data['propositions']
noun_chunks = fillers_data['noun_chunks']
verb = random.choice(verbs)
proposition = random.choice(propositions)
noun_chunk= random.choice(noun_chunks)
noun_chunk2= random.choice(noun_chunks)

date_time = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")


save_path = "./output_common_story"

# story = [date_time, filler_a, filler_b, filler_a, filler_b, filler_c]
story = [date_time, verb, noun_chunk, proposition, noun_chunk2]
dict = {"story": story}

# complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_common_story" + ".json")
#
# with open(complete_name_json, "w") as f:
# 	f.write(json.dumps(dict))


## temp solution for server
print(' '.join(story))
