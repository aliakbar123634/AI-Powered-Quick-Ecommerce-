from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from .models import *
from .serializers import *
from rest_framework import status
from rest_framework.views import APIView

from rest_framework.permissions import AllowAny

from ai_engine.services.knowledge.rag_service import answer_from_knowledge

class SearchHistoryViewSet(viewsets.ModelViewSet):

    serializer_class = SearchHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SearchHistory.objects.filter(
            user=self.request.user
        ).order_by("-searched_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["delete"])
    def clear(self, request):

        self.get_queryset().delete()

        return Response({
            "message": "History cleared"
        })

    @action(detail=False, methods=["post"])
    def search(self, request):

        query = request.data.get("query")

        SearchHistory.objects.create(
            user=request.user,
            search_query=query
        )

        return Response({
            "query": query,
            "message": "Search saved"
        })


class UserPreferenceViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = UserPreferenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserPreference.objects.filter(
            user=self.request.user
        ).order_by("-score")

    @action(detail=False, methods=["post"])
    def recalculate(self, request):

        # Future AI Logic

        return Response({
            "message": "Preferences recalculated."
        })


class RecommendationViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = RecommendationLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RecommendationLog.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

    @action(detail=False, methods=["delete"])
    def clear(self, request):

        self.get_queryset().delete()

        return Response({
            "message": "Recommendation history cleared."
        })

    @action(detail=False, methods=["post"])
    def recommend(self, request):

        return Response({
            "products": [],
            "message": "Future FastAPI recommendation."
        })




class ChatViewSet(ViewSet):

    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"])

    def chat(self, request):

        message = request.data.get("message")

        return Response({

            "user_message": message,

            "reply": "Future FastAPI AI Response"

        })    

class AnalyticsViewSet(ViewSet):

    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"])

    def insights(self, request):

        return Response({

            "total_searches": 0,

            "recommended_products": 0,

            "favorite_category": None

        })

    @action(detail=False, methods=["get"])

    def admin_analytics(self, request):

        return Response({

            "users": 0,

            "searches": 0,

            "recommendations": 0

        }) 
    

class MemoryViewSet(viewsets.ModelViewSet):

    serializer_class = MemorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Memory.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"])
    def save(self, request):

        key = request.data.get("key")
        value = request.data.get("value")

        if not key or not value:
            return Response(
                {"detail": "key and value are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        memory, created = Memory.objects.update_or_create(
            user=request.user,
            key=key,
            defaults={
                "value": value
            }
        )

        return Response({
            "message": "Memory saved successfully.",
            "key": memory.key,
            "value": memory.value
        })

    @action(detail=False, methods=["get"])
    def recall(self, request):

        key = request.query_params.get("key")

        if not key:
            return Response(
                {"detail": "key is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            memory = Memory.objects.get(
                user=request.user,
                key=key
            )

            return Response({
                "key": memory.key,
                "value": memory.value
            })

        except Memory.DoesNotExist:
            return Response(
                {"detail": "Memory not found."},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=["delete"])
    def clear(self, request):

        self.get_queryset().delete()

        return Response({
            "message": "All memories deleted."
        })


class KnowledgeChatView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        question = request.data.get("question")

        if not question:
            return Response(
                {"error": "Question is required."},
                status=400
            )

        answer = answer_from_knowledge(question)

        return Response({
            "question": question,
            "answer": answer
        })