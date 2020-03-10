import re
import yaml

FM_BOUNDARY = re.compile(r'^-{3,}', re.MULTILINE)


def parse_yaml_front_matter(data: str):
    fm, content = split_yaml_front_matter(data)
    fm = fm if fm else {}
    return {
        **fm,
        'content': content,
    }


def split_yaml_front_matter(text: str):
    """
    Parse text with YAML frontmatter, return metadata and content.
    Pass in optional metadata defaults as keyword args.

    If frontmatter is not found, returns an empty metadata dictionary
    and original text content.
    """

    # split on the first two triple-dashes
    try:
        _, fm, content = FM_BOUNDARY.split(text, 2)
    except ValueError:
        # if we can't split, bail
        return None, None

    # parse yaml, now that we have frontmatter
    fm = yaml.safe_load(fm)
    if isinstance(fm, dict):
        return fm, content.strip()
    return None, None
