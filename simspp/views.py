from django.shortcuts import render


def initial_index(request):
    return render(request, 'simspp/index.html')

def index(request):
    return render(request, 'simspp/features/index.html')

def load_layer(request):
    return render(request, 'simspp/features/layer.html')

def load_base(request):
    return render(request, 'simspp/features/base.html')

def load_ema(request):
    return render(request, 'simspp/features/ema.html')