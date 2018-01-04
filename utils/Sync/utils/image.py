import asyncio
from subprocess import call


async def image_magick_resize(input_file, output_file, size, quality=85):
    interlace = 'Plane'
    s = '%dx%d' % size

    cmd = [
        '/usr/local/bin/convert',
        '"%s"' % input_file,

        '-strip',
        '-interlace', interlace,
        '-auto-orient',
        '-resize', s,
        '-quality', str(quality),

        '"%s"' % output_file,
    ]

    cmd = ' '.join(cmd)
    process = await asyncio.create_subprocess_shell(cmd)
    await process.wait()


async def image_magick_pdf_to_img(input_file, output_file):
    call([
        '/usr/local/bin/gs',
        '-q',
        '-sDEVICE=jpeg',
        '-dLastPage=1',
        '-o', output_file,
        input_file,
    ])
