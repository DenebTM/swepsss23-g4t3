import asyncio
import sys
import aiohttp
import requests
import time
import logging

import common
from read_sensorvalues import read_sensorvalues
from db import db_conn
from search_for_sensorstations import search_for_sensorstations

#amal alles aiohttp machen weil nid mischen
#define den return als a future dass i des im manage sensorstations sieh
async def poll_for_connection(connection_request):
    try:
        response = requests.get(common.web_server_address+"/access-points/"+common.access_point_name)
        return response.json['status']
        asyncio.sleep(50)
    except:
        print("cant connect to webserver") #TODO: Implement logging


async def spawn_sensorstation_tasks(sensorstations):
    for sensorstation in sensorstations:
        await asyncio.create_task(read_sensorvalues(sensorstation))

async def cancel_sensorstation_tasks(sensorstation, sensorstation_tasks):
    for sensorstation in sensorstation:
        pass #TODO cancel tasks marked as offline

async def manage_sensorstations(sensorstations, connection_request):
    while not connection_request.done():
        pass





# immer neue future createn when einmal offline
async def main():
    response = requests.post(common.web_server_address + "/accesspoints")
    while response.status_code != 200:
        response = requests.post(common.web_server_address + "/accesspoints")

        sensorstations = await search_for_sensorstations()


        #await spawn_sensorstation_tasks(sensorstations)
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
