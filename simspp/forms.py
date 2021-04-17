from django.core.exceptions import ValidationError
from django.forms import ModelForm
from .models import Layer, Structure, Component, LSrelation

class Layer_form(ModelForm):
    class Meta:
        model = Layer
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        name = cleaned_data.get("type_name")
        created = cleaned_data.get("created")
        if created and name:
            if len(Layer.objects.get(name=name, created=created))!=1:
                raise ValidationError(f"Layer {name}, that is created in {created} is not exist")
            else:
                return

        functions = cleaned_data.get("functions")
        scopes = cleaned_data.get("scopes")
        if functions and scopes:

        




class Structure_form(ModelForm):
    class Meta:
        model = Structure
        fields = '__all__'


class LSrelation_form(ModelForm):
    class Meta:
        model = LSrelation
        fields = '__all__'


class Component_form(ModelForm):
    class Meta:
        model = Component
        fields = '__all__'
