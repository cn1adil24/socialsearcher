# coding: utf-8

from collections import Counter
import pandas as pd
from gensim.summarization.summarizer import summarize
import json
from datetime import datetime
import sys
import preprocessor as p
import re
import os

# Set options to be removed from each tweet while preprocessing the text
p.set_options(p.OPT.URL, p.OPT.EMOJI, p.OPT.HASHTAG, p.OPT.MENTION)

'''
    Function to preprocess twitter data
    - Remove urls, emojis, hashtags
    - Remove unicode characters
'''
def preprocess(str):
    
    # Clean URLs, Emojis, Hashtags
    str = p.clean(str)
    
    #Remove all unicode(non-English) tweets
    x = str
    x = x.replace('…','')
    x = x.replace('‘','')
    x = x.replace('’','')
    emoji_pattern = re.compile("["
        u"\U0001F600-\U0001F64F"  # emoticons
        u"\U0001F300-\U0001F5FF"  # symbols & pictographs
        u"\U0001F680-\U0001F6FF"  # transport & map symbols
        u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                           "]+", flags=re.UNICODE)
    
    x = emoji_pattern.sub(r'', x)
    return x


if __name__ == "__main__":

    keyword = ""
    flag = False

    # Extracting keyword from command line argument
    for word in sys.argv:
        if not flag:
            flag = True
            continue
        keyword += word + " "

    keyword = keyword.rstrip()


    # Extract tweet file based on keyword
    files = os.listdir('model/')
    src = ""

    for file in files:
        if 'tweets' in file and keyword in file:
        	src = file


    # Read the file assigned with topics
    df = pd.read_json('model/' + src)
    df = df.reset_index(drop=True)


    # Extract no. of topics
    no_of_topics = [word for word in src.split('_') if word.isdigit()][0]
    no_of_topics = int(no_of_topics)


    '''
        To create a refined summary, either
        - tweets that are classified as "News" are selected, or
        - top tweets based on retweet count are extracted
    '''
    unique = set(df['Topic'])

    df_topic = []

    for i in range(0, no_of_topics):

        if i not in unique:
            continue

        df_i = df.loc[ df['Topic'] == i ]
        
        #x = df_i.nlargest(5, ['Retweet_count'])
        x = df_i.loc[ df['Type'] == "News" ]
        
        if x.empty or len(x) < 3:
            x = df_i.nlargest(5, ['Retweet_count'])
        
        x = x.reset_index()
        
        df_topic.append(x)


    # Generate summaries of each topic
    summaries = []

    for j in range(0, len(df_topic)):        

        topic = ""

        # Extract tweet of particular topic
        for i in range( 0, len(df_topic[j]) ):        
            topic += df_topic[j]['Description'][i] + '. '
        
            
        # Summarize using gensim.summarize        
        if len(df_topic[j]) < 2:
            summary = topic
        elif len(df_topic[j]) < 3:
            summary = summarize(text=topic, ratio=0.75, split=True)
        else:
            summary = summarize(text=topic, ratio=0.25, split=True)

        # Filter out duplicate sentences
        filtered = list(dict.fromkeys(summary))
        ss = ""
        for i in range(0, len(filtered)):
            ss += filtered[i]
        
        if not ss:
            ss = topic
        
        # Preprocess text
        ss = preprocess(ss)

        # Add summary to list        
        summaries.append(ss)


    # Get overall sentiment & time of each summary
    sentiment = []
    dates = []
    x = 0

    for j in range(0, no_of_topics):

        if j not in unique:
            continue

        sent = []

        # Extract tweet of particular topic
        for i in range(0, len(df)):
            if df['Topic'][i].astype(int) == j:
                sent.append(df['Sentiment'][i])

        # Assign max sentiment score
        m = max(sent, key=sent.count)
        sentiment.append(m)

        d = df_topic[x]['Created_time'][0]
        d = datetime.strptime(str(d), '%Y-%m-%d %H:%M:%S')
        dates.append(str(d.date()))
        x += 1


    # Convert list to dataframe
    summary_df = pd.DataFrame({"Summary": summaries, "Sentiment": sentiment, "Date": dates})
    summary_df = summary_df.reset_index()


    # Add Topic column to each summary
    summary_df.rename(columns={'index':'topic'}, inplace=True)


    # Save summaries to json format
    summary_json = summary_df.to_dict('records')

    file = r'model\summary_' + keyword + '_' + str(no_of_topics) + '_topics.json'
    with open(file, 'w', encoding='utf-8') as outfile:
        json.dump(summary_json, outfile)

    print("Text summarization done with", keyword)