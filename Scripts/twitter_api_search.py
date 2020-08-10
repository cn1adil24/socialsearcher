import requests
import json
from datetime import date, datetime, timedelta

url = "http://letsearch.herokuapp.com/search"

headers = {
    'Content-Type': "application/json",
    'cache-control': "no-cache",
    'Postman-Token': "198a5cfc-424f-46d1-b239-6ef2dbab28c2"
}

if __name__ == "__main__":
    
    keyword = ""
    
    for word in sys.argv:
        if not flag:
            flag = True
            continue
        keyword += word + " "
    keyword = keyword.rstrip()

    maxResults = 100

    today = str(date.today())

    payload = "{\n\t\"tag\":\"author\",\n\t\"smpList\": [\n\t\t{\n\t\t\t\"name\":\"twitter\",\n\t\t\t\"params\": {\n\t\t\t\t\"q\":\""+keyword+"\",\n\t\t\t\t\"count\":"+str(maxResults)+",\n\t\t\t\t\"until\":\""+date+"\",\n\t\t\t\t\"tweet_mode\":\"extended\"\n\t\t\t}\n\t\t}\n\t]\n}"

    response = requests.request("POST", url, data=payload, headers=headers)

    # Response format
    response_json = response.json()

    #data = json.dumps(response_json['resultList'][0]['results'])
    data = response_json[0]['statuses']        

    ss = datetime.strptime(date, '%Y-%m-%d')
    ss = datetime.strftime(ss.date() - timedelta(1), '%Y-%m-%d')

    print("Retrieved "+ str(len(data)) + " tweets on " + str(ss) + " Keyword: " + keyword)

    # Save extracted tweets on a specific location
    file = "data/tweets/tweets-" + keyword + "_date_" + today + ".txt"
    with open(file, 'w', encoding='utf-8') as outfile:
        json.dump(data, outfile)
