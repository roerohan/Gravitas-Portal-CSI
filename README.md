# Gravitas-Portal-CSI

A portal to scrape registrations for Gravitas events.

## Execution

1. Make a file called `.env` in the project root and add environment variables as specified in `sample.env`.
2. Make a file `scripts/credentials.json` which contains an array of Gravitas Portal Credentials in the following format.

```json
[
    {
        "email": "someone@something.com",
        "password": 12345,
    },
    {
        "email": "someone@something.com",
        "password": 12345,
    },
]
```

3. Run `npm run populate` to populate the database. Every time you run `npm run populate`, the database will be updated (make it a cron job).

> Note: This will work only if you have python3 installed as `python` (change it to `python3` in `package.json` otherwise). You would also need to install the requirements by going into the scripts folder and running `pip install -r requirements.txt`.

4. Run `npm start` to start the server.
5. After entering admin credentials, visit `/populate` and follow the instructions to add `gravitasID` and `name` to the database. You will need to form query strings of the form:

```
https://somedomain.com/populate?gravitasID=GKSomething&name=Clickbait
```

6. Visit the home page to view all entries.
