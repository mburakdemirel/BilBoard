from django.contrib.postgres.search import TrigramSimilarity
from mainapp.models import LostAndFoundEntry, ComplaintEntry 
from entryapp import serializers
from rest_framework import viewsets 
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class UserLostAndFoundEntryViewSet(viewsets.ModelViewSet):
    """View for manage Lost and Found Entry APIs."""

    queryset = LostAndFoundEntry.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return serializers.LostAndFoundEntrySerializer

    def get_queryset(self):
        """Retrieve Lost and Found Entries for authenticated user."""
        return self.queryset.filter(user=self.request.user).order_by('-id')

    def perform_create(self, serializer):
        """Create a new Lost and Found Entry."""
        serializer.save(user=self.request.user)
