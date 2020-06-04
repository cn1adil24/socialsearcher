import flask
from flask_cors import CORS, cross_origin
from flask import request, jsonify
from py2neo import Graph, NodeMatcher
from py2neo import Node, Relationship
import json
import base64
from dateutil.parser import parse
from datetime import date
from spellchecker import SpellChecker
import subprocess
import time
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
from twitter import *


''' Initializing components '''

app = flask.Flask(__name__)
CORS(app, support_credentials = True)
app.config["DEBUG"] = True
graph = Graph('http://localhost:7474', password='1234')
matcher = NodeMatcher(graph)

# Create spellchecker object with 3 operations allowed
spell = SpellChecker()
spell.distance = 3
dictionary = []

# Extracting entities from the graph
query = "MATCH (n:Entity) RETURN n"
users = graph.run(query).to_table()
for user in users:
    dictionary.append(user[0]['name'])


# Creating dictionary for spellchecker
spell.word_frequency.load_words(dictionary)


# Twitter API credentials for extracting trends
twitter = Twitter(auth = OAuth("YOUR_ACCESS_TOKEN",
                               "YOUR_SECRET_ACCESS_TOKEN",
                               "YOUR_CONSUMER_KEY",
                               "YOUR_SECRET_CONSUMER_KEY"))


'''
    Extracting trends after every 30 mins,
    based on location (set to pakistan)
'''
trends = twitter.trends.place(_id = 23424922)

# Function to extract trends
def extract_tweets():
    global trends
    try:
        trends = twitter.trends.place(_id = 23424922)
    except:
        print("Error in retrieving trends")

def stop_extracting_tweets():
    print("Shutting down scheduler")
    sched.shutdown()

'''
    Scheduler to extract trends every 30 mins,
    calls a function that return a list of trends
'''
sched = BackgroundScheduler(daemon = True)
sched.add_job(extract_tweets, 'interval', minutes = 30)
sched.start()


'''
    Defining endpoints for API
'''

# Default route
@app.route('/', methods=['GET'])
@cross_origin(supports_credentials=True)
def home():
    return '''<h1>Social Search API</h1>
<p>A prototype API for retrieving Social Search results.</p>'''


'''
    - Description:
        GET endpoint for extracting tweets of a specific story

    - Parameters:
        id: the id associated with each story

    - Returns a json object consisting of tweets

'''
@app.route('/api/socialsearch/tweet', methods=['GET'])
@cross_origin(supports_credentials=True)
def api_tweet_id():

    # Extract id from GET parameter
    id  = request.args.get('id', None)

    # Check if parameters exist
    if id == None:
        return "Invalid format"
    else:
        id = str(id)
    
    result = []
    
    try:
        # Retrieving all tweets from graph
        query = "MATCH (s:Story)-[:HAS_TWEET]->(tweet) WHERE ID(s) = " + id + " RETURN tweet"

        ss = graph.run(query).to_table()
            
        for s in ss:
            result.append(s[0])
        
        # Sort tweets by retweet count, return top 100 tweets
        result = sorted(result, key=lambda k: k['Retweet_count'], reverse=True)[:100]

        return jsonify(result)
    
    except Exception:
        return jsonify(result)


'''
    - Description:
        GET endpoint for extracting videos of a specific story

    - Parameters:
        id: the id associated with each story

    - Returns a json object consisting of videos

'''
@app.route('/api/socialsearch/video', methods=['GET'])
@cross_origin(supports_credentials=True)
def api_video_id():

    # Extract id from GET parameter
    id  = request.args.get('id', None)

    # Check if parameters exist
    if id == None:
        return "Invalid format"  
    else:
        id = str(id)


    result = []
    
    try:
        # Retrieving all videos from graph
        query = "MATCH (s:Story)-[:HAS_VIDEO]->(video) WHERE ID(s) = " + id + " RETURN video"

        ss = graph.run(query).to_table()
            
        for s in ss:
            result.append(s[0])

        # Return 25 videos
        return jsonify(result[:25])
    
    except Exception:
        return jsonify(result)


'''
    - Description:
        GET endpoint for extracting all entities connected to a specific story

    - Parameters:
        id: the id associated with each story

    - Returns a json object consisting of entities

'''
@app.route('/api/socialsearch/entity', methods=['GET'])
@cross_origin(supports_credentials=True)
def api_connected_entities():

    # Extract id from GET parameter
    id  = request.args.get('id', None)

    # Check if parameters exist
    if id == None:
        return "Invalid format"
    else:
        id = str(id)
    
    result = []
        
    try:
        # Retrieving all entities connected with particular story from graph
        query = "MATCH (n:Entity)-[:HAS_STORY]->(s:Story) WHERE ID(s) = " + id + " RETURN n"

        ss = graph.run(query).to_table()
            
        for s in ss:
            result.append(s[0])

        return jsonify(result)
    
    except Exception:
        return jsonify(result)


