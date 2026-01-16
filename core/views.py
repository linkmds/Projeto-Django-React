from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Tarefa
from .serializers import TarefaSerializer, UserSerializer

class TarefaViewSet(viewsets.ModelViewSet):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra para que o usuário logado veja apenas o que é dele
        return Tarefa.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Associa a tarefa ao usuário que está logado no momento
        serializer.save(usuario=self.request.user)

@api_view(['POST'])
@permission_classes([AllowAny])
def registrar_usuario(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Usuário criado!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)