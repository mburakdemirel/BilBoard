from rest_framework import serializers
from mainapp.models import Product, CustomUser, ProductImage

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'name', 'surname', 'profile_photo', 'rate_ratio', 'description', 'phone_number']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['product_photos']


class ProductCreateSerializer(serializers.ModelSerializer):
    product_photos = ProductImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'return_date', 'product_photos', 'category', 'description', 'upload_date', 'product_type', 'user']
        read_only_fields = ['id', 'user', 'upload_date']

    def validate(self, data):
        """Check category and set price, return_date fields."""
        category = data.get('category')
        price = data.get('price')
        return_date = data.get('return_date')

        #Frontend engellemeli çünkü return_date'i de girebilir adam o field gözükmemeli
        if category == 'secondhand':
            if price is None:
                raise serializers.ValidationError("Price is required for secondhand products.")
            if 'return_date' in data:
                raise serializers.ValidationError("Return date should not be included for secondhand products.")
            
        if category == 'borrow':
            if return_date is None:
                raise serializers.ValidationError("Return date is required for borrow products.")
            if 'price' in data:
                raise serializers.ValidationError("Price should not be included for borrow products.")
            
        return data
    

class ProductUserSerializer(serializers.ModelSerializer):
    product_photos = ProductImageSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'return_date', 'product_photos', 'category', 'description', 'upload_date', 'product_type', 'user']
        read_only_fields = ['id', 'user', 'upload_date']


class ProductUpdateSerializer(serializers.ModelSerializer):
    product_photos = ProductImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'return_date', 'product_photos', 'category', 'description', 'upload_date', 'product_type', 'user']
        read_only_fields = ['id', 'user', 'category', 'upload_date']

    def validate(self, data):
        """Check category and set price, return_date fields."""
        if self.instance:
            category = self.instance.category
        #Frontend engellemeli çünkü return_date'i de girebilir adam o field gözükmemeli
        if category == 'secondhand':
            if 'return_date' in data:
                raise serializers.ValidationError("Return date should not be included for secondhand products.")
        if category == 'borrow':
            if 'price' in data:
                raise serializers.ValidationError("Price should not be included for borrow products.")
            
        return data
    
    
class ProductSerializer(serializers.ModelSerializer):
    product_photos = ProductImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'return_date', 'product_photos', 'category']