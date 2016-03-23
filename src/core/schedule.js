import co from 'co';
import {c} from '../core/db';
import {getCollective} from './collective';

import {populate, scheduleDate} from '../models/schedule';
import {shortifyName} from '../models/collective';
import {courses} from '../models/course';

export async function getSchedule(period, semester) {
    let data = await c('schedules').findOne({
        period: period,
        semester: semester
    });
    if (data) return data;
    return null;
}

export async function getScheduleList() {
    let list = await c('schedules')
        .find({}, {period: 1, semester: 1})
        .toArray();
    return list
        .sort((a, b) => {
            let ad = scheduleDate(a);
            let bd = scheduleDate(b);

            return ad.getTime() - bd.getTime();
        });
}

export async  function populateSchedule(schedule) {
    let collective = await getCollective({}, {id: 1, name: 1});
    let collective_dict = collective.reduce((dict, i) => {
        dict[i.id] = i.name;
        return dict;
    }, {});

    let populateLesson = populate(courses);
    let populateTeacher = populate(collective_dict, i => shortifyName(i));

    return schedule.map(i => {
        return {
            group: i.group,
            time: i.time,
            week: i.week.map(record => {
                if (!record) return record;

                let lesson = record.lesson;
                let teacher = record.teacher;
                let time = record.time;

                return {
                    time: time,
                    lesson: populateLesson(lesson),
                    teacher: {
                        id: teacher,
                        url: `/teacher/${teacher}`,
                        name: populateTeacher(teacher)
                    }
                };
            })
        };
    });
}