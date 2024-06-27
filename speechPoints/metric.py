import os
import subprocess
import numpy as np
import re

projRoot = '/home/maksymm/my/kaldi/egs/a_my'

FRAME_SHIFT = 5

def read_file(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()
    return [line.strip() for line in lines]

def parse_phones(filename):
    phone_lines = read_file(filename)
    phone2id = dict()
    id2phone = dict() 
     
    split_pattern = r'[\t ]+'
    for pl in phone_lines:
        phones_ids = re.split(split_pattern, pl)
            
        ph = phones_ids[0].strip()
        idx = phones_ids[1].strip()
        phone2id[ph] = idx
        id2phone[idx] = ph

        
    return phone2id, id2phone


def get_scores(gop_dir):
    # gop_op_file contains file path to file that stores log likelihoods.
    gop_op_file = f"{gop_dir}/gop.1.txt"
    # phones-pure.txt stores phone to phone id mapping.
    phone_file = f"{gop_dir}/../data_align/phones-pure.txt"
    # call to parse_phone function. It returns phone and phone id.
    phone2id, id2phone = parse_phones(phone_file)
    #read gop scores file.
    lines = read_file(gop_op_file)
    phone_scores = []
    for line in lines:
        matches = re.findall(r'\[.+?]', line)
        for m in matches:
            m = m[1:-1].strip()
            m_list = m.split()
            ph_id = m_list[0]
            ph_conf = m_list[1]
            ph_prob = np.power(10, float(ph_conf))
            temp = id2phone[ph_id]
            if id2phone[ph_id]=="y:":
                temp = id2phone[ph_id].replace("y:","eu")
            if id2phone[ph_id]=="'y:":
                temp = id2phone[ph_id].replace("'y:","oe")
            temp01 = temp.replace(":","")
            temp1 = temp01.replace("@","e")
            tpl = (ph_id, temp1.replace("'",""), ph_conf, str(ph_prob))
            phone_scores.append(tpl)
    #get phone scores.
    return phone_scores

#calculate overall scores.
#returns list of phonemes, average phone probability score and avg_phone_log_prob_score.
def get_overall_score(phone_scores):
    p_ctr = 0
    u_prob = 0
    u_conf = 0
    u_phones = []
    for i, s in enumerate(phone_scores):
        if i == 0 and s[1] == 'SIL':
            continue
        if i == len(phone_scores)-1 and s[1] == 'SIL':
            continue
        p_ctr += 1
        u_prob += float(s[3])
        u_conf += float(s[2])
        u_phones.append(s[1])
        # print(s)
    if p_ctr == 0:
        u_prob_overall = 0
        u_conf_overall = 0
    else:
        u_prob_overall = u_prob/p_ctr
        u_conf_overall = u_conf/p_ctr
    utterance = dict()
    utterance['phonemes'] = ' '.join(u_phones)
    utterance['avg_phone_prob_score'] = u_prob_overall
    utterance['avg_phone_log_prob_score'] = u_conf_overall
    return utterance

#get formatted scores. Take log of log likelihoods to get original scores. 
def get_formatted_score(utterance,transcript):
    avg_prob = utterance['avg_phone_prob_score']
    avg_log_prob = utterance['avg_phone_log_prob_score']
    phonemes = utterance['phonemes']
    phone_scores = utterance['phone_scores']
    p_s_str = []
    p_s_dict = {}
    for i,p in enumerate(phone_scores):
        if i == 0 or i == len(phone_scores) - 1:
            continue
        p_s_str.append(f'{p[1]}({float(p[3]):.2f})')
        p_s_dict[p[1]] = round(float(p[3])*100)
        
    p_str = ' '.join(p_s_str)
    o_str = f'Word Phonemes: {phonemes}\nAverage Score: {avg_prob:.4f}\nAverage Log Score:{avg_log_prob:.4f}\n' \
            f'Phoneme Probability: {p_str} '
    o_str2 = dict()
    o_str2['WordPhonemes'] = phonemes
    o_str2['AverageScore'] = round(avg_prob*100)
    o_str2['Average Log Score'] = f'{avg_log_prob:.4f}'
    o_str2['PhonemeProbability'] = p_str
    o_str2['PhonemeProbabilityExtended'] = p_s_dict
    formatted_durations = format_phone_durations(utterance['phone_durations'])
    o_str2['WordPhoneTime'] = f"{formatted_durations}"
    #o_str2['Word Phone Time Extended'] = utterance['phone_durations']    
    o_str2['Word'] = transcript
    return o_str2

def format_phone_durations(phone_durations):
    formatted_durations = []
    for phone, start_time, end_time in phone_durations:
        formatted_durations.append([phone, f"{start_time:.4f}", f"{end_time:.4f}"])
    return formatted_durations


def get_phone_timings(dir_path):


    fp = f"{dir_path}/ali-phone.1"    
    mp = f"{dir_path}/phone-to-pure-phone.int"
    if os.path.isfile(fp) == False:
        command = f"gunzip {dir_path}/ali-phone.1.gz"
        subprocess.call(["wsl", "bash", "-c", command])
    pfp = f"{dir_path}/phones-pure.txt"

    phone2id, id2phone = parse_phones(pfp)
    phone2purephone, purephone2phone = parse_phones(mp)
    

    phone_lines = read_file(fp)
    phone_durations = []
    count = 0
    for line in phone_lines:
        count+=1
        line = line.strip()
        phone_tokens = line.split()
        phone_tokens = phone_tokens[1:]
        for i in range(len(phone_tokens)):
            phone_tokens[i] = phone2purephone[phone_tokens[i]]
        prev_phone = ''
        
        for i, p in enumerate(phone_tokens):
            phone_time = i * FRAME_SHIFT / 333
            phone = id2phone[p]
            if phone == prev_phone:
                continue

            if phone_durations:
                phone_durations[-1][-1] = phone_time
                phone_durations.append([phone, phone_time, -1])
            else:
                phone_durations.append([phone, phone_time, -1])
            prev_phone = phone

    return phone_durations[1:-1]

PHONE_TIMES_DIR = f"{projRoot}/exp/data_align"

def run_gop(word):
    op_dir = f"{projRoot}/exp/gop_score"
    phone_scores = get_scores(op_dir)
    utterance_score = get_overall_score(phone_scores)
    utterance_score['phone_scores'] = phone_scores
    phone_durations = get_phone_timings(PHONE_TIMES_DIR)
    utterance_score['phone_durations'] = phone_durations
    f_str = get_formatted_score(utterance_score,word)
    print(f_str)
    return f_str

#print(run_gop("HELLO MY NAME IS MAXIM"))