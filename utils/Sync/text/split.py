def split(data, separator='\n\n'):
    try:
        s = data.index(separator)
        return data[:s], data[s:]
    except ValueError:
        return data, None