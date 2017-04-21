import os

db_uri = os.getenv('DB_URI', 'mongodb://localhost:27017')
db_name = os.getenv('DB_NAME', 'hudozka')
db_user = os.getenv('DB_USER', None)
db_password = os.getenv('DB_PASSWORD', None)
host = os.getenv('APP_HOST', '0.0.0.0')
