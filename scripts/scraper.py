from bs4 import BeautifulSoup
import requests
import pymongo
import json

s = requests.session()

BASE_URL = "http://info.vit.ac.in/gravitas2019/gravitas_coordinator_login.asp"
LOGIN_URL = "http://info.vit.ac.in/gravitas2019/coord_login_authorize.asp"
EVENTS_URL = "http://info.vit.ac.in/gravitas2019/coord_event_participants.asp"
TABLE_URL = "http://info.vit.ac.in/gravitas2019/coord_event_participant_list.asp"

MONGO_URL = "mongodb://localhost:27017"
MONGO_DB = "GravitasDB"
MONGO_COLLECTION = "participants"

credentials = json.load(open("credentials.json"))

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

def get_event(s):
    soup = BeautifulSoup(s.get(EVENTS_URL).text, features="html.parser")
    event_id = soup.find(id="upeventid")["value"]
    return event_id

def get_table(s, event_id):
    table = s.get(TABLE_URL, data={
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
    client = pymongo.MongoClient(url)
    collection = client[db][collection]
    return collection

def main():
    for credential in credentials:
        try:
            email = credential["email"]
            password = credential["password"]
            login(s, email, password)
            event_id = get_event(s)
            participants = get_table(s, event_id)

        except:
            continue

        collection = mongoConnect(MONGO_URL, MONGO_DB, MONGO_COLLECTION)
        collection.insert_many(participants)

main()
