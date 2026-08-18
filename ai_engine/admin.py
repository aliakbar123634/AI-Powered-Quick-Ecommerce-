from django.contrib import admin
from . models import *
# Register your models here.
admin.site.register(SearchHistory)
admin.site.register(UserPreference)
admin.site.register(RecommendationLog)
admin.site.register(Memory)
admin.site.register(KnowledgeChunk)