from django.db import models
from django.db.models.fields import DateField


class Layer(models.Model):
    name = models.CharField(max_length=200, blank=True)
    type_name = models.CharField(max_length=200)
    mixture = models.ManyToManyField("self", symmetrical=False, blank=True, null=True, through="Component")
    functions = models.CharField(max_length=200, blank=True, null=True)
    scopes = models.CharField(max_length=200, blank=True, null=True)
    refractive = models.CharField(max_length=200,blank=True, null=True)
    wavelength = models.CharField(max_length=200,blank=True, null=True)
    created = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Structure(models.Model):
    name = models.CharField(max_length=200, blank=True, null=True)
    layer = models.ManyToManyField(Layer, through="LSrelation")
    created = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class LSrelation(models.Model):
    layer = models.ForeignKey(Layer, on_delete=models.CASCADE)
    structure = models.ForeignKey(Structure, on_delete=models.CASCADE)
    relation_id = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.layer.type}-layer with index {self.layer_id}"


class Component(models.Model):
    layer = models.ForeignKey(Layer, on_delete=models.CASCADE)
    ratio = models.FloatField()

    def __str__(self):
        return f"|{self.name}: {self.ratio}|"