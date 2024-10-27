from django.shortcuts import render
from .models import Product,Product_color,ProductImage,ProductSize
from django.db.models import Count,Sum
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
# Create your views here.


def main(request):
    products = ProductImage.objects.filter(is_main=True).select_related("varientID__productID").only(
            "varientID__productID__title",  # Only fetch product title
            "varientID__productID__price",  # Only fetch product price
            "varientID__productID__slug",  # Only fetch product price
            "image",  # Only fetch image field from ProductImage
        )
    context = {
        "products": products,
    }

    return render(request, "mainpage.html",context)


def add_product(request):
    if request.method == "POST":

        title = request.POST.get("title")
        price = request.POST.get("price")
        description = request.POST.get("description")
        category = request.POST['category']

        color_codes = request.POST.getlist('colorCode[]')
        colorname = request.POST.getlist('colorname[]')
        color_images = request.FILES.getlist('colorImages[0][]')


        product = Product.objects.create(title=title,price=price,description=description,category=category)

        for i, (color_code,color_name) in enumerate(zip(color_codes,colorname)):
            color = Product_color.objects.create(productID=product, color_code=color_code, color_name= color_name)

            sizes = request.POST.getlist(f'size[{i}][]')
            inventories = request.POST.getlist(f'inventory[{i}][]')

            for size, inventory in zip(sizes, inventories):
                ProductSize.objects.create(varientID=color, size=size, inventory=inventory)

            images = request.FILES.getlist(f'colorImages[{i}][]')
            main_image_index = request.POST.get(f'mainImage[{i}]')

            for j, image in enumerate(images):
                is_main_image = (str(j) == main_image_index)  # Compare with the index
                ProductImage.objects.create(varientID=color, image=image, is_main=is_main_image)

        return JsonResponse({'status': 'success','slug':product.slug})
    return render(request, "product_creation.html")




def product_detail(request,pslug):
    item = Product.objects.filter(slug=pslug).prefetch_related("variants", "variants__images", "variants__size").first()

    product_data = {
        'colors': [
        ],
        'sizes': ['S','M', 'L', 'XL']
    }

    if item:
        for i,sku in enumerate(item.variants.all()):  # Directly access pre-fetched Product_color instances
            product_data['colors'].append(
                {
                'name': sku.color_name,
                'code': sku.color_code,
                'images':[],
                'availableSizes': []
                }
            )

            for image in sku.images.all():
                product_data['colors'][i]['images'].append(image.image_url)

            for size in sku.size.all():
                product_data['colors'][i]['availableSizes'].append(size.size)

        context = {
            "item" : item
        } 
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse(product_data, safe=False)

    return render(request, "productdetail.html",context)
