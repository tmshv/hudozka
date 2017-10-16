from sync.data import request
from lxml import etree


async def typograf(text, options={}):
    text = text.replace('&', '&amp;')
    text = text.replace('<', '&lt;')
    text = text.replace('>', '&gt;')

    body = '''
    <?xml version="1.0" encoding="UTF-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
     <ProcessText xmlns="http://typograf.artlebedev.ru/webservices/">
      <text>{text}</text>
      <entityType>1</entityType>
      <useBr>0</useBr>
      <useP>1</useP>
      <maxNobr>3</maxNobr>
      </ProcessText>
     </soap:Body>
    </soap:Envelope>
    '''.strip().format(text=text)

    url = 'http://typograf.artlebedev.ru/webservices/typograf.asmx'
    resp = await request.post(url, body, {}, {
        'Content-Type': 'text/xml',
        'SOAPAction': 'http://typograf.artlebedev.ru/webservices/ProcessText',
    })

    response_tree = etree.fromstring(resp.encode())

    try:
        # look for ProcessTextResult
        typograf_response = response_tree.getchildren()[0].getchildren()[0].getchildren()[0].text
    except Exception as response_tree:
        print(response_tree)
        return text

    typograf_response = typograf_response.replace('&amp;', '&')
    typograf_response = typograf_response.replace('&lt;', '<')
    typograf_response = typograf_response.replace('&gt;', '>')
    return typograf_response
