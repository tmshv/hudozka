import re


def get_following_tags(element, stop_tag_pattr):
    stop_exp = re.compile(stop_tag_pattr)
    following = element.xpath('./following-sibling::*')
    tags = []
    i = 0
    while True:
        try:
            tag = following[i]
            if stop_exp.match(tag.tag):
                break
            tags.append(tag)
        except IndexError as tag:
            break
        i += 1
    return tags


def get_text_following_by_tag(element, tag, contains, strip=True):
    e = element.xpath('.//%s[contains(text(), "%s")]/following-sibling::text()' % (tag, contains))
    if len(e) > 0:
        if strip:
            return e[0].strip()
        else:
            return e[0]
    else:
        return None