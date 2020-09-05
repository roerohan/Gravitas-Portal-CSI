# Gravitas-Portal-CSI

A portal to scrape registrations for Gravitas events.

## Requirements

- Node
- Python (python3)


## Installation

- Clone the repository

```bash
git clone git@github.com:roerohan/Gravitas-Portal-CSI.git
```

- Run `npm install`

```bash
npm install
```

- Pip install the python requirements

```bash
cd scripts
pip install -r requirements.txt
```

> Note: If python 3 is called `python3` (instead of `python`) on your system, change the `populate` script in `package.json` to `python3 scraper.py`.


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

3. Run `npm start` to start the server.
4. After entering admin credentials, visit `/populate` and follow the instructions to add `gravitasID` and `name` to the database. You will need to form query strings of the form:

```
https://somedomain.com/populate?gravitasID=GKSomething&name=Clickbait
```

5. Visit the home page to view all entries.
6. Entries are repopulated every 10 minutes by default.

> Note: You can run `npm run populate` to populate the database. A cron job automatically populates the database in `server.js`.
