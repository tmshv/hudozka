import os
import re
import settings

__author__ = 'Roman Timashev'

__check_description_filename_exp = re.compile('^[%s]+(\[\d+\])\.md$' % settings.description_available_chars)


def check_description_filename(filename):
    return __check_description_filename_exp.match(filename)


def suggest_description_filename(filename):
    bn = os.path.basename(filename)
    bn = os.path.splitext(bn)[0]
    v = settings.default_description_version
    return '%s [%s].md' % (bn, v)
