from markdown import Extension
from markdown.inlinepatterns import IMAGE_LINK_RE, IMAGE_REFERENCE_RE
from markdown.blockprocessors import BlockProcessor
from markdown.util import etree
import re

FIGURES = [
    u'^\s*' + IMAGE_LINK_RE + u'\s*$',
    u'^\s*' + IMAGE_REFERENCE_RE + u'\s*$',
]

TAG_FIGURE = 'figure'
TAG_FIGCAPTION = 'figcaption'
NAME = 'FigureAltCaption'


class FigureProcessor(BlockProcessor):
    FIGURES_RE = re.compile('|'.join(f for f in FIGURES))

    def test(self, parent, block):
        is_image = bool(self.FIGURES_RE.search(block))
        is_single_list = (len(block.splitlines()) == 1)
        is_in_figure = parent.tag == TAG_FIGURE

        return is_image and is_single_list and not is_in_figure

    def run(self, parent, blocks):
        raw_block = blocks.pop(0)
        caption_text = self.FIGURES_RE.search(raw_block).group(1)

        figure = etree.SubElement(parent, TAG_FIGURE)
        figure.text = raw_block

        figcaption_elem = etree.SubElement(figure, TAG_FIGCAPTION)
        figcaption_elem.text = caption_text


class FigureExtension(Extension):
    def extendMarkdown(self, md, md_globals):
        md.parser.blockprocessors.add(
            NAME,
            FigureProcessor(md.parser),
            '<ulist'
        )
