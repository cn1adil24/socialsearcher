# coding: utf-8

from gensim.models import Word2Vec
import nltk
from sklearn.cluster import KMeans
from sklearn import cluster
from sklearn import metrics
from sklearn.decomposition import PCA
from nltk.corpus import stopwords
import pandas as pd
import numpy as np
import json
import os
import re
import preprocessor as p
from nltk import FreqDist
from nltk.stem import WordNetLemmatizer, SnowballStemmer
import matplotlib.pyplot as plt
import seaborn as sns
import gensim
import sys
import pickle
from sklearn.metrics import silhouette_samples, silhouette_score
from gensim import corpora
from textblob import TextBlob

twitter_dest = "data/tweets/"
youtube_dest = "data/videos/"


'''                     Sentiment Analysis

    Assigns a sentiment score on each tweet based on the polarity
    #8caa0b - positive
    #b3b3b3 - neutral
    #ff0000 - negative
'''
def analyze_sentiment(tweet):
    analysis = TextBlob(tweet)
    if analysis.sentiment.polarity > 0:
        return '#8caa0b'
    elif analysis.sentiment.polarity == 0:
        return '#b3b3b3'
    else:
        return '#ff0000'


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


    # Read read all files from disk realted to keyword
    twitter_all_files = os.listdir(twitter_dest)
    youtube_all_files = os.listdir(youtube_dest)

    twitter_files = []
    youtube_files = []

    for file in twitter_all_files:
        if keyword in file:
            twitter_files.append(file)
            
    for file in youtube_all_files:
        if keyword in file:
            youtube_files.append(file)


    # Loading Twitter JSON files
    twitter_json = []

    for file in twitter_files:
        with open(twitter_dest + file, encoding='utf-8') as json_file:
            
            # Load file
            data = json.load(json_file)
            
            # Concatenate all files
            twitter_json = twitter_json + data

        # Move file to archived folder
        os.replace(twitter_dest + file, "data/archived_tweets/" + file)
        
    
    # Loading YouTube JSON files
    yt_json = []

    for file in youtube_files:
        with open(youtube_dest + file, encoding='utf-8') as json_file:
            
            # Load file
            data = json.load(json_file)        
            
            # Concatenate all files
            yt_json = yt_json + data

        # Move file to archived folder
        os.replace(youtube_dest + file, "data/archived_videos/" + file)
        
    
    '''
        Retrieving relevant information from the Twitter JSON objects
            and creating a dataframe
    '''

    # Following columns are extracted from the Twitter API data
    columns = ['Created_time', 'URL', 'User_name', 'Twitter_handle', 'Description', 'Retweet_count', 'Favorite_count', 'Sentiment', 'Topic']

    df_tweets = pd.DataFrame(columns=columns)
    for i in range(0, len(twitter_json)):
        
        Created_time = twitter_json[i]['created_at']
        
        URL = 'twitter.com/i/web/status/' + twitter_json[i]['id_str']
        
        User_name = twitter_json[i]['user']['name']
        
        Twitter_handle = twitter_json[i]['user']['screen_name']
        
        '''
        if 'retweeted_status' not in twitter_json[i]:
            Description = twitter_json[i]['full_text']
        else:
            Description = twitter_json[i]['retweeted_status']['full_text']
        '''

        if 'extended_tweet' not in twitter_json[i]:
            Description = twitter_json[i]['text']
        else:
            Description = twitter_json[i]['extended_tweet']['full_text']
        
        Retweet_count = twitter_json[i]['retweet_count']
        
        Favorite_count = twitter_json[i]['favorite_count']
        
        #Sentiment = twitter_json[i]['sentiment']
        Sentiment = analyze_sentiment(Description)
        
        # Classifying tweet as either 'News' or 'Opinion'
        type = None
        if twitter_json[i]['user']['followers_count'] > 50000:
            type = 'News'
        else:
            type = 'Opinion'
        
        # Adding rows to dataframe
        df_tweets = df_tweets.append({'Created_time':Created_time,'URL':URL,'User_name':User_name,
                                      'Twitter_handle':Twitter_handle,'Description':Description,
                                      'Retweet_count':Retweet_count,'Favorite_count':Favorite_count,
                                      'Sentiment':Sentiment, 'Topic':np.nan, 'Type':type},
                                      ignore_index=True)
        


    '''
        Retrieving relevant information from the Youtube JSON objects
            and creating a dataframe
    '''
    ss=r'([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))'

    # Columns to be extracted from the YouTube API data
    columns = ['Published_date', 'Title', 'URL', 'Channel_id', 'Topic']
    df_videos = pd.DataFrame(columns=columns)

    for i in range(0, len(yt_json)):
        
        Published_date = re.findall(ss,yt_json[i]['snippet']['publishedAt'])[0][0]
        
        Title = yt_json[i]['snippet']['title']
        
        Channel_id = yt_json[i]['snippet']['channelId']
        
        URL = 'https://www.youtube.com/watch?v=' + yt_json[i]['id']['videoId']
        
        # Adding rows to dataframe
        df_videos = df_videos.append({'Published_date':Published_date,'Title':Title,
                                      'Channel_id':Channel_id,'URL':URL, 'Topic':np.nan},
                                      ignore_index=True)


    # Added temporary column for processing 
    df_tweets['cleaned'] = np.nan
    df_videos['cleaned'] = df_videos['Title']


    ''' Preprocessing Tweets '''


    # Function to remove unicode characters
    def isEnglish(s):
        try:
            s.encode('ascii')
        except UnicodeEncodeError:
            return False
        else:
            return True


    # Set options to be removed from each tweet while preprocessing the text
    p.set_options(p.OPT.URL, p.OPT.EMOJI)

    for i in range(0, len(df_tweets)):
        
        # Clean URLs, Emojis, Hashtags
        df_tweets['cleaned'][i] = p.clean(df_tweets['Description'][i])
        
        # Remove '@' without removing the username
        df_tweets['cleaned'][i] = re.sub('@', ' ', df_tweets['cleaned'][i])
        
        # Remove '#' without removing the username
        df_tweets['cleaned'][i] = re.sub('#', ' ', df_tweets['cleaned'][i])
        
        #Remove all unicode(non-English) tweets
        x = df_tweets['cleaned'][i]
        x = x.replace('…', '')
        x = x.replace('‘', '')
        x = x.replace('’', '')
        emoji_pattern = re.compile("["
            u"\U0001F600-\U0001F64F"  # emoticons
            u"\U0001F300-\U0001F5FF"  # symbols & pictographs
            u"\U0001F680-\U0001F6FF"  # transport & map symbols
            u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                               "]+", flags=re.UNICODE)
        x = emoji_pattern.sub(r'', x)
        if isEnglish(x):
            df_tweets['cleaned'][i] = x
        else:
            df_tweets['cleaned'][i] = np.nan

    # Drop all empty rows
    df_tweets.dropna(subset=['cleaned'], inplace=True)


    # Dropping ALL duplicate values 
    df_tweets.drop_duplicates(subset ="Description", 
                         keep = 'first', inplace = True)


    # Reset index
    df_tweets = df_tweets.reset_index(drop=True)

    
    # Remove unwanted characters, numbers and symbols
    df_tweets['cleaned'] = df_tweets['cleaned'].str.replace("[^a-zA-Z]", " ")
    df_tweets['cleaned'] = df_tweets['cleaned'].str.replace('&amp;', " ")
    df_tweets['cleaned'] = df_tweets['cleaned'].str.replace('amp', " ")
    df_videos['cleaned'] = df_videos['cleaned'].str.replace("&amp;", " ")
    df_videos['cleaned'] = df_videos['cleaned'].str.replace("amp", " ")


    '''         
                Remove all Roman Urdu words
            if the word is not in the corpus, remove the word
    '''
    words = set(nltk.corpus.words.words())

    for i in range(0, len(df_tweets)):
        text = df_tweets['cleaned'][i]
        cleaned = ""
        for w in nltk.wordpunct_tokenize(text):
            if w.lower() in words and w.isalpha():
                cleaned = cleaned + w + ' '
        df_tweets['cleaned'][i] = cleaned


    # Remove short tweets
    i = 0
    l = len(df_tweets)
    while i < l:
        w = df_tweets['Description'][i].split()
        if len(w) <= 3:
            df_tweets = df_tweets.drop(df_tweets.index[i])
            df_tweets = df_tweets.reset_index(drop=True)
        i = i + 1
        l = len(df_tweets)

    
    ''' Text Preprocessing '''

    # Extract all English stopwords
    stop_words = stopwords.words('english')


    # Function to remove stopwords
    def remove_stopwords(rev):
        rev_new = " ".join([i for i in rev if i not in stop_words])
        return rev_new


    # Remove short words (length < 3)
    df_tweets['cleaned'] = df_tweets['cleaned'].apply(lambda x: ' '.join([w for w in x.split() if len(w)>2]))
    df_videos['cleaned'] = df_videos['cleaned'].apply(lambda x: ' '.join([w for w in x.split() if len(w)>2]))


    # Remove stopwords from the text
    tweets = [remove_stopwords(r.split()) for r in df_tweets['cleaned']]
    videos = [remove_stopwords(r.split()) for r in df_videos['cleaned']]

    
    # Convert letters into lower case
    tweets = [r.lower() for r in tweets]
    videos = [r.lower() for r in videos]


    # Remove keyword from text to enhance model fitting
    for word in keyword.split():
        tweets = [r.replace(word, " ") for r in tweets]


    ''' Stemming and lemmatization functions '''

    def lemmatize_stemming(text):
        stemmer = SnowballStemmer("english")
        return stemmer.stem(WordNetLemmatizer().lemmatize(text, pos='v'))

    def preprocess(text):
        result = []
        for token in gensim.utils.simple_preprocess(text):
            result.append(lemmatize_stemming(token))            
        return result


    # Temporary dataframe for mapping lemmatized texts
    tweets_1 = pd.DataFrame(tweets, columns=['text'])
    videos_1 = pd.DataFrame(videos, columns=['title'])


    # Extracting lemmatized words
    processed_tweets = tweets_1['text'].map(preprocess)
    processed_videos = videos_1['title'].map(preprocess)


    # Tokenizing words from tweets
    tokenized_tweets = []
    for tweet in processed_tweets:
        tokenized_tweets.append(tweet)


    # Tokenizing words from videos
    tokenized_videos = []
    for video in processed_videos:
        tokenized_videos.append(video)
        

    ''' Creating the Word2Vec model '''

    model = Word2Vec(tokenized_tweets, size=2, min_count=1)

    # Function to vectorize each token
    def vectorizer(sent, m):
        vec = []
        numw = 0
        for w in sent:
            try:
                if numw == 0:
                    vec = m[w]
                else:
                    vec = np.add(vec, m[w])
                numw += 1
            except:
                pass
        
        return np.asarray(vec, dtype=np.float) / numw

    # Creating a vector for text classification

    l = []
    for i in tokenized_tweets:
        l.append(vectorizer(i, model))

    X = np.array(l)

    for i in range(len(X)):
        if len(X[i]) == 0:
            X[i] = np.nan
    
    output = []
    tokenized_tweets_new = []
    i = 0
    for elem in X:
        if elem is not np.nan:
            output.append(elem)
            tokenized_tweets_new.append(tokenized_tweets[i])
        else:
            #df_tweets = df_tweets.drop(df_tweets.index[i])
            df_tweets = df_tweets.drop([i])
        i += 1

    df_tweets = df_tweets.reset_index(drop=True)
    X = np.array(output)
    tokenized_tweets = tokenized_tweets_new
    

    ''' K-Means Clustering '''


    # Using Silhoutte Analysis to find optimum number of clusters
    max_score = 0
    max_number = 0

    '''
        The idea is to iterate through different number of clusters,
            and find the maximum score using silhouette analysis.
    '''
    no_of_clusters = [n for n in range(10, 26)]
    #no_of_clusters = [3, 4, 5]
    for n_clusters in no_of_clusters:

        # Initializing the model
        clf = KMeans(n_clusters=n_clusters, random_state=10)
        labels = clf.fit_predict(X)

        # The silhouette_score returns the average value for all sample points in data
        silhouette_avg = silhouette_score(X, labels)
        print("For n_clusters =", n_clusters,
              "The average silhouette_score is :", silhouette_avg)

        # Select the max score, and no. of clusters on that score
        if silhouette_avg > max_score:
            max_score = silhouette_avg
            max_number = n_clusters


    # Optimal no. of clusters based on silhoutte score
    n_clusters = max_number


    ''' Applying LDA on number of clusters obtained from KMeans '''
    

    # Creating a term dictionary of the corpus, each unique term is assigned an index
    dictionary = corpora.Dictionary(tokenized_tweets)

    # Converting the list of texts into document term matrix
    doc_term_matrix = [dictionary.doc2bow(text) for text in tokenized_tweets]

    # Training the model on number of clustered topics
    LDA = gensim.models.ldamodel.LdaModel
    num_of_topics = n_clusters
    lda_model = LDA(corpus=doc_term_matrix, id2word=dictionary, num_topics=num_of_topics, random_state=100,
                    chunksize=1000, passes=50)
    

    # Assigning topics to tweets based on above model
    corpus = [dictionary.doc2bow(text) for text in tokenized_tweets]
    for i in range(0, len(df_tweets)):

        doc = corpus[i]

        # This contains probability of tweet assigned to each topic
        vector = lda_model[doc]

        # Getting the topic that has maximum probability
        max_res = 0

        for res in vector:
            if (res[1] > max_res):
                max_res = res[1]
                ind = res[0]

        df_tweets['Topic'][i] = int(np.int32(ind))

        
    # Assigning topics to videos from previous trained model
    corpus = [dictionary.doc2bow(text) for text in tokenized_videos]
    for i in range(0, len(df_videos)):

        doc = corpus[i]

        vector = lda_model[doc]

        max_res = 0

        for res in vector:
            if (res[1] > max_res):
                max_res = res[1]
                ind = res[0]

        df_videos['Topic'][i] = int(np.int32(ind))


    # Drop the temporary columns
    df_tweets = df_tweets.drop(['cleaned'], axis=1)
    df_videos = df_videos.drop(['cleaned'], axis=1)


    # Export twitter data to json format for further processing
    df_to_json_tweets = df_tweets.to_dict('records')
    file = r'model\topic-tweets_' + keyword + '_' + str(n_clusters) + '_topics.json'
    with open(file, 'w', encoding='utf-8') as outfile:
        json.dump(df_to_json_tweets, outfile)


    # Export youtube data to json format for further processing
    df_to_json_videos = df_videos.to_dict('records')
    file = r'model\topic-videos_' + keyword + '_' + str(n_clusters) + '_topics.json'
    with open(file, 'w', encoding='utf-8') as outfile:
        json.dump(df_to_json_videos, outfile)


    # Saving the model
    filename = 'cluster/lda_' + keyword + '_' + str(n_clusters) + '_topics'+'.sav'
    pickle.dump(lda_model, open(filename, 'wb', encoding='utf-8'))
    
    
    # Loading model later on
    #lda_copy = pickle.load(file(filename))
    
    print("Topic clustering done with ", keyword)