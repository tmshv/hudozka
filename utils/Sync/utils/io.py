import yaml
from markdown import markdown

from utils.text.split import split, split_with


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
    data = read_file(file)
    yaml_data, md_data = split_with(['\n\n', '\r\n\r\n'])(data)

    try:
        y = yaml.load(yaml_data)
    except:
        y = None

    m = markdown(md_data) if md_data else None

    return y, m
