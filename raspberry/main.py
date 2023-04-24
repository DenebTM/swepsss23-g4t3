import asyncio
import sys
import aiohttp
import requests
import time
import logging

import common
from read_sensorvalues import read_and_send_sensorvalues
from db import db_conn
from search_for_sensorstations import search_for_sensorstations


async def poll_for_connection():
    try:
        response = requests.get(common.web_server_address+"/access-points/"+common.access_point_name)

        return response.json['status']
    except:
        print("cant connect to webserver log")


async def spawn_sensorstation_tasks(sensorstations):
    for sensorstation in sensorstations:
        await asyncio.create_task(read_and_send_sensorvalues(sensorstation, db_conn))


async def main():
    response = requests.post(common.web_server_address + "/accesspoints")
    while response.status_code != 200:
        response = requests.post(common.web_server_address + "/accesspoints")

    while True:
        sensorstations = await search_for_sensorstations()

        await spawn_sensorstation_tasks(sensorstations)
    #     # send to /accesspoints that i exist POST
    #     access_point = {'name': common.access_point_name}
    #     try:
    #         response = requests.post(common.web_server_address, json = access_point, timeout=3)
    #         # response is id:(id), active:(True oder False), name:(mei name)
    #         if response == 200:
    #             polling_loop = asyncio.new_event_loop()
    #             polling_loop.create_tast(listen_for_instructions)
    #             polling_loop.run_forever()
            
    #     except requests.ConnectTimeout:
    #         print("Could not connect to backend", file=sys.stderr)

# search_loop = asyncio.new_event_loop()
# asyncio.set_event_loop(search_loop)
# search_loop.create_task(search_for_sensorstations())
# search_loop.run_forever()
asyncio.run(main())
