from django.contrib import admin
from . models import CustomUserModel , Address , RiderProfile
# Register your models here.
admin.site.register(CustomUserModel)
admin.site.register(Address)
admin.site.register(RiderProfile)




# python manage.py runserver
