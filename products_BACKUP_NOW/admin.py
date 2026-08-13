from django.contrib import admin
from . models import Category , Product , ProductImage , Review , Wishlist
# Register your models here.
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(Review)
admin.site.register(Wishlist)





#                 python manage.py runserver