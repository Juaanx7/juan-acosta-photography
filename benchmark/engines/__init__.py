"""Registro explícito: Etapa 3A solo permite el motor sintético mock."""
from engines.mock import MockEngine


def get_engine(name):
    if name != "mock":
        raise ValueError("Motor no disponible. Etapa 3A solo incluye mock.")
    return MockEngine()
