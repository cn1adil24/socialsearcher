# Optimized Social Story Searcher using Knowledge Graph

API documentation:

Interface video:

## Requirements

### Installing and creating python virtualenv
1. Go to your command prompt and type

pip install virtualenv

2. Navigate to the project directory

cd socialsearcher

3. Create a virtual environment using the command

virtualenv env

4. Activate the virtual environment by typing the command

venv\Scripts\activate

5. Deactivate using the command

deactivate venv

### Installing python dependencies
1. Navigate to the project directory using command prompt

cd socialsearcher

2. Activate the virtual environment using the command

venv\Scripts\activate

3. Run this command

pip install -r requirements.txt

### Importing database

1. Install Neo4j Desktop from the link

https://neo4j.com/download/

2. Open Neo4j and create new graph named 'Social Search' but don't run it.

3. Click on 'Manage' and then click on 'Open Folder'

4. From the File Explorer, go to 'bin' folder and open command prompt

5. Now, run the following command

neo4j-admin load --from=<location_of_graph.db.dump_file> --database=graph.db --force

### User interface

1. Install nodejs from the following link

https://nodejs.org/en/download/current/

2. Go to the 'UI' folder and run this command using the command prompt

npm start
