from django.core.exceptions import ValidationError
from django.forms import ModelForm
from .models import Layer, Structure, Component, LSrelation
from sympy import sympify
import numpy as np

class Layer_form(ModelForm):
    class Meta:
        model = Layer
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        name = cleaned_data.get("name") 
        type_name = cleaned_data.get("type_name")
        created = cleaned_data.get("created")
        if created and name:
            if len(Layer.objects.get(name=name, created=created))!=1:
                raise ValidationError(f"Layer {name}, that is created in {created} is not exist")
            else:
                return
        
        if type_name=="base":
            functions = cleaned_data.get("functions")
            scopes = cleaned_data.get("scopes")
            refractive = cleaned_data.get("refractive")
            wavelength = cleaned_data.get("wavelength")
            for i in range(2):
                if functions[i]:
                    try:
                        func = sympify(functions[i])
                        func = func.subs(**scopes[i])
                        for wl in np.linspace(0.5, 1.5, 50):
                            float(func.subs({"x": wl}), float)    
                    except:
                        msg = "Wrong combination of refractive part functions and its scopes"
                        self.add_error('functions', msg)
                        self.add_error('scopes', msg)
                elif refractive[i] and wavelength[i]:
                    if len(refractive[i])!=len(wavelength[i]):
                        msg = "Wrong combination of refractive table data and wavelength"
                        self.add_error('refractive', msg)
                        self.add_error('wavelength', msg)
                else:
                    raise ValidationError(f"Layer {name} does not have required data ")
        else:
            pass

    
    # def save(self):
        

            


        




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
