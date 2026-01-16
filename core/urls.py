from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TarefaViewSet, registrar_usuario

router = DefaultRouter()
router.register(r'tarefas', TarefaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', registrar_usuario, name='registrar_usuario'),
]