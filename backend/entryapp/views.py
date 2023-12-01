from django.contrib.postgres.search import TrigramSimilarity
from mainapp.models import LostAndFoundEntry, ComplaintEntry 
from entryapp import serializers
from rest_framework import viewsets 
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

#Şu an lost ve found hepsini getiriyor user'ın
class UserLostAndFoundEntryViewSet(viewsets.ModelViewSet):
    """View for manage Lost and Found Entry APIs."""

    queryset = LostAndFoundEntry.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create']:
            return serializers.CreateLostAndFoundEntrySerializer
        elif self.action in ['retrieve']:
            return serializers.UserLostAndFoundEntrySerializer
        return serializers.DefaultLostAndFoundEntrySerializer

    def get_queryset(self):
        """Retrieve Lost and Found Entries for authenticated user."""
        return self.queryset.filter(user=self.request.user).order_by('-id')

    def perform_create(self, serializer):
        """Create a new Lost and Found Entry."""
        serializer.save(user=self.request.user)


class LostEntryViewSet(viewsets.ReadOnlyModelViewSet):
    """View for managing all L&F entries in the system."""
    serializer_class = serializers.DefaultLostAndFoundEntrySerializer
    queryset = LostAndFoundEntry.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return serializers.UserLostAndFoundEntrySerializer
        return serializers.DefaultLostAndFoundEntrySerializer

    def get_queryset(self):
        """Retrieve all LaF entries or filter based on title using trigram similarity for fuzzy search."""
        queryset = LostAndFoundEntry.objects.all()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.annotate(
                similarity=TrigramSimilarity('topic', search_query)
            ).filter(similarity__gt=0.15).order_by('-similarity', '-id')

        return queryset