import {c} from '../core/db';
import {getCollective} from './collective';

import {populate} from '../models/schedule';
import {shortifyName} from '../models/collective';
import {courses} from '../models/course';

export function* getSchedule(period, semester) {
    let data = yield c('schedules').findOne({
        period: period,
        semester: semester
    });
    if (data) return data;
    return null;
}

export function* getScheduleList() {
    return yield c('schedules')
        .find({}, {period: 1, semester: 1})
        .toArray();
}

export function* populateSchedule(schedule) {
    let collective = yield getCollective({}, {id: 1, name: 1});
    let collective_dict = collective.reduce((dict, i) => {
        dict[i.id] = i.name;
        return dict;
    }, {});

    let populateLesson = populate(courses);
    let populateTeacher = populate(collective_dict, i => shortifyName(i));

    return schedule.map(group => {
        return {
            name: group.name,
            time: group.time,
            days: group.days.map(record => {
                if (!record) return record;

                let lesson = record.lesson;
                let teacher = record.teacher;
                let time = record.time;

                return {
                    time: time,
                    lesson: populateLesson(lesson),
                    teacher: populateTeacher(teacher)
                };
            })
        };
    });
}