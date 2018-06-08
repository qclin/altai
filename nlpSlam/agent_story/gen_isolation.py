import json
from random import choice
import requests
import datetime
import os.path

moods_data = json.loads(open("./nlpSlam/moods.json").read())
mumblings_data = json.loads(open("mumblings.json").read())

mood = moods_data['moods']
mumbling = mumblings_data['mumblings']

mood1 = choice(mood)
mumbling1 = choice(mumbling)
mood2 = choice(mood)
mood3 = choice(mood)
mumbling2 = choice(mumbling)
mumbling3 = choice(mumbling)

save_path = "./output_isolation_story"

# dict = {"story":
#         [mood1, mumbling1, mood2, mood3, mumbling2, mumbling3]
#         }
#
# complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_isolation_story" + ".json")
# with open(complete_name_json, "w") as f:
#     f.write(json.dumps(dict))


output = [mood1, mumbling1, mood2, mood3, mumbling2, mumbling3]
print(output)
