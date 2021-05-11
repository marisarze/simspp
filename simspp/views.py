from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
import json

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


def handle_layer(request):
    print('request method', request.method)
    # some_dict = json.loads(list(request.GET.dict().keys())[0])
    # print(some_dict)
    # #print("some is: ", some_dict["refractive[0][]"])
    # if request.is_ajax:
    #     return JsonResponse(request.GET.dict(), status=200)
    #     return JsonResponse({"message": "Exactly like you"}, status=200)
    
    # some error occured
    return JsonResponse({"error": ""}, status=400)