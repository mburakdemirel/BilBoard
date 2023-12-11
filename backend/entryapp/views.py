import enum
from django.contrib.postgres.search import TrigramSimilarity
from mainapp.models import LostAndFoundEntry, ComplaintEntry, CustomUser
from entryapp import serializers
from rest_framework import viewsets 
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from bilboard_backend.redis_config import get_redis_instance
from bilboard_backend.redis_config import cache
redis_instance = get_redis_instance()

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
        """Create a new product."""
        serializer.save(user=self.request.user)
        cache.delete_pattern("laf_entries_*")
        
    #Update yok, complaint ve laf update edilemez

    def perform_destroy(self, instance):
        super().perform_destroy(instance)
        cache.delete_pattern("laf_entries_*")


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
    
    def list(self, request, *args, **kwargs):
        search_query = request.query_params.get('search', None)
        page_number = request.query_params.get('page', 1)  # Default to page 1 if no page is specified
        cache_key = f"laf_entries_{search_query or 'all'}_page_{page_number}"
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
        cache.delete_pattern("complaint_entries_*")

    def perform_destroy(self, instance):
        super().perform_destroy(instance)
        cache.delete_pattern("complaint_entries_*")


class ComplaintEntryViewSet(viewsets.ReadOnlyModelViewSet):
    """View for managing all complaint entries in the system."""
    serializer_class = serializers.DefaultComplaintEntrySerializer
    queryset = ComplaintEntry.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        search_query = request.query_params.get('search', None)
        page_number = request.query_params.get('page', 1)  # Default to page 1 if no page is specified
        cache_key = f"complaint_entries_{search_query or 'all'}_page_{page_number}"
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
        """Retrieve all complaint entries or filter based on title using trigram similarity for fuzzy search."""
        queryset = ComplaintEntry.objects.all().order_by('-vote', '-id')
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.annotate(
                similarity=TrigramSimilarity('topic', search_query)
            ).filter(similarity__gt=0.15).order_by('-similarity', '-vote')

        return queryset

#states : state1 only downvote, state2 no vote, state3 only upvote

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vote_up_complaint(request):
    complaint_id = request.data.get('complaint_id')
    if not complaint_id:
        return Response({'error': 'Complaint ID should be sent'}, status=400)

    try:
        complaint = ComplaintEntry.objects.get(id=complaint_id)
        user = request.user

        # down vote a basiliyken upvote a bastim
        if user in complaint.downvoted_by.all():
            complaint.downvoted_by.remove(user)
            complaint.upvoted_by.add(user)
            complaint.vote = complaint.vote + 2
            complaint.save()
            return Response({'success': 'Successfully upvoted and withdrawn from downvote','state' : 3}, status=200)

        # daha onceden up oyladiysam ama butona yine bastiysam geri cek.
        elif user in complaint.upvoted_by.all():
            complaint.upvoted_by.remove(user)
            complaint.vote = complaint.vote - 1
            complaint.save()
            return Response({'success': 'Successfully withdrawn from upvote','state' : 2}, status=200)


        # hic oy vermediysem buraya gir. 
        elif user not in complaint.upvoted_by.all():
            complaint.upvoted_by.add(user)
            complaint.vote = complaint.vote + 1
            complaint.save()


        return Response({'success': 'Successfully upvoted','state' : 3}, status=200)
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
        user = request.user

        #oyumu upvotedan cekip downvote a attim
        if user in complaint.upvoted_by.all():
            complaint.upvoted_by.remove(user)
            complaint.downvoted_by.add(user)
            complaint.vote = complaint.vote - 2
            complaint.save()
            return Response({'success': 'Successfully downvoted and withdrawn from upvote','state' : 1}, status=200)

        #daha onceden downvote oyu attigim halde tekrar downvote dedim oyumu geri cek = iki kere tiklamak
        elif user in complaint.downvoted_by.all():
            complaint.downvoted_by.remove(user)
            complaint.vote = complaint.vote + 1
            complaint.save()
            return Response({'success': 'Successfully withdrawn from downvote','state' : 2}, status=200)

        # ilk kez down vote verdim
        elif user not in complaint.downvoted_by.all():
            complaint.downvoted_by.add(user)
            complaint.vote = complaint.vote - 1
            complaint.save()

        return Response({'success': 'Successfully downvoted','state' : 1}, status=200)
    except ComplaintEntry.DoesNotExist:
        return Response({'error': 'Complaint with specified id not found'}, status=404)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_voted_complaints(request):
    user = CustomUser.objects.get(email=request.user)
    count = user.upvoted_complaints.count() + user.downvoted_complaints.count()
    upvoted_complaints = serializers.ComplaintEntrySerializer(user.upvoted_complaints, many=True)
    downvoted_complaints = serializers.ComplaintEntrySerializer(user.downvoted_complaints, many=True)

    if count == 0:
        return Response({"message": "There are no voted complaint of the user", })
    else:
        return Response({"upvoted_complaints": upvoted_complaints.data, "downvoted_complaints": downvoted_complaints.data}) 
