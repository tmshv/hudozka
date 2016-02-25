import {populate} from '../../utils/populate';
import {getCourseNameByID} from '../../models/course';
import {indexEquals} from '../../utils/common';
import {select, choise} from '../../utils/common';

function isRequested(period, semester) {
    return function (schedule) {
        return schedule.period === period && schedule.semester === semester;
    }
}

export default function (app) {
    //app.controller('ScheduleController', );
};
