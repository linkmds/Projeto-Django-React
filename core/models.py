from django.db import models
from django.contrib.auth.models import User

class Tarefa(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    titulo = models.CharField(max_length=100)
    descricao = models.TextField(blank=True, null=True)
    completada = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo