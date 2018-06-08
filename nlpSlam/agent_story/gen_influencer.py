import random
import json
import os.path
import datetime

scifi_data = json.loads(open("sci_fi_technology_quotes.json").read())

paragraphs = scifi_data['Paragraphs']
quote = [item for item in paragraphs]

story = random.choice(quote)

save_path = "./output_influencer_story"

# dict = {"story":
#         [story]
#         }
#
# complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_influencer_story" + ".json")
# with open(complete_name_json, "w") as f:
#     f.write(json.dumps(dict))

print(story)
