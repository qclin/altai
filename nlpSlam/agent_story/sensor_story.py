#simplified version of recognition

import json
from random import choice
import requests
import datetime
import os.path


iss_data = requests.get("http://api.open-notify.org/iss-now.json").json()
colour_data = json.loads(open("palettes.json").read())

iss_position = iss_data['iss_position']
iss_timestamp = iss_data['timestamp']
iss_latitude = iss_position['latitude']
iss_longitude = iss_position['longitude']

colour_palette = colour_data['palettes']
colour_hex = choice([item for item in colour_palette])

color = choice(colour_hex)

save_path = "./output_sensor_story"

dict = {"position": {"latitude": iss_latitude, "longitude": iss_longitude, "timestamp": iss_timestamp},
		 "appearance": color
		 }

complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_sensor_story" + ".json")

with open(complete_name_json, "w") as f:
	f.write(json.dumps(dict))