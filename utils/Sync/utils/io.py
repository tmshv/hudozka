import re
import yaml

from kazimir import markdown_to_html

FM_BOUNDARY = re.compile(r'^-{3,}', re.MULTILINE)


def read_yaml_md(data):
    yaml_front_matter, content = split_yaml_front_matter(data)
    return yaml_front_matter, markdown_to_html(content)


def parse_yaml_front_matter(data: str):
    fm, content = split_yaml_front_matter(data)
    fm = fm if fm else {}
    return {
        **fm,
        'content': content,
    }


def split_yaml_front_matter(text, **defaults):
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
