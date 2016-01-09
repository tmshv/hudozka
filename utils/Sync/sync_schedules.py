from glob import glob
import json
import os
import re
from pymongo import MongoClient
import settings

__author__ = 'tmshv'


db = MongoClient(settings.database_uri).hudozka
db.schedules.drop()


for schedule_path in glob(settings.root_dir_schedule + '/*.json'):
    with open(schedule_path, 'r') as schedule_file:
        name = os.path.basename(schedule_path)

        period = re.search('(\d{4}-\d{4})', name).group(1)
        semester = re.search('([a-zA-Z]+)\.json$', name).group(1)

        schedule = json.loads(schedule_file.read())
        # print(name, period, semester, schedule)

        db.schedules.insert({
            'period': period,
            'semester': semester,
            'schedule': schedule
        })

print('schedule sync complete')