from django.urls import path
from gateway.views.auth import SignUpView, SignInView, UserListView, UserDetailView
from gateway.views.post import PostsDetailView, PostListCreateView
from gateway.views.comment import CommentDetailView, CommentCreateView, CommentsByPostView

urlpatterns = [
    # Auth-Service
    path('auth/signup/', SignUpView.as_view()),
    path('auth/signin/', SignInView.as_view()),
    path('auth/users/', UserListView.as_view()),
    path('auth/users/<str:user_id>/', UserDetailView.as_view()),

    # Social-Service - Posts
    path('posts/', PostListCreateView.as_view(), name='list-create-posts'),
    path('posts/<str:post_id>/', PostsDetailView.as_view(), name='post-detail'), 

    path('comments/', CommentCreateView.as_view(), name='create-comments'),
    path('comments/<str:comment_id>/', CommentDetailView.as_view(), name='comment-detail'),
    path('comments/by-post/<str:post_id>/', CommentsByPostView.as_view(), name='comments-by-post')
]
