from rest_framework import serializers
from mainapp.models import Product, CustomUser, ProductImage

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'name', 'surname', 'profile_photo', 'rate_ratio', 'description', 'phone_number']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']


class ProductCreateSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    product_photo = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=True, use_url=False),
        write_only=True,
    )
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'return_date', 'product_photo', 'images', 'category', 'description', 'upload_date', 'product_type', 'user']
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
    
    def create(self, validated_data):
        product_photo = validated_data.pop("product_photo")
        product = Product.objects.create(**validated_data)

        for image in product_photo:
            ProductImage.objects.create(product=product, image=image)

        return product
    

class ProductUserSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'return_date', 'images', 'category', 'description', 'upload_date', 'product_type', 'user']
        read_only_fields = ['id', 'user', 'upload_date']


class ProductUpdateSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    product_photo = serializers.ListField(
        child=serializers.ImageField(), 
        required=False, 
        write_only=True
    )
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'return_date', 'images', 'product_photo', 'category', 'description', 'upload_date', 'product_type', 'user']
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
    
    def update(self, instance, validated_data):
        new_images_data = validated_data.pop('product_photo', [])
        for image_data in new_images_data:
            ProductImage.objects.create(product=instance, image=image_data)

        return super(ProductUpdateSerializer, self).update(instance, validated_data)
    
    
class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'return_date', 'images', 'category', 'user']