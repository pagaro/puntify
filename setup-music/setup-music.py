import glob
import os
from time import sleep
import requests
from dotenv import load_dotenv

load_dotenv()
API_HOST = os.getenv('API_HOST')
sleep(10)

url = f"http://{API_HOST}:8000/"

data = {'username': 'toto', 'password': '123'}
x = requests.post(url + "login/", data=data)
token = x.json()["access_token"]

cookies = {"access_token": token}

for file in glob.glob("*.mp3"):
    print(file)
    with open(file, 'rb') as f:
        response = requests.post(url=url + "music/", cookies=cookies, files={'file': f})