'''
    - Description:
        GET endpoint for extracting summaries of keyword/story

    - Parameters:
        id: the id of the user that initiates query
        key: the search query

    - Returns a json object consisting of stories and/or substories

'''
@app.route('/api/socialsearch/summary', methods=['GET'])
@cross_origin(supports_credentials=True)
def api_summary():
    
    # Extract "id" and "key" from GET parameter
    key  = request.args.get('key', None)
    id = request.args.get('id', None)
    
    # Check if parameters exist
    if key == None:
        return "Invalid format"  
    else:
        key = str(key)
        
    if id == None:
        return "Invalid format"
    
    result = []
    
    if not key:
        return jsonify(result)
    
    # Check for any misspells
    key = SpellCheck(key)
    
    try:
        # Storing user's search results in graph
        user = graph.evaluate("MATCH (n:User) WHERE ID(n)=" + str(id) + " RETURN n")
        node = Node("User_search", name=key, Date=str(date.today()))
        graph.create(node)
        r = Relationship(user, "SEARCHED_FOR", node)
        graph.create(r)


        # Retrieving all stories from graph
        ss = graph.run("MATCH (n:Entity { name: '" + key + "' })-->(story:Story) RETURN story, ID(story) AS id, labels(story)[0] AS type").to_table()
        

        if not ss:

            ''' Searched query is either a story or not yet in database '''

            query = "MATCH(n:Story) WHERE "
            for word in key.split():
                query += "toLower(n.Summary) CONTAINS '" + word + "'" + " AND "

            query = query.rstrip(' AND ')
            query += " RETURN n, ID(n) AS id, labels(n)[0] AS type"
            
            sstory = graph.run(query).to_table()

            query = "MATCH(n:Substory) WHERE "
            for word in key.split():
                query += "toLower(n.Summary) CONTAINS '" + word + "'" + " AND "

            query = query.rstrip(' AND ')
            query += " RETURN n, ID(n) AS id, labels(n)[0] AS type"
            
            ssubstory = graph.run(query).to_table()

            ss = sstory + ssubstory

            if not ss:
                '''
                    Search query is not in database, this will run
                    all the previous scripts including
                    - data extraction
                    - topic clustering
                    - text summarization
                    - graph creation
                '''
                
                print('Initiate realtime process for timeline generation')
                
                # Extract tweets
                print('Extracting tweets...')
                p1_t = subprocess.Popen('python twitter_stream.py ' + key)
                p1_t.wait()

                # Extract videos
                print('Extracting videos...')
                p1_y = subprocess.Popen('python youtube_stream.py ' + key)
                p1_y.wait()
                
                # Cluster tweets
                print('Clustering topics...')
                p2 = subprocess.Popen('python topic_clustering.py ' + key)
                p2.wait()

                # Summarize topics
                print('Summarizing clusters...')
                p3 = subprocess.Popen('python text_summarization.py ' + key)
                p3.wait()

                # Create graph
                print('Creating graph...')
                p4 = subprocess.Popen('python create_graph.py ' + key)
                p4.wait()

                ss = graph.run(query).to_table()

            else:
                print("Searched story")

        else:
            print("Searched entity")
        
        # Append the query        
        result.append({"data": []})
        result.append({"query": key})
        
        for s in ss:
            s[0]['id'] = s[1]
            s[0]['type'] = s[2]
            result[0]['data'].append(s[0])
        
        # Sort result by date
        result = sorted(result, key=lambda k: k['Date'], reverse=True)
        
        return jsonify(result)
        
    except Exception:
        return jsonify(result)

