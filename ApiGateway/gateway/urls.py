from django.urls import path
from gateway.views.auth import SignUpView, SignInView, UserListView, UserDetailView
from gateway.views.post import PostsDetailView, PostListCreateView

urlpatterns = [
    # Auth-Service
    path('auth/signup/', SignUpView.as_view()),
    path('auth/signin/', SignInView.as_view()),
    path('auth/users/', UserListView.as_view()),
    path('auth/users/<str:user_id>/', UserDetailView.as_view()),

    # Social-Service - Posts
    path('posts/', PostListCreateView.as_view(), name='list-create-posts'),
    path('posts/<str:post_id>/', PostsDetailView.as_view(), name='post-detail'), 
]
