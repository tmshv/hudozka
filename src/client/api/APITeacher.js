import EndPoint from './EndPoint';

export default class APITeacher extends EndPoint {
    list(sort=null) {
        let url = '/teacher/list';
        if(sort) url = `/teacher/list?sort=${sort.join(',')}`;
        return this.get(url);
    }

    fetch(id) {
        let url = `/teacher/${id}`;
        return this.get(url);
    }
}