import json
from random import choice
import requests
import datetime
import os.path


iss_data = requests.get("http://api.open-notify.org/iss-now.json").json()
earthquake_data = requests.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson").json()

time_data = json.loads(open("units_of_time.json").read())
nsa_data = json.loads(open("nsa_projects.json").read())
chemicals_data = json.loads(open("PeriodicTableJSON.json").read())
surveillance_data = json.loads(open("mass-surveillance-project-names.json").read())

iss_position = iss_data['iss_position']
iss_timestamp = iss_data['timestamp']
iss_latitude = iss_position['latitude']
iss_longitude = iss_position['longitude']
earthquake_features = earthquake_data['features']
earthquake_properties = [item ['properties'] for item in earthquake_features]
earthquake_mag = [item ['mag'] for item in earthquake_properties]
earthquake_place = [item ['place'] for item in earthquake_properties]
earthquake_time = [item ['time'] for item in earthquake_properties]

elements = chemicals_data['elements']
element_name = [item ['name'] for item in elements]
element_appearance = [item ['appearance'] for item in elements]
element_mass = [item ['atomic_mass'] for item in elements]

time_formal = time_data['formal_time_units']
nsa_codenames = nsa_data['codenames']
surveillance_projects = surveillance_data['projects']
surveillance_name = [item ['Name'] for item in surveillance_projects]
surveillance_region = [item ['Region'] for item in surveillance_projects]

earthquake_mag_value = choice(earthquake_mag)
earthquake_place_value = choice(earthquake_place)
earthquake_time_value = choice(earthquake_time)

substance_name = choice(element_name)
substance_appearance = choice(element_appearance)
substance_mass = choice(element_mass)

time_formal_value = choice(time_formal)
nsa_codenames_value = choice(nsa_codenames)
surveillance_name_value = choice(surveillance_name)
surveillance_region_value = choice(surveillance_region)


save_path = "./output_recognition_story"

dict = {"position": {"latitude": iss_latitude, "longitude": iss_longitude, "timestamp": iss_timestamp}, 
         "substance": {"name": substance_name, "appearance": substance_appearance, "element": substance_mass}, 
		 "item": {"temporality": time_formal_value, "codename": nsa_codenames_value, "project": surveillance_name_value, "region": surveillance_region_value},
		 "catastrophe": {"magnitude": earthquake_mag_value, "place": earthquake_place_value, "time": earthquake_time_value}}

complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_recognition_story" + ".json")

with open(complete_name_json, "w") as f:
	f.write(json.dumps(dict))



