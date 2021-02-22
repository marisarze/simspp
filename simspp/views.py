from django.shortcuts import render


def index(request):
    return render(request, 'simspp/index.html')

def features_index(request):
    return render(request, 'simspp/features/index.html')

def layer(request):
    return render(request, 'simspp/features/layer.html')