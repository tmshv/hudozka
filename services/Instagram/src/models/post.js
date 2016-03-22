let date = i => new Date(parseInt(i) * 1000);

/**
 * @param i
 * {
 *    "attribution": null,
 *    "tags": ["люстра", "кукольныйдомик", "shlb_hudozka", "шлиссельбург", "стекло", "выставочноепространство", "художка"],
 *    "type": "image",
 *    "location": null,
 *    "comments": {"count": 0, "data": []},
 *    "filter": "Normal",
 *    "created_time": "1458652687",
 *    "link": "https://www.instagram.com/p/BDQbcm4Jiid/",
 *    "likes": {
 *        "count": 138,
 *        "data": [{
 *             "username": "marinada29",
 *             "profile_picture": "https://scontent.cdninstagram.com/t51.2885-19/10958645_950152745008546_618790272_a.jpg",
 *             "id": "326555798",
 *             "full_name": "Marina Davidovich 89024808351"
 *         }]
 *    },
 *    "images": {
 *        "low_resolution": {
 *            "url": "https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/12479404_949349891830020_632926748_n.jpg?ig_cache_key=MTIxMTU4OTAxMjkwODAyNjAxMw%3D%3D.2.l",
 *            "width": 320,
 *            "height": 320
 *        },
 *        "thumbnail": {
 *            "url": "https://scontent.cdninstagram.com/t51.2885-15/s150x150/e35/c0.134.1080.1080/12816835_959212777507222_1085128603_n.jpg?ig_cache_key=MTIxMTU4OTAxMjkwODAyNjAxMw%3D%3D.2.c",
 *            "width": 150,
 *            "height": 150
 *        },
 *        "standard_resolution": {
 *            "url": "https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/12479404_949349891830020_632926748_n.jpg?ig_cache_key=MTIxMTU4OTAxMjkwODAyNjAxMw%3D%3D.2.l",
 *            "width": 640,
 *            "height": 640
 *        }
 *    },
 *    "users_in_photo": [],
 *    "caption": {
 *        "created_time": "1458652687",
 *        "text": "Люстра. В выставочном пространстве \"Кукольный домик\" оформляется одна из ниш. #shlb_hudozka #кукольныйдомик #выставочноепространство #стекло #люстра #художка #шлиссельбург",
 *        "from": {
 *            "username": "hudozka",
 *            "profile_picture": "https://scontent.cdninstagram.com/t51.2885-19/11357496_464997000344800_2124591831_a.jpg",
 *            "id": "1668537441",
 *            "full_name": "Шлиссельбургская ДХШ"
 *        },
 *        "id": "1211589015567214752"
 *    },
 *    "user_has_liked": false,
 *    "id": "1211589012908026013_1668537441",
 *    "user": {
 *        "username": "hudozka",
 *        "profile_picture": "https://scontent.cdninstagram.com/t51.2885-19/11357496_464997000344800_2124591831_a.jpg",
 *        "id": "1668537441",
 *        "full_name": "Шлиссельбургская ДХШ"
 *    }
 * }
 */
export const postFromInstagramMedia = i => ({
    data: i,
    type: 'instagram',
    date: date(i['created_time']),
    id: i.id
});
