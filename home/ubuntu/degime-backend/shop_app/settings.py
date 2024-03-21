DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'ENFORCE_SCHEMA': True,
        'NAME': 'your_database_name',
        'HOST': 'your_mongodb_host',
        'PORT': 'your_mongodb_port',
        'USER': 'your_mongodb_username',
        'PASSWORD': 'your_mongodb_password',
        'AUTH_SOURCE': 'admin',
    }
}