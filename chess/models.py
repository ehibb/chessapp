from django.db import models
from django.template.defaultfilters import slugify
# Create your models here.

class Room(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    connected_users = models.PositiveSmallIntegerField(default=0)
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Room, self).save(*args, **kwargs)

    class Meta:
        verbose_name_plural = 'Rooms'
    
    def __str__(self):
        return self.name
