## Dependencies (pip)

- asyncio
- aiohttp
- sqlite3
- bleak
- pyyaml

## Running the code

**Command:** `python3 main.py`

## Running the mock server

### Dependencies (pip):

- flask

**Command:** `python3 mock_server/mock_rest.py`

## Running unit tests

**Command:** `python3 -m unittest tests/*.py`

## Troubleshooting

- If there are problems with the database, delete sensorstations.db and it will be regenerated at the next run