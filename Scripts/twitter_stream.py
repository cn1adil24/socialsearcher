# coding: utf-8

from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json
import time
from datetime import date
import sys

### Twitter API Credentials
access_token = "YOUR_ACCESS_TOKEN"
access_token_secret = "YOUR_SECRET_ACCESS_TOKEN"
consumer_key = "YOUR_CONSUMER_KEY"
consumer_secret = "YOUR_SECRET_CONSUMER_KEY"

res = []
maxResults = 100
today = str(date.today())

class StdOutListener(StreamListener):
    
    def __init__(self):
        self.count = 0

    def on_data(self, data):
        self.x = []
        if self.count == maxResults:
            return False
        else:
            data = json.loads(data)
            res.append(data)
            self.count += 1
            print("Retrieved tweet. Count:", self.count)
            return True

    def on_error(self, status):
        print(status)

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

    # Initializing stream objects and listening to tweet stream
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)

    # Location co-ordinates: https://boundingbox.klokantech.com/
    stream.filter(track = [keyword], languages = ["en"], locations = [63.02, 23.41, 75.14, 34.4] )

    # Save extracted tweets on a specific location
    file = "data/tweets/tweets-" + keyword + "_date_" + today + ".txt"
    with open(file, 'w', encoding='utf-8') as outfile:
        json.dump(res, outfile)