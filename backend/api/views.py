from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import generics

from api.models import Task


from .serializers import TaskSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(id=response.data["id"])

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response.set_cookie(
                key="access_token",
                value=access_token,
                path="/",
                expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                secure=False,
                httponly=True,
                samesite="Lax",
                )
        response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                path="/",
                expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                secure=False,
                httponly=True,
                samesite="Lax",
                )
        return response


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        access_token = response.data["access"]
        refresh_token = response.data["refresh"]

        response.set_cookie(
                key="access_token",
                value=access_token,
                path="/",
                expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                secure=False,
                httponly=True,
                samesite="Lax",
                )
        response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                path="/",
                expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                secure=False,
                httponly=True,
                samesite="Lax",
                )
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, _):
        try:
            res = Response()
            res.delete_cookie('access_token')
            res.delete_cookie('refresh_token')
            res.data = {'success':True}

            return res
        except Exception as e:
            print(e)
            return Response({'success':False})



class IsAuthenticatedView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, _):
        return Response({'is_authenticated': True})

class CreateTaskView(generics.CreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UpdateTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data
        count = Task.objects.filter(user=user, id=data['id']).update(**data)

        return Response({"updated": count})

class DeleteTaskView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        try: 
            user = request.user
            id = request.data.get("id")
            Task.objects.filter(user=user, id=id).delete()

            return Response({"success": True})
        except:
            return Response({"success": False})

class GetTasksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = Task.objects.filter(user=request.user)
        serializer = TaskSerializer(data, many=True)

        return Response(serializer.data)

