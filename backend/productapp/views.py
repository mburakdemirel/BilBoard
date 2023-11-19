"""Views for the product APIs."""

from rest_framework import viewsets 
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

from mainapp.models import Product 
from productapp import serializers

class ProductViewSet (viewsets.ModelViewSet):
    """View for manage recipe APIs."""

    serializer_class = serializers.ProductSerializer
    queryset = Product.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset (self):
        """Retrieve recipes for authenticated user."""
        return self.queryset.filter(user=self.request.user).order_by('-id')
