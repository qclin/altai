from __future__ import unicode_literals
import datetime
import random
import json
import os.path


sentences_data = json.loads(open("20180521-164056_sentences_parsed.json").read())
quotes_data = json.loads(open("us_president_quotes.json").read())
instructions_data = json.loads(open("laundry_care.json").read())

sentences = sentences_data['sentences']
q_data = quotes_data['data']
entry = [item ['quotes'] for item in q_data]
instructions = instructions_data['laundry_care_instructions']

sentence = [item for item in sentences]
quotes = [item for item in entry]
instruction = [item ['instruction'] for item in instructions]

pick = random.choice(quotes)
quote = [item for item in pick]

sentence = random.choice(sentence)
instruction = random.choice(instruction)
quotation = random.choice(quote)


save_path = "./output_social_story"

dict = {"story": 
		[sentence, instruction, quotation]
		 }

complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_social_story" + ".json")

with open(complete_name_json, "w") as f:
	f.write(json.dumps(dict))