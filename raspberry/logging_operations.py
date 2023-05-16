import logging

formatter = logging.basicConfig(format='%(asctime)s-%(levelname)s-%(message)s')

async def append_temporary_to_permanent_logfile():
    with open('temp.log', 'r') as temp_file:
        temp_lines = temp_file.readlines()

    with open('audit.log', 'a') as persistent_file:
        persistent_file.writelines(temp_lines)

    #Clear temp file
    open('temp.log', 'w').close()