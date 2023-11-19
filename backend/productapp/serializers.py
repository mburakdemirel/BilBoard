from rest_framework import serializers
from mainapp.models import Product

class ProductSerializer (serializers.ModelSerializer):
    """Serializer for recipes."""
    class Meta:
        model = Product
        fields = ['id', 'title', 'time_minutes', 'price', 'product_photo', 'description', 'category', 'return_date']
        read_only_fields = ['id']

    