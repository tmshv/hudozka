import requests


class YDClient:
    """
    Implementation of https://tech.yandex.ru/disk/poligon/
    """

    base_url = 'https://cloud-api.yandex.net/v1/disk'

    def __init__(self, access_token):
        self.access_token = access_token

        self.base_headers = dict(
            Accept='application/json',
            Authorization='OAuth %s' % self.access_token,
        )

    async def get_flat(self, limit=20):
        """
        https://cloud-api.yandex.net/v1/disk/resources/files?
        [  limit=<количество файлов в списке>]
        [& media_type=<тип запрашиваемых файлов>]
        [& offset=<смещение относительно начала списка>]
        [& fields=<нужные ключи ответа>]
        [& preview_size=<размер превью>]
        [& preview_crop=<признак обрезки превью>]
        :return:
        """

        url = '{0}/resources/files'.format(self.base_url)
        payload = dict(
            limit=limit,
            offset=0,
        )
        r = requests.get(url, headers=self.base_headers, params=payload)
        self.check_code(r)

        json_dict = r.json()
        # return Directory(**json_dict)
        return json_dict

    def get_disk_metadata(self):
        """
        :return: disk metadata
        """
        url = self.base_url
        r = requests.get(url, headers=self.base_headers)
        self.check_code(r)
        disk = r.json()
        return Disk(
            trash_size=disk['trash_size'],
            total_space=disk['total_space'],
            used_space=disk['used_space'],
            system_folders=disk['system_folders']
        )

    def last_uploaded(self):
        """
        https://cloud-api.yandex.net/v1/disk/resources/last-uploaded?
        [  limit=<количество файлов в списке>]
        [& media_type=<тип запрашиваемых файлов>]
        [& fields=<нужные ключи ответа>]
        [& preview_size=<размер превью>]
        [& preview_crop=<признак обрезки превью>]
        """
        url = '{0}/resources/last-uploaded'.format(self.base_url)
        payload = dict(
            limit=100,
        )
        r = requests.get(url, headers=self.base_headers, params=payload)
        self.check_code(r)

        json_dict = r.json()
        # return Directory(**json_dict)
        return json_dict

    def get_content(self, path):
        """
        :param path: path to folder
        :return: content of folder
        """
        url = '{0}/resources'.format(self.base_url)

        payload = dict(
            path=path,
            limit=1000000
        )
        r = requests.get(url, headers=self.base_headers, params=payload)
        self.check_code(r)

        json_dict = r.json()
        return Directory(**json_dict)

    def create_folder(self, path_to_folder):
        """
        :param path_to_folder: path to folder
        :return: created folder
        """
        url = '{0}/resources'.format(self.base_url)

        payload = {'path': path_to_folder}
        r = requests.put(url, headers=self.base_headers, params=payload)
        self.check_code(r)

        return self.get_content(path_to_folder)

    def remove_folder_or_file(self, path):
        """
        Remove folder or file
        :param path: path to file or folder
        """
        url = '{0}/resources'.format(self.base_url)

        payload = {'path': path}
        r = requests.delete(url, headers=self.base_headers, params=payload)
        self.check_code(r)

    def copy_folder_or_file(self, path_from, path_to):
        """
        Copy folder or file
        :param path_from: from path
        :param path_to: to path
        """
        url = '{0}/resources/copy'.format(self.base_url)

        payload = {'path': path_to, 'from': path_from}
        r = requests.post(url, headers=self.base_headers, params=payload)
        self.check_code(r)

    def get_download_link(self, path):
        """
        :param path: path to file
        :return: download link to file
        """
        url = '{0}/resources/download'.format(self.base_url)

        payload = {'path': path}
        r = requests.get(url, headers=self.base_headers, params=payload)
        self.check_code(r)

        return r.json()

    def get_published_elements(self):
        """
        :return: published elements
        """
        json_dict = self._get_dictionary_of_published_files()

        elements = []
        for item in json_dict['items']:
            if item['type'] == 'dir':
                elements.append(Directory(**item))
            elif item['type'] == 'file':
                elements.append(File(**item))
        return elements

    def get_public_link_to_folder_or_file(self, path):
        """
        :param path: path
        :return: public link to folder or file
        """
        url = '{0}/resources/publish'.format(self.base_url)

        payload = {'path': path}
        r = requests.put(url, headers=self.base_headers, params=payload)
        self.check_code(r)

        files = self._get_dictionary_of_published_files()
        for file in files['items']:
            if str(file['path']).endswith(path):
                return file['public_url']
        return ''

    def unpublish_folder_or_file(self, path):
        """
        Unpublish folder of file
        :param path: path to file or folder
        """
        url = '{0}/resources/unpublish'.format(self.base_url)

        payload = {'path': path}
        r = requests.put(url, headers=self.base_headers, params=payload)
        self.check_code(r)

    def get_list_of_all_files(self):
        """
        :return: List of all files
        """
        url = '{0}/resources/files'.format(self.base_url)

        r = requests.get(url, headers=self.base_headers)
        self.check_code(r)

        json_dict = r.json()

        files = []
        for item in json_dict['items']:
            f = File(**item)
            files.append(f)
        return files

    def move_folder_or_file(self, path_from, path_to):
        """
        Move folder or file
        :param path_from: path from
        :param path_to: path to
        """
        url = '{0}/resources/move'.format(self.base_url)

        payload = {'path': path_to, 'from': path_from}
        r = requests.post(url, headers=self.base_headers, params=payload)
        self.check_code(r)

    def upload_file(self, path_from, path_to):
        """
        Upload file
        :param path_from: path from
        :param path_to: path to yandex disk
        """
        url = '{0}/resources/upload'.format(self.base_url)

        payload = {'path': path_to}
        r = requests.get(url, headers=self.base_headers, params=payload)
        self.check_code(r)

        json_dict = r.json()
        upload_link = json_dict["href"]

        with open(path_from, 'rb') as fh:
            files = {'file': fh}

            r2 = requests.put(upload_link, headers=self.base_headers, files=files)
            self.check_code(r2)

    def upload_file_from_url(self, from_url, path_to):
        """
        Upload file by URL
        :param from_url: URL path from
        :param path_to: path to yandex disk
        """
        url = '{0}/resources/upload'.format(self.base_url)

        payload = {'path': path_to, 'url': from_url}
        r = requests.post(url, headers=self.base_headers, params=payload)
        self.check_code(r)

    def _get_dictionary_of_published_files(self):
        url = '{0}/resources/public'.format(self.base_url)

        r = requests.get(url, headers=self.base_headers)
        self.check_code(r)

        return r.json()

    def check_code(self, req):
        if not str(req.status_code).startswith('2'):
            raise YDException(req.status_code, req.text)


class YDException(Exception):
    code = None

    def __init__(self, code, text):
        super(YDException, self).__init__(text)
        self.code = code

    def __str__(self):
        return "%d. %s" % (self.code, super(YDException, self).__str__())


class Directory:
    def __init__(self, **kwargs):
        self.children = []

        for key in kwargs:
            if key is not '_embedded':
                setattr(self, key, kwargs[key])

        if "_embedded" in kwargs:
            for item in kwargs['_embedded']['items']:
                if item['type'] == 'dir':
                    d = Directory(**item)
                    self.children.append(d)

                if item['type'] == 'file':
                    f = File(**item)
                    self.children.append(f)

    def get_children(self):
        return self.children


class File:
    def __init__(self, **kwargs):
        for key in kwargs:
            setattr(self, key, kwargs[key])


class Disk:
    def __init__(self, trash_size, total_space, used_space, system_folders):
        self.trash_size = trash_size
        self.total_space = total_space
        self.used_space = used_space
        self.system_folders = system_folders
