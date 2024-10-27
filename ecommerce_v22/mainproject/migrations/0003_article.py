# Generated by Django 5.1.1 on 2024-10-26 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainproject', '0002_product_color_productimage_productsize_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('content', models.TextField()),
                ('created_date', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-created_date'],
            },
        ),
    ]