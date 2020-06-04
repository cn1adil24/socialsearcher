# coding: utf-8

from apiclient.discovery import build
from datetime import date
import json
import re
import sys


### YouTube API Credentials
api_key = 'YOUR_API_KEY'
youtube = build('youtube', 'v3', developerKey = api_key)

maxResults = 20
today = str(date.today())
date_re = r"([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))"

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
    
    # Set criteria
    req = youtube.search().list(q=keyword, part='snippet', type='video', maxResults=maxResults,
                                    location="30.3753, 69.3451", locationRadius = "500mi")

    # Execute request
    res = req.execute()

    data = res['items']

    print("Retrieved " + str(len(res['items'])) + " videos on " + today + " Keyword: " + keyword)

    # Save extracted videos on a specific location
    file = 'data/videos/video-' + keyword + '_date_' + today + '.txt'
    with open(file, 'w', encoding='utf-8') as outfile:
        json.dump(data, outfile)