"""Views for the product APIs."""
from abc import ABC, abstractmethod
from django.contrib.postgres.search import TrigramSimilarity
from mainapp.models import Product 
from .permissions import IsOwnerOrReadOnly
from productapp import serializers
from rest_framework import viewsets 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response

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


class SecondhandProductViewSet(ProductViewSet):
    """View for managing all secondhand products in the system."""

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return serializers.ProductUserSerializer
        return serializers.ProductSerializer

    def get_queryset(self):
        """Retrieve all secondhand products or filter based on title using trigram similarity for fuzzy search."""
        queryset = Product.objects.filter(category='secondhand')

        search_query = self.request.query_params.get('search', None)

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

    def get_queryset(self):
        """Retrieve all borrowable products or filter based on title using trigram similarity for fuzzy search."""
        queryset = Product.objects.filter(category='borrow')  # Adjusted category

        search_query = self.request.query_params.get('search', None)

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
def add_favorites(request):
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
        return Response({'status': 'Product is already in favorites'}, status=400)

    user.favorited_products.add(product)
    return Response({'status': 'Product added to favorites'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_favorites(request):
    product_id = request.data.get('product_id')
    if not product_id:
        return Response({'error': 'Product ID should be sent'}, status=400)

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product with specified id not found'}, status=404)
    
    user = request.user

    # Check if the product favorited the product
    if product in user.favorited_products.all():
        user.favorited_products.remove(product)
        return Response({'status': 'Product is removed from favorites'}, status=200)

    
    return Response({'status': 'User didnt favorited this product. '})