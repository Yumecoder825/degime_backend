# Generated by Django 4.2.9 on 2024-03-24 10:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop_app', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='title',
            new_name='product_name',
        ),
        migrations.RemoveField(
            model_name='product',
            name='back_image_urls',
        ),
        migrations.RemoveField(
            model_name='product',
            name='code',
        ),
        migrations.RemoveField(
            model_name='product',
            name='image_urls',
        ),
        migrations.RemoveField(
            model_name='product',
            name='price',
        ),
        migrations.RemoveField(
            model_name='product',
            name='price_without_fee',
        ),
        migrations.AddField(
            model_name='product',
            name='back_image',
            field=models.ImageField(default='', upload_to='product_images/'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='product',
            name='front_image',
            field=models.ImageField(default='', upload_to='product_images/'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='product',
            name='product_code',
            field=models.CharField(default='', max_length=8, unique=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='product',
            name='description',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='product',
            name='is_public',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='logo_color',
            field=models.CharField(choices=[('white', 'White'), ('black', 'Black'), ('blue', 'Blue')], max_length=20),
        ),
        migrations.AlterField(
            model_name='product',
            name='stock',
            field=models.IntegerField(),
        ),
    ]