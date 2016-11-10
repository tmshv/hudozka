from markdown import markdown

from kazimir.video import VideoExtension


def kazimir_to_html(text):
    return markdown(text, extensions=[VideoExtension()])