'''
    - Description:
        POST endpoint for user login authentication

    - Parameters:
        email: user's email for login
        password: password associated with email

    - Returns:
        if, credentials are valid, a JSON object
        else, a string showing an error

'''
@app.route('/api/socialsearch/login', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def api_login():
    if request.method == 'POST':
                
        # Extract JSON object from POST request
        req_data = request.get_json()
        

        # Check if parameters exist
        if 'email' not in req_data:
            return "Invalid format"
        else:
            email = req_data['email']
            
        if 'password' not in req_data:
            return "Invalid format"
        else:
            password = req_data['password']
        
        pass1 = password
        
        try:
            # Authenticate user in database
            user = graph.run("MATCH (n:User {Email:\"" + email + "\", Password:\"" + password + "\"}) RETURN n, ID(n)").data()
            
            if not user:
                return "Invalid credentials"                
            else:
                dict = {"name" : user[0]["n"]["name"], "email" : user[0]["n"]["Email"], "password" : pass1, "id" : user[0]["ID(n)"]}
                return jsonify(dict)
            
        except Exception:
            return "Error"
                

'''
    - Description:
        POST endpoint for registering user account

    - Parameters:
        email, should be unique
        name
        password

    - Returns a string indicating success or failure

'''
@app.route('/api/socialsearch/register', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def api_register():
    if request.method == 'POST':

        # Extract JSON object from POST request
        req_data = request.get_json()
        

        # Check if parameters exist
        if 'email' not in req_data:
            return "Invalid format"
        else:
            email = req_data['email']
            
        if 'password' not in req_data:
            return "Invalid format"
        else:
            password = req_data['password']
            
        if 'name' not in req_data:
            return "invalid format"
        else:
            name = req_data['name']
     
        try:
            # Check for existing user node
            user = graph.run("MATCH (n:User {Email:\"" + email + "\"}) RETURN n").data()
            
            if not user:
                ''' User does not exists in database '''
                
                # Create a new user node
                res = graph.run("CREATE (n:User{name:\"" + name + "\", Password:\"" + str(password) + "\", Email:\"" + email + "\"})")
                
                return "Successfully registered"
                
            else:
            
                return "Email already exists in record"
                
        except Exception:        
            return "Error"
        

'''
    - Description:
        GET endpoint for extracting user search history

    - Parameters:
        id: the id of the user

    - Returns a json object consisting of list of searched terms

'''
@app.route('/api/socialsearch/history', methods=['GET'])
@cross_origin(supports_credentials=True)
def api_history():

    # Extract id from GET parameter
    id = request.args.get('id', None)
    
    # Check if parameters exist
    if id == None:
        return "Invalid format"  
    
    # Extract user search results from graph
    query = "MATCH p=(u:User)-[r:SEARCHED_FOR]->(s:User_search) WHERE ID(u)=" + str(id) + " RETURN s"
    
    ss = graph.run(query).to_table()
    
    result = []
    for s in ss:        
        result.append(s[0])    
    
    return jsonify(result)

'''
    - Description:
        POST endpoint for modifying user account

    - Parameters:
        id (mandatory)
        name (optional)
        password (optional)

    - Returns a json object consisting of user account data

'''
@app.route('/api/socialsearch/edit', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def api_edit():
    if request.method == 'POST':
        
        # Extract JSON object from POST request
        req_data = request.get_json()
        

        # Check if id exists
        if 'id' not in req_data:
            return "Invalid format"
        else:
            id = req_data['id']
        
        try:
            # Extract user node from graph
            user = graph.evaluate("MATCH(n:User) WHERE ID(n)=" + str(id) + " RETURN n")
        
            if not user:
                # Record not found in database
                return "No such user exists"
            else:

                # Check for any other optional parameters
                if 'password' in req_data:
                    password = req_data['password']
                else:
                    password = user['password']

                if 'name' in req_data:
                    name = req_data['name']
                else:
                    name = user['name']

                if 'email' in req_data:
                    email = req_data['email']
                else:
                    email = user['email']

                # Update the user node
                query = "MATCH(n:User) WHERE ID(n)=" + str(id) + " SET n.Password = \"" + str(password) + "\", n.name = \"" + name + "\", n.Email = \"" + email + "\" RETURN n"
                graph.evaluate(query)
                
                return jsonify(req_data)
                
        except Exception:
            return "Error"
        

'''
    - Description:
        GET endpoint for extracting trends

    - Parameters:
        none

    - Returns a json object consisting of top trends

'''
@app.route('/api/socialsearch/trends', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_trends():
    
    global trends
    res = []
    count = 0
    
    # Extract top 10 trends from the Twitter API data
    for trend in trends[0]['trends']:
        if count == 10:
            break
        res.append( trend['name'] )
        count += 1
    
    return jsonify(res)

'''

    Function to check for any misspells in the
    user search query against the entities
    present in the graph

'''
def SpellCheck(query):
    flag = False
    res = ""
    # Check if query exists in dictionary
    for key in dictionary:
        if query == key:
            res = key
            flag = True
            break
            
    # Word is misspelled, correct it
    if not flag:
        candidate = spell.correction(query)
         
        # Keyword was out of place
        if candidate == query:
            res = query
        # Keyword was corrected
        else:
            res = candidate
    return res

# Kill the background process on exit
atexit.register(stop_extracting_tweets)

# Run the application
app.run(host="0.0.0.0", port=8000, use_reloader=False)