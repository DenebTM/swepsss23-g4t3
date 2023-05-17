import logging

logging.basicConfig(filename='temp.log', encoding='utf-8', format='%(asctime)s-%(levelname)s-%(message)s', datefmt='%d/%m/%Y %I:%M:%S %p')

async def append_temporary_to_permanent_logfile():
    with open('temp.log', 'r') as temp_file:
        temp_lines = temp_file.readlines()

    with open('audit.log', 'a') as persistent_file:
        persistent_file.writelines(temp_lines)

    #Clear temp file
    open('temp.log', 'w').close()