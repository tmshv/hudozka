import os
from glob import glob

from utils.fn import lprint, lmap
from utils.image.resize import crop

size = (400, 400)

# files = glob('/Users/tmshv/Dropbox/Dev/Hud School/Static/images/product*medium.jpg')
# files = files[:3]

files = ['product-2015-maketirovanie-doma-peterburga-img0298-medium.jpg','product-2015-zhivopis-img0308-medium.jpg','product-2015-maketirovanie-img0240-medium.jpg','product-2015-podvodnyj-mir-stankovaya-kompoziziya-img0346-medium.jpg','product-2015-risunok-img0037-medium.jpg','product-2015-skazki-mg1037-medium.jpg','product-2015-stankovaya-kompoziziya-img0350-medium.jpg','product-2015-zvety-stankovaya-kompoziziya-img0348-medium.jpg','product-2015-gravyura-mg1014-medium.jpg','product-2015-guash-mg1024-medium.jpg','product-2015-shlisselburg-1-medium.jpg','product-2015-dpk-portret-v-tehnike-applikaziya-img0356-medium.jpg','product-70-img3869-medium.jpg','product-2015-domiki-20150406-1613-medium.jpg','product-2015-skulptura-vov-20150406-1591-medium.jpg','product-2015-history-competition-2-medium.jpg','product-2015-rozhdestvenskaya-skazka-2-medium.jpg','product-2016-zimnie-zabavy-1-medium.jpg','product-2016-na-krylyah-babochek-1-medium.jpg','product-2016-narodnye-motivy-1-medium.jpg','product-around-the-world-1-medium.jpg',]


src = lambda i: '/Users/tmshv/Dropbox/Dev/Hud School/Static/images/' + os.path.basename(i)
dest = lambda i: '/Users/tmshv/Desktop/smartcrop_sandbox/' + os.path.basename(i)

for i in files:
    try:
        crop(src(i), dest(i), size)
    except:
        print(i)
