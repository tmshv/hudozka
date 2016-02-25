from glob import glob
import json
import os
import re
from pymongo import MongoClient
import settings

__author__ = 'tmshv'


def process_file(schedule_path):
    with open(schedule_path, 'rb') as schedule_file:
        data = schedule_file.read().decode('utf-8')
        try:
            return json.loads(data)
        except json.decoder.JSONDecodeError:
            print(schedule_path)


if __name__ == '__main__':
    db = MongoClient(settings.database_uri).hudozka
    db.schedules.drop()

    # dir_schedule = settings.root_dir_schedule
    dir_schedule = '/Users/tmshv/Dropbox/Dev/Hud School/Schedules/'
    files = glob(dir_schedule + '*.json')
    ss = list(map(process_file, files))

    list(map(print, ss))

    list(map(
        db.schedules.insert,
        filter(
            lambda i : i is not None,
            ss
        )
    ))
    print('schedule sync complete')