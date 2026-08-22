from django.contrib import admin
from . models import CustomUserModel , Address , RiderProfile , NewsletterSubscriber
# Register your models here.
admin.site.register(CustomUserModel)
admin.site.register(Address)
admin.site.register(RiderProfile)
admin.site.register(NewsletterSubscriber)




# python manage.py runserver
