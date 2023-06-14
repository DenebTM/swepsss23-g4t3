#!/bin/bash

#move this to /etc/init.d/
config_yaml_path="/config.yaml"
python_path="/main.py"
config_path="/.configure"

if [ -f "$config_yaml_path" ]; then
    echo "File found. Running python script."
    /usr/bin/python3 "$python_script"
else
    echo "config.yaml not found. Running configure file first"
    /bin/bash "$config_path"
    echo "config.yaml was created. Running python script now"
    /usr/bin/python3 "$python_path"
fi
