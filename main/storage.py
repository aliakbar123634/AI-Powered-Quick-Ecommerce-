from storages.backends.s3 import S3Storage
from django.conf import settings


class SupabaseStorage(S3Storage):

    def url(self, name, parameters=None, expire=None, http_method=None):
        if not name:
            return ""

        name = str(name).lstrip("/")

        return (
            f"{settings.SUPABASE_PUBLIC_STORAGE_URL}/"
            f"{name}"
        )