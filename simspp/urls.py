"""simspp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls, name='admin_site'),
    path('initial/', initial_index, name='index'),
    path('', index, name='features'),
    path('features/layer/', load_layer, name='layer'),
    path('features/base/', load_base, name='base_template'),
    path('features/ema/', load_ema, name='ema_template'),
    path('ajax/handle_layer', handle_layer, name="handle_layer_url")

]
