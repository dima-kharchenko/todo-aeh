from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, CustomTokenObtainPairView, GetTasksView, LogoutView, IsAuthenticatedView, CreateTaskView, UpdateTaskView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/user/logout/", LogoutView.as_view(), name="logout"),
    path("api/user/status/", IsAuthenticatedView.as_view(), name="is_authenticated"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api/task/create/", CreateTaskView.as_view(), name="create_task"),
    path("api/task/update/", UpdateTaskView.as_view(), name="update_task"),
    path("api/tasks/", GetTasksView.as_view(), name="get_tasks"),
    path("api-auth/", include("rest_framework.urls")),
]
