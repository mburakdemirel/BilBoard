from rest_framework import serializers
from mainapp.models import Product

class ProductSerializer (serializers.ModelSerializer):
    """Serializer for products."""
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'product_photo', 'category']
        read_only_fields = ['id']


class ProductDetailSerializer(ProductSerializer):
    """Serializer for product detail view."""
    class Meta (ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['description', 'upload_time']