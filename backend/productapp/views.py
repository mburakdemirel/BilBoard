"""Views for the product APIs."""

from rest_framework import viewsets 
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwnerOrReadOnly
from mainapp.models import Product 
from productapp import serializers

class UserProductViewSet(viewsets.ModelViewSet):
    """View for manage Product APIs."""

    # Detailed veya non detailed şeyini düşün. Hepsi tek seferde dönebilir.
    queryset = Product.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['create']:
            return serializers.ProductCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return serializers.ProductUpdateSerializer
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

    def get_queryset(self):
        """Retrieve all secondhand products."""
        return Product.objects.filter(category='secondhand').order_by('-id')
    

class BorrowProductViewSet(viewsets.ReadOnlyModelViewSet):
    """View for managing all borrow products in the system."""
    serializer_class = serializers.ProductSerializer
    queryset = Product.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve all borrow products."""
        return Product.objects.filter(category='borrow').order_by('-id')
    

class DonationProductViewSet(viewsets.ReadOnlyModelViewSet):
    """View for managing all donation products in the system."""
    serializer_class = serializers.ProductSerializer
    queryset = Product.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve all donation products."""
        return Product.objects.filter(category='donation').order_by('-id')