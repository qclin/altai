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
date_time = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")


save_path = "./output_common_story"

dict = {"story": 
		[date_time, filler_a, filler_b, filler_a, filler_b, filler_c]
		 }

complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_common_story" + ".json")

with open(complete_name_json, "w") as f:
	f.write(json.dumps(dict))