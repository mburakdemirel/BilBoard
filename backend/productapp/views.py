"""Views for the product APIs."""

from django.contrib.postgres.search import TrigramSimilarity
from mainapp.models import Product 
from .permissions import IsOwnerOrReadOnly
from productapp import serializers
from rest_framework import viewsets 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response


class UserProductViewSet(viewsets.ModelViewSet):
    """View for manage Product APIs."""

    # Detailed veya non detailed şeyini düşün. Hepsi tek seferde dönebilir.
    queryset = Product.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

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


class SecondhandProductViewSet(viewsets.ReadOnlyModelViewSet):
    """View for managing all secondhand products in the system."""
    serializer_class = serializers.ProductSerializer
    queryset = Product.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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
    

class BorrowProductViewSet(viewsets.ReadOnlyModelViewSet):
    """View for managing all borrow products in the system."""
    serializer_class = serializers.ProductSerializer
    queryset = Product.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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
    

class DonationProductViewSet(viewsets.ReadOnlyModelViewSet):
    """View for managing all donation products in the system."""
    serializer_class = serializers.ProductSerializer
    queryset = Product.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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
        serializer = serializers.ProductSerializer(products, many=True)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'No products found for the given user ID'}, status=404)