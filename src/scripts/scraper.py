from bs4 import BeautifulSoup
import requests
from pymongo import MongoClient
import json
from dotenv import load_dotenv
import os
from pathlib import Path

s = requests.session()
env_path = Path('../..') / '.env'
load_dotenv(dotenv_path=env_path)

MONGO_URL = os.getenv('MONGO_URL')
MONGO_DB = os.getenv('MONGO_DB')
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION")

if not MONGO_URL or not MONGO_DB or not MONGO_COLLECTION:
    print('[ERROR] MONGO environment not defined.')
    exit(1)

credentials = json.load(open("credentials.json"))

if not credentials:
    print('[ERROR] credentials should be specified in credentials.json as an array of objects.')
    print('[{ "email": "coordinator1", "password": "password" }, { "email": "coordinator2", "password": "password" }]')
    exit(1)

BASE_URL = "http://info.vit.ac.in/gravitas2020/gravitas_coordinator_login.asp"
LOGIN_URL = "http://info.vit.ac.in/gravitas2020/coord_login_authorize.asp"
EVENTS_URL = "http://info.vit.ac.in/gravitas2020/coord_event_participants.asp"
TABLE_URL = "http://info.vit.ac.in/gravitas2020/coord_event_participant_list.asp"

def login(s, email, password):
    soup = BeautifulSoup(s.get(BASE_URL).text, features="html.parser")

    captcha = soup.find(id="captchacode1")["value"]

    loggedin = s.post(LOGIN_URL, {
        "loginid": email,
        "logpassword": password,
        "captchacode1": captcha,
        "captchacode": captcha,
        "frmSubmit": ""
    }).text

    if not 'Dear' in loggedin:
        print('Failed to log in.')
        exit(1)

def get_event(s):
    soup = BeautifulSoup(s.get(EVENTS_URL).text, features="html.parser")
    event_id = soup.find(id="upeventid")["value"]
    return event_id

def get_table(s, event_id):
    table = s.post(TABLE_URL, data={
        "upeventid": event_id,
        "frmSubmit": ""
    }).text

    soup = BeautifulSoup(table, features="html.parser")

    table_rows = soup.find_all("tr")[1:]

    participants = []

    for row in table_rows:
        cols = row.find_all("td")
        participant_data = {
            "name": cols[2].contents[0].strip(),
            "type": cols[3].contents[0].strip(),
            "payment_status": cols[4].contents[0].strip(),
            "mobile": cols[5].contents[0].strip(),
            "email": cols[6].contents[0].strip(),
            "event": event_id
        }
        participants.append(participant_data)

    return participants

def mongoConnect(url, db, collection):
    client = MongoClient(url)
    database = client.get_database('GravitasDB')
    collection = database.participants
    return collection

if __name__ == '__main__':
    for credential in credentials:
        try:
            email = credential["email"]
            password = credential["password"]
            login(s, email, password)

            event_id = get_event(s)

            participants = get_table(s, event_id)

        except:
            continue

        print('[UPDATE] Fetched participants.')
        print('[UPDATE] Adding entries to database.')

        collection = mongoConnect(MONGO_URL, MONGO_DB, MONGO_COLLECTION)
        for participant in participants:
            collection.update_one(
                {"email": participant['email']},
                {"$set":participant},
                upsert=True,
            )

        print('[INFO] Added entries successfully.')
