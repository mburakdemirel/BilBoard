"""Views for the product APIs."""
from abc import ABC, abstractmethod
import os
from django.contrib.postgres.search import TrigramSimilarity
from django.http import HttpResponse
from mainapp.models import Product, ProductImage
from .permissions import IsOwnerOrReadOnly
from productapp import serializers
from rest_framework import viewsets 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from bilboard_backend.redis_config import get_redis_instance
from bilboard_backend.redis_config import cache
redis_instance = get_redis_instance()

class ProductViewSet(viewsets.ModelViewSet, ABC):
    serializer_class = serializers.ProductSerializer
    queryset = Product.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    @abstractmethod
    def get_serializer_class(self):
        pass
    
    @abstractmethod
    def get_queryset(self):
        pass
    
    def perform_create(self, serializer):
        return super().perform_create(serializer)


class UserProductViewSet(ProductViewSet):
    """View for manage Product APIs."""

    # Retrive ise => user objesi dönsün, diğer her şeyde id dönsün
    def get_serializer_class(self):
        if self.action in ['create']:
            return serializers.ProductCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return serializers.ProductUpdateSerializer
        elif self.action in ['retrieve']:
            return serializers.ProductUserSerializer
        return serializers.ProductSerializer

    def get_queryset(self):
        """Retrieve Products for authenticated user."""
        return self.queryset.filter(user=self.request.user).order_by('-id')

    def perform_create(self, serializer):
        """Create a new product."""
        serializer.save(user=self.request.user)
        product = serializer.instance

        if product.category == 'secondhand':
            cache.delete_pattern("secondhand_products_*")
        elif product.category == 'borrow':
            cache.delete_pattern("borrow_products_*")
        elif product.category == 'donation':
            cache.delete_pattern("donation_products_*")

    def perform_update(self, serializer):
        super().perform_update(serializer)

        product_category = serializer.instance.category

        if product_category == 'secondhand':
            cache.delete_pattern("secondhand_products_*")
        elif product_category == 'borrow':
            cache.delete_pattern("borrow_products_*")
        elif product_category == 'donation':
            cache.delete_pattern("donation_products_*")
        
    def perform_destroy(self, instance):
        product_category = instance.category
        super().perform_destroy(instance)

        # Kategoriye göre cache'i geçersiz kıl
        if product_category == 'secondhand':
            cache.delete_pattern("secondhand_products_*")
        elif product_category == 'borrow':
            cache.delete_pattern("borrow_products_*")
        elif product_category == 'donation':
            cache.delete_pattern("donation_products_*")


