# coding: utf-8

from py2neo import Graph
from py2neo import Node, Relationship
import json
import pandas as pd
import sys
import os

# Connecting to neo4j graph database
graph = Graph('http://localhost:7474', password='1234')


# These are the entities on which data is extracted
entities = ['imran khan', 'nawaz sharif', 'bilawal bhutto', 'asif zardari',
            'arif alvi', 'maryam nawaz', 'asif khosa', 'fawad chaudhry', 'fazal ur rehman',
            'shehbaz sharif', 'qamar bajwa', 'altaf hussain', 'pervez musharraf',
            'mustafa kamal', 'siraj ul haq', 'sheikh rasheed', 'pervez khattak', 'asad umar',
            'murad ali shah', 'aitzaz ahsan', 'asif ghafoor', 'PTI', 'PMLN', 'PPP', 'JUI', 'MQM']


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


    ''' Extract summary, tweet and video files '''

    files = os.listdir('model/')
    file = ''
    twitter_file = ''
    youtube_file = ''

    for f in files:
        if 'tweets' in f and keyword in f:
            twitter_file = 'model/' + f
        elif 'videos' in f and keyword in f:
            youtube_file = 'model/' + f
        elif 'summary' in f and keyword in f:
            file = 'model/' + f

    # Twitter data
    with open(twitter_file, encoding='utf-8') as json_file:
        tweet_data = json.load(json_file)

    # Youtube data
    with open(youtube_file, encoding='utf-8') as json_file:
        yt_data = json.load(json_file)

    # Summary data
    with open(file, encoding='utf-8') as json_file:
        data = json.load(json_file)
    

    # Adding summaries to graph
    for i in range(0, len(data)):

        # Add a node of each "Story" of the summary      
        summary = Node("Story", Topic=data[i]['topic']
                             , Summary=data[i]['Summary']
                             , Sentiment=data[i]['Sentiment']
                             , Date=data[i]['Date'])

        graph.create(summary)

        

        '''
        Adding the Knowledge Graph layer, this inclues
            - identifying entities among stories
            - identifying sub stories among stories
            - and their relationships
        '''

        flag = False
        
        # Match full keyword
        for entity in entities:
            if entity in data[i]['Summary'].lower():
                node = graph.evaluate('MATCH(e:Entity {name: "' + entity + '"}) RETURN e')
                if not node:
                    node = graph.evaluate('CREATE(e:Entity {name: "' + entity + '"}) RETURN e')
                
                # Create relationship of story with an entity
                r = Relationship(node, "HAS_STORY", summary)
                graph.create(r)
                flag = True

        # No entity related to story, link to another story
        if not flag:

            # Delete the previous Story node
            graph.delete(summary)

            # Create a "Substory" node of the summary instead
            summary = Node("Substory", Topic=data[i]['topic']
                             , Summary=data[i]['Summary']
                             , Sentiment=data[i]['Sentiment']
                             , Date=data[i]['Date'])

            graph.create(summary)

            # Extract related stories
            query = "MATCH(n:Story) WHERE "
            for word in keyword.split():
                query += "toLower(n.Summary) CONTAINS '" + word + "'" + " AND "

            query = query.rstrip(' AND ')
            query += " RETURN n"
            
            ss = graph.run(query).to_table()

            # Create substory relationship
            if ss:
                for story_node in ss:
                    r = Relationship(story_node[0], "HAS_SUBSTORY", summary)
                    graph.create(r)



        # Adding tweets belonging to that summary
        for j in range(0, len(tweet_data)):
            if tweet_data[j]['Topic'] == i:

                # Create node based on type of tweet
                tweet_type = tweet_data[j]['Type']                

                tweet = Node(tweet_type, Created_time = tweet_data[j]['Created_time']
                                    , URL = tweet_data[j]['URL']
                                    , User_name = tweet_data[j]['User_name']
                                    , Twitter_handle = tweet_data[j]['Twitter_handle']
                                    , Description = tweet_data[j]['Description']
                                    , Retweet_count = tweet_data[j]['Retweet_count']
                                    , Favorite_count = tweet_data[j]['Favorite_count']
                                    , Sentiment = tweet_data[j]['Sentiment']
                                    , Type = tweet_data[j]['Type']
                                    , Topic = tweet_data[j]['Topic'])

                graph.create(tweet)

                r = Relationship(summary, "HAS_TWEET", tweet)

                graph.create(r)


        #Adding videos belonging to that summary
        for j in range(0, len(yt_data)):
            if yt_data[j]['Topic'] == i:
                video = Node("Video", Published_date = yt_data[j]['Published_date']
                                    , Title = yt_data[j]['Title']
                                    , URL = yt_data[j]['URL']
                                    , Channel_id = yt_data[j]['Channel_id']
                                    , Topic = yt_data[j]['Topic'])

                graph.create(video)

                r = Relationship(summary, "HAS_VIDEO", video)

                graph.create(r)

        
    print("Done with", keyword)