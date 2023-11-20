from rest_framework import serializers
from mainapp.models import Product

class ProductCreateSerializer (serializers.ModelSerializer):
    """Serializer for products."""
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'return_date', 'product_photo', 'category', 'description', 'upload_date', 'user']
        read_only_fields = ['id', 'user', 'upload_date']

    def validate(self, data):
        """Check category and set price, return_date fields."""
        category = data.get('category')
        price = data.get('price')
        return_date = data.get('return_date')

        #Frontend engellemeli çünkü return_date'i de girebilir adam o field gözükmemeli
        if category == 'secondhand' and price is None:
            raise serializers.ValidationError("Price is required for secondhand products.")

        if category == 'borrow' and return_date is None:
            raise serializers.ValidationError("Return date is required for borrow products.")

        return data
    

class ProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'return_date', 'product_photo', 'category', 'description', 'upload_date', 'user']
        read_only_fields = ['id', 'user', 'category', 'upload_date']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'return_date', 'product_photo', 'category', 'description', 'upload_date', 'user']