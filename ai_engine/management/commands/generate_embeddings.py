from django.core.management.base import BaseCommand

from products.models import Product
from ai_engine.services.embedding_service import (
    prepare_product_text,
    generate_embedding,
)


class Command(BaseCommand):

    help = "Generate embeddings for all products"

    def handle(self, *args, **kwargs):

        products = Product.objects.all()

        total = products.count()

        self.stdout.write(
            f"Found {total} products."
        )

        for product in products:

            text = prepare_product_text(product)

            embedding = generate_embedding(text)

            product.embedding = embedding

            product.save(
                update_fields=["embedding"]
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f"Embedding generated: {product.name}"
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                "All product embeddings generated successfully."
            )
        )