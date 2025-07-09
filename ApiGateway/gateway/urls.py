from django.urls import path
from gateway.views.auth import SignUpView, SignInView, UserListView, UserDetailView

urlpatterns = [
    path('auth/signup/', SignUpView.as_view()),
    path('auth/signin/', SignInView.as_view()),
    path('auth/users/', UserListView.as_view()),
    path('auth/users/<str:user_id>/', UserDetailView.as_view()),
]