#MİN MAX CACHE, VE ENTRY'LERE DE CACHE EKLENECEK
class SecondhandProductViewSet(ProductViewSet):
    """View for managing all secondhand products in the system."""

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return serializers.ProductUserSerializer
        return serializers.ProductSerializer

    def list(self, request, *args, **kwargs):
        search_query = request.query_params.get('search', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        page_number = request.query_params.get('page', 1)  # Default to page 1 if no page is specified
        # 3 params birden varsa
        if search_query and min_price and max_price:
            cache_key = f"secondhand_products_{search_query}_{min_price}_{max_price}_page_{page_number}"
        # Sadece search ve min_price varsa
        elif search_query and min_price:
            cache_key = f"secondhand_products_{search_query}_{min_price}_page_{page_number}"
        # Sadece search ve max_price varsa
        elif search_query and max_price:
            cache_key = f"secondhand_products_{search_query}_{max_price}_page_{page_number}"
        elif search_query:
            cache_key = f"secondhand_products_{search_query}_page_{page_number}"
        elif min_price and max_price:
            cache_key = f"secondhand_products_{min_price}_{max_price}_page_{page_number}"
        elif min_price:
            cache_key = f"secondhand_products_{min_price}_page_{page_number}"
        elif max_price:
            cache_key = f"secondhand_products_{max_price}_page_{page_number}"
        else:
            cache_key = f"secondhand_products_all_page_{page_number}"

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            # Return the cached data for the specific page
            return Response(cached_data)

        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            cached_data = serializer.data
            cache.set(cache_key, cached_data, timeout=60*60)  # Cache for 1 hour
            return self.get_paginated_response(cached_data)

        serializer = self.get_serializer(queryset, many=True)
        cached_data = serializer.data
        cache.set(cache_key, cached_data, timeout=60*60) 
        return Response(cached_data)
    
    def get_queryset(self):
        """
        Retrieve all secondhand products or filter based on title and price.
        """
        search_query = self.request.query_params.get('search', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

        queryset = Product.objects.filter(category='secondhand')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Arama sorgusu varsa, trigram benzerliğine göre filtrele
        if search_query:
            queryset = queryset.annotate(
                similarity=TrigramSimilarity('title', search_query)
            ).filter(similarity__gt=0.15).order_by('-similarity', '-id')

        return queryset
    

class BorrowProductViewSet(ProductViewSet):
    """View for managing all borrow products in the system."""

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return serializers.ProductUserSerializer
        return serializers.ProductSerializer
    
    def list(self, request, *args, **kwargs):
        search_query = request.query_params.get('search', None)
        page_number = request.query_params.get('page', 1)  # Default to page 1 if no page is specified
        cache_key = f"borrow_products_{search_query or 'all'}_page_{page_number}"
        cached_data = cache.get(cache_key)

        if cached_data is not None:
            # Return the cached data for the specific page
            return Response(cached_data)

        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            cached_data = serializer.data
            cache.set(cache_key, cached_data, timeout=60*60)  # Cache for 1 hour
            return self.get_paginated_response(cached_data)

        serializer = self.get_serializer(queryset, many=True)
        cached_data = serializer.data
        cache.set(cache_key, cached_data, timeout=60*60) 
        return Response(cached_data)

    def get_queryset(self):
        """Retrieve all borrowable products or filter based on title using trigram similarity for fuzzy search."""

        search_query = self.request.query_params.get('search', None)
        queryset = Product.objects.filter(category='borrow')  # Adjusted category

        if search_query:
            queryset = queryset.annotate(
                similarity=TrigramSimilarity('title', search_query)
            ).filter(similarity__gt=0.15).order_by('-similarity', '-id')

        return queryset
    

class DonationProductViewSet(ProductViewSet):
    """View for managing all donation products in the system."""

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return serializers.ProductUserSerializer
        return serializers.ProductSerializer
    
    def list(self, request, *args, **kwargs):
        search_query = request.query_params.get('search', None)
        page_number = request.query_params.get('page', 1)  # Default to page 1 if no page is specified
        cache_key = f"donation_products_{search_query or 'all'}_page_{page_number}"
        cached_data = cache.get(cache_key)

        if cached_data is not None:
            # Return the cached data for the specific page
            return Response(cached_data)

        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            cached_data = serializer.data
            cache.set(cache_key, cached_data, timeout=60*60)  # Cache for 1 hour
            return self.get_paginated_response(cached_data)

        serializer = self.get_serializer(queryset, many=True)
        cached_data = serializer.data
        cache.set(cache_key, cached_data, timeout=60*60) 
        return Response(cached_data)

    def get_queryset(self):
        """Retrieve all donations or filter based on title using trigram similarity for fuzzy search."""
        queryset = Product.objects.filter(category='donation')

        search_query = self.request.query_params.get('search', None)

        if search_query:
            queryset = queryset.annotate(
                similarity=TrigramSimilarity('title', search_query)
            ).filter(similarity__gt=0.15).order_by('-similarity', '-id')

        return queryset
    


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_products_by_user_id(request):
    user_id = request.data.get('user_id')
    try:
        products = Product.objects.filter(user_id=user_id)
        serializer = serializers.ProductUserSerializer(products, many=True)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'No products found for the given user ID'}, status=404)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clicked_favorites(request):
    product_id = request.data.get('product_id')
    if not product_id:
        return Response({'error': 'Product ID should be sent'}, status=400)

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product with specified id not found'}, status=404)
    
    user = request.user

    # Check if the product is already favorited
    if product in user.favorited_products.all():
        user.favorited_products.remove(product)
        return Response({'status': 'Product removed from favorites', 'state':0}, status=200)

    user.favorited_products.add(product)
    return Response({'status': 'Product added to favorites','state':1}, status=200)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product_photo(request):
    user = request.user
    product_id = request.data.get('product_id')
    image_id = request.data.get('image_id')
    try:
        product = Product.objects.get(id=product_id, user=user)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    try:
        image = product.images.get(id=image_id)
    except ProductImage.DoesNotExist:
        return Response({"error": "Image not found"}, status=404)

    if image.image:
        if os.path.isfile(image.image.path):
            os.remove(image.image.path)

    image.delete()

    if product.category == 'secondhand':
            cache.delete_pattern("secondhand_products_*")
    elif product.category == 'borrow':
        cache.delete_pattern("borrow_products_*")
    elif product.category == 'donation':
        cache.delete_pattern("donation_products_*")

    return Response({"message": "Image deleted"}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def filter_products_by_price(request):
    min_price = request.query_params.get('min_price', None)
    max_price = request.query_params.get('max_price', None)

    # İkinci el ürünler için filtreleme yapın
    queryset = Product.objects.filter(category='secondhand')

    # Fiyat filtrelerini uygula
    if min_price:
        queryset = queryset.filter(price__gte=min_price)
    if max_price:
        queryset = queryset.filter(price__lte=max_price)

    serializer = serializers.ProductSerializer(queryset, many=True)
    return Response(serializer.data)