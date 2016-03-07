import re

import frontmatter
import yaml
from markdown import markdown

from utils.text.split import split, split_with

# FM_BOUNDARY = re.compile(r'^-{3,}$', re.MULTILINE)
FM_BOUNDARY = re.compile(r'^-{3,}', re.MULTILINE)

def read_file(file):
    with open(file, 'rb') as f:
        data = f.read().decode('utf-8')
        return data


def read_yaml(file):
    with open(file, 'rb') as f:
        data = f.read().decode('utf-8')
        return yaml.load(data)


def read_md(file):
    with open(file, 'rb') as f:
        data = f.read().decode('utf-8')
        return markdown(data)


def read_yaml_md(file):
    yaml, content = parse_yaml_front_matter(read_file(file))
    return yaml, markdown(content)

    # data = frontmatter.load(file)
    # return data.metadata, markdown(data.content)


def read_md_yaml(file):
    data = read_file(file)
    yaml_data, md_data = split_with(['\n\n', '\r\n\r\n'])(data)

    if not yaml_data and not md_data:
        return (None, read_md(file))

    try:
        y = yaml.load(yaml_data)
    except:
        y = None

    m = markdown(md_data) if md_data else None
    return y, m


def parse_yaml_front_matter(text, **defaults):
    """
    Parse text with YAML frontmatter, return metadata and content.
    Pass in optional metadata defaults as keyword args.

    If frontmatter is not found, returns an empty metadata dictionary
    and original text content.
    """

    # metadata starts with defaults
    metadata = defaults.copy()

    # split on the first two triple-dashes
    try:
        _, fm, content = FM_BOUNDARY.split(text, 2)
    except ValueError:
        # if we can't split, bail
        return metadata, text

    # parse yaml, now that we have frontmatter
    fm = yaml.safe_load(fm)
    if isinstance(fm, dict):
        metadata.update(fm)

    return metadata, content.strip()