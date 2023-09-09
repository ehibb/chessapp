#!/bin/bash

python manage.py flush --noinput
python manage.py runserver

exit 0
