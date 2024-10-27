from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Customers)
admin.site.register(SellerPref)
admin.site.register(Copouns)
admin.site.register(Product)
admin.site.register(Product_color)
admin.site.register(ProductImage)
admin.site.register(ProductSize)
admin.site.register(Orders)
admin.site.register(OrderProduct)
admin.site.register(Sells)
