from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import timedelta
from django.contrib.auth.base_user import BaseUserManager
import numpy as np
from django.utils.text import slugify


# Create your models here.
class CustomerUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Creates and returns a user with an email and password."""
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Hash the password
        user.save(using=self._db)
        return user

    def get_by_natural_key(self, natural_key):
        try:
            return self.get(username=natural_key)
        except self.model.DoesNotExist:
            try:
                return self.get(email=natural_key)
            except self.model.DoesNotExist:
                try:
                    return self.get(phone_number=natural_key)
                except self.model.DoesNotExist:
                    raise NotImplementedError()
    


class Customers(AbstractUser):
    cities = [
        "alexanderia",
        "cairo",
    ]
        

    phone = models.CharField(max_length=13,null=True)
    is_seller = models.BooleanField(default=False,null=True)
    weights_file_path = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=300,null=True)
    city = models.IntegerField(choices=[(index, cat.capitalize()) for index, cat in enumerate(cities)],null=True)

    objects = CustomerUserManager()
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['phone','username']

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',  # Unique related_name
        blank=True,
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',  # Unique related_name
        blank=True,
    )
    
    def set_weights(self, weights):
        pass
    
    def get_weights(self):
        pass

    def __str__(self):
        return self.username

    @property
    def cart_items_count(self):
        items = self.cartitems_set.all()
        return sum([item.count for item in items])



class SellerPref(models.Model):
    user = models.ForeignKey(Customers,on_delete=models.CASCADE,null=True)
    no_of_sales = models.PositiveIntegerField(default=0,null=True)
    views = models.PositiveIntegerField(default=0,null=True)
    Earnings = models.PositiveIntegerField(default=0,null=True)



class Copouns(models.Model):
    user = models.ForeignKey(Customers,on_delete=models.CASCADE,null=True)
    percent = models.PositiveIntegerField(default=0,null=True)
    useCount = models.PositiveIntegerField(default=0,null=True)
    copounTEXT = models.CharField(max_length=20 , null=True)



class Product(models.Model):
    categories = [
        "shirt",
        "jacket",
        "pants",
        "hoodie",
    ]

    title = models.CharField(max_length=100,null=True)
    price = models.IntegerField(null=True)
    description = models.CharField(max_length=300,null=True)
    views = models.IntegerField(blank=True,null=True)
    category = models.IntegerField(choices=[(index, cat.capitalize()) for index, cat in enumerate(categories)])
    slug = models.SlugField(blank=True,null=True) 


    weights_file_path = models.CharField(max_length=255, blank=True, null=True)
    def set_weights(self, weights):
        pass
    
    def get_weights(self):
        pass

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title) 
        random_number = np.random.randint(100, 999)
        self.slug = self.slug + str(random_number)

        super().save(*args, **kwargs)
    


class Product_color(models.Model):
    productID = models.ForeignKey(Product,on_delete=models.CASCADE,null=True,related_name="variants")
    color_code = models.CharField(max_length=20,null=True)
    color_name = models.CharField( max_length=20, null=True)

    def __str__(self):
        return self.color_code



class ProductImage(models.Model):
    varientID = models.ForeignKey(Product_color,on_delete=models.CASCADE,null=True,related_name="images")
    is_main = models.BooleanField(default=False,null=True)
    image = models.ImageField(upload_to='product_images/',null=True)

    def __str__(self):
        return str(self.image)
    
    @property
    def image_url(self):
        try:
            return self.image.url
        except:
            return ""



class ProductSize(models.Model):
    sizes = [
        ('S','small'),
        ('M','medium'),
        ('L','large'),
        ('XL','Xlarge'),
        ]
    varientID = models.ForeignKey(Product_color,on_delete=models.CASCADE,null=True,related_name="size")
    size = models.CharField(max_length=3,choices=sizes,null=True)
    inventory = models.IntegerField(null=True)

    def __str__(self):
        return str(self.varientID.productID)+str(self.size)


class CartItems(models.Model):
    user = models.ForeignKey(Customers,on_delete=models.CASCADE,null=True,related_name="cart")
    product = models.ForeignKey(Product,on_delete=models.CASCADE,null=True)
    count = models.IntegerField(default=1,null=True)

    @classmethod
    def add_to_cart(cls, p, user):
        x = cls.objects.filter(product=p ,u=user).first()
        if x:
            x.count += 1
            x.save(updated_fields=['count'])

        else:
            x = cls(product=p, user=user, count=1)
            x.save()



class Orders(models.Model):
    user = models.ForeignKey(Customers,on_delete=models.CASCADE,null=True,related_name="orders")
    dateOfOrder = models.DateField(auto_now_add=True,null=True)
    dateOfDelivery = models.DateField(null=True)
    total = models.IntegerField(null=True)
    address = models.CharField(max_length=300,null=True)
    is_delevered = models.BooleanField(default=False,null=True)

    def save(self, *args, **kwargs):
        # Set the next_day to be the next day from the created_at date
        if not self.pk:  # Only set next_day if the object is being created
            self.next_day = self.dateOfOrder.date() + timedelta(days=1)
        super().save(*args, **kwargs)  # Call the original save method



class OrderProduct(models.Model):
    ordeID = models.ForeignKey(Orders,on_delete=models.CASCADE,null=True,related_name="product")
    productID = models.ForeignKey(Product,on_delete=models.CASCADE,null=True,related_name="sells")
    count = models.IntegerField(null=True)



class Sells(models.Model):
    seller = models.ForeignKey(SellerPref,on_delete=models.CASCADE,null=True,related_name="sells")
    ordeID = models.ForeignKey(Orders,on_delete=models.CASCADE,null=True,related_name="purchaces")
