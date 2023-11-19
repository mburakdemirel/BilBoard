from rest_framework import serializers
from mainapp.models import Product

class ProductSerializer (serializers.ModelSerializer):
    """Serializer for products."""
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'return_date', 'product_photo', 'category']
        read_only_fields = ['id']

    def validate(self, data):
        """Check category and set price, return_date fields."""
        category = data.get('category')
        price = data.get('price')
        return_date = data.get('return_date')

        #Frontend engellemeli çünkü return_date'i de girebilir adam o field gözükmemeli
        if category == 'secondhand' and price is None:
            raise serializers.ValidationError("Price is required for secondhand products.")

        if category == 'borrow' and return_date is None:
            print("heeyyy", data)
            raise serializers.ValidationError("Return date is required for borrow products.")

        return data


class ProductDetailSerializer(ProductSerializer):
    """Serializer for product detail view."""
    class Meta (ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['description', 'upload_date']
    