import enum
from django.contrib.postgres.search import TrigramSimilarity
from mainapp.models import LostAndFoundEntry, ComplaintEntry 
from entryapp import serializers
from rest_framework import viewsets 
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes


class EntryType(enum.Enum):
    LOSTANDFOUND = 1
    COMPLAINT = 2

class ActionType(enum.Enum):
    CREATE = 1
    RETRIEVE = 2
    DEFAULT = 3

class SerializerFactory:
    def get_serializer(entry_type, action):
        if entry_type == EntryType.LOSTANDFOUND:
            if action == ActionType.CREATE:
                return serializers.CreateLostAndFoundEntrySerializer
            elif action == ActionType.RETRIEVE:
                return serializers.UserLostAndFoundEntrySerializer
            else: #default
                return serializers.DefaultLostAndFoundEntrySerializer
        elif entry_type == EntryType.COMPLAINT:
            # Assuming you have similar serializers for complaints
            if action == ActionType.CREATE:
                return serializers.CreateComplaintEntrySerializer
            else:
                return serializers.DefaultComplaintEntrySerializer
        else:
            raise ValueError("Invalid Entry Type")


#Şu an lost ve found hepsini getiriyor conflict
class UserLostAndFoundEntryViewSet(viewsets.ModelViewSet):
    """View for manage Lost and Found Entry APIs."""

    queryset = LostAndFoundEntry.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create']:
            return SerializerFactory.get_serializer(entry_type=EntryType.LOSTANDFOUND,action=ActionType.CREATE) 
        elif self.action in ['retrieve']:
            return SerializerFactory.get_serializer(entry_type=EntryType.LOSTANDFOUND,action=ActionType.RETRIEVE) 
        return SerializerFactory.get_serializer(entry_type=EntryType.LOSTANDFOUND,action=ActionType.DEFAULT) 

    def get_queryset(self):
        """Retrieve Lost and Found Entries for authenticated user."""
        return self.queryset.filter(user=self.request.user).order_by('-id')

    def perform_create(self, serializer):
        """Create a new Lost and Found Entry."""
        serializer.save(user=self.request.user)


class LostAndFoundEntryViewSet(viewsets.ReadOnlyModelViewSet):
    """View for managing all L&F entries in the system."""
    serializer_class = serializers.DefaultLostAndFoundEntrySerializer
    queryset = LostAndFoundEntry.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return SerializerFactory.get_serializer(entry_type=EntryType.LOSTANDFOUND,action=ActionType.RETRIEVE) 
        return SerializerFactory.get_serializer(entry_type=EntryType.LOSTANDFOUND,action=ActionType.DEFAULT) 

    def get_queryset(self):
        """Retrieve all LaF entries or filter based on title using trigram similarity for fuzzy search."""
        queryset = LostAndFoundEntry.objects.all()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.annotate(
                similarity=TrigramSimilarity('topic', search_query)
            ).filter(similarity__gt=0.15).order_by('-similarity', '-id')

        return queryset
    

class UserComplaintEntryViewSet(viewsets.ModelViewSet):
    """View for manage Lost and Found Entry APIs."""

    queryset = ComplaintEntry.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create']:
            return SerializerFactory.get_serializer(entry_type=EntryType.COMPLAINT,action=ActionType.CREATE) 
        return SerializerFactory.get_serializer(entry_type=EntryType.COMPLAINT,action=ActionType.DEFAULT) 

    def get_queryset(self):
        """Retrieve Lost and Found Entries for authenticated user."""
        return self.queryset.filter(user=self.request.user).order_by('-vote')

    def perform_create(self, serializer):
        """Create a new Lost and Found Entry."""
        serializer.save(user=self.request.user)


class ComplaintEntryViewSet(viewsets.ReadOnlyModelViewSet):
    """View for managing all L&F entries in the system."""
    serializer_class = serializers.DefaultComplaintEntrySerializer
    queryset = ComplaintEntry.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve all LaF entries or filter based on title using trigram similarity for fuzzy search."""
        queryset = ComplaintEntry.objects.all().order_by('-vote', '-id')
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.annotate(
                similarity=TrigramSimilarity('topic', search_query)
            ).filter(similarity__gt=0.15).order_by('-similarity', '-vote')

        return queryset
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vote_up_complaint(request):
    complaint_id = request.data.get('complaint_id')
    if not complaint_id:
        return Response({'error': 'Complaint ID should be sent'}, status=400)

    try:
        complaint = ComplaintEntry.objects.get(id=complaint_id)
        complaint.vote = complaint.vote + 1
        complaint.save()
        return Response({'success': 'successfull'}, status=200)
    except ComplaintEntry.DoesNotExist:
        return Response({'error': 'Complaint with specified id not found'}, status=404)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vote_down_complaint(request):
    complaint_id = request.data.get('complaint_id')
    if not complaint_id:
        return Response({'error': 'Complaint ID should be sent'}, status=400)

    try:
        complaint = ComplaintEntry.objects.get(id=complaint_id)
        complaint.vote = complaint.vote - 1
        complaint.save()
        return Response({'success': 'successfull'}, status=200)
    except ComplaintEntry.DoesNotExist:
        return Response({'error': 'Complaint with specified id not found'}, status=404)
    
    
