# Optimized Social Story Searcher using Knowledge Graph

API documentation: https://documenter.getpostman.com/view/9579911/SztK254C

Interface video:

## Pre-requisites

-	Python 2.7 or higher
-	Neo4j Desktop 3.5.6
-	Node current version
-	Twitter API token, visit: https://developer.twitter.com/
-	YouTube API token, visit https://developers.google.com/youtube/v3

## Instructions

### Importing database

1. Install Neo4j Desktop from the link

- https://neo4j.com/download/

2. Open Neo4j and create new graph named 'Social Search' but don't run it.

3. Click on 'Manage' and then click on 'Open Folder'

4. From the File Explorer, go to 'bin' folder and open command prompt

5. Run the following command

```
neo4j-admin load --from=<location_of_graph.db.dump_file> --database=graph.db --force
```

6. Now, in the Neo4j application, start the newly created graph database

### Installing and setting up python virtual environment
1. Go to your command prompt and type

```
pip install virtualenv
```

2. Navigate to the project directory

```
cd socialsearcher
```

3. Create a virtual environment using the command

```
virtualenv env
```

4. Activate the virtual environment by typing the command

```
venv\Scripts\activate
```

5. Deactivate using the command

```
deactivate venv
```

### Installing python dependencies
1. Navigate to the project directory using command prompt

```
cd socialsearcher
```

2. Activate the virtual environment using the command

```
venv\Scripts\activate
```

3. Run this command to install dependencies

```
pip install -r requirements.txt --no-cache-dir
```

4. Run this command to install preprocessor module

- if git is installed on system
```
pip install git+https://github.com/s/preprocessor.git
```

- if git is not installed on system
```
pip install --upgrade https://github.com/s/preprocessor/tarball/master
```

5. Input the Twitter API by replacing the placeholder strings in api.py

6. Run the API from command prompt using

```
python api.py
```

### User interface

1. Install nodejs from the following link

- https://nodejs.org/en/download/current/

2. Go to the 'UI' folder and run this command using the command prompt to install node modules

```
npm install
```

3. Now, run this command to launch the project

```
npm start
```
