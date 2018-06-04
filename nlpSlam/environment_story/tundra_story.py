import random
import json
import os.path
import datetime

text = open("altai_stories.txt").read().decode('utf-8').split()

def add_to_model(model, n, seq):
    # make a copy of seq and append None to the end
    seq = list(seq[:]) + [None]
    for i in range(len(seq)-n):
        # tuple because we're using it as a dict key!
        gram = tuple(seq[i:i+n])
        next_item = seq[i+n]            
        if gram not in model:
            model[gram] = []
        model[gram].append(next_item)

def markov_model(n, seq):
    model = {}
    add_to_model(model, n, seq)
    return model

def gen_from_model (n, model, start=None, max_gen=100):
    if start is None:
        start = random.choice(list(model.keys()))
    output = list(start)
    for i in range(max_gen):
        start = tuple(output[-n:])
        next_item = random.choice(model[start])
        if next_item is None:
            break
        else:
            output.append(next_item)
    return output

altai_word_model = markov_model(2, text)

starts_data = json.loads(open('starts.json').read())
#opening json with list of potential starting 2grams
starts = starts_data['starts']
start = random.choice([item for item in starts])

story = gen_from_model(2, altai_word_model, start, 200)

save_path = "./output_tundra_story"

# here story is a list neeed to compress into one string 
dict = {"story": 
        [story]
        }

complete_name_json = os.path.join(save_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "_tundra_story" + ".json")
with open(complete_name_json, "w") as f:
    f.write(json.dumps(dict))