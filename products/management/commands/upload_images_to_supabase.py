import os
import requests

from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile

from products.models import Category, Product, ProductImage


DUMMY_JSON_URL = "https://dummyjson.com/products?limit=100"


class Command(BaseCommand):

    help = "Download product images and save them using configured storage"

    def handle(self, *args, **options):

        self.stdout.write(
            self.style.WARNING(
                "Fetching original product image URLs..."
            )
        )

        try:
            response = requests.get(
                DUMMY_JSON_URL,
                timeout=30
            )
            response.raise_for_status()
            data = response.json()

        except Exception as e:

            self.stdout.write(
                self.style.ERROR(
                    f"Failed to fetch DummyJSON: {e}"
                )
            )
            return

        products_data = data.get("products", [])

        products = list(
            Product.objects.all().order_by("id")
        )

        self.stdout.write(
            f"Database products: {len(products)}"
        )

        uploaded = 0
        failed = 0

        # ---------------------------------------------
        # PRODUCTS
        # ---------------------------------------------

        for index, product in enumerate(
            products
        ):

            if index >= len(products_data):
                break

            source = products_data[index]

            title = source.get(
                "title",
                f"product-{product.id}"
            )

            self.stdout.write(
                f"[{index + 1}/{len(products)}] {title}"
            )

            # -----------------------------------------
            # MAIN IMAGE
            # -----------------------------------------

            thumbnail = source.get("thumbnail")

            if thumbnail:

                try:

                    image_response = requests.get(
                        thumbnail,
                        timeout=30
                    )

                    image_response.raise_for_status()

                    filename = (
                        f"product-{product.id}.jpg"
                    )

                    product.image.save(
                        filename,
                        ContentFile(
                            image_response.content
                        ),
                        save=True
                    )

                    uploaded += 1

                except Exception as e:

                    failed += 1

                    self.stdout.write(
                        self.style.WARNING(
                            f"Main image failed: {e}"
                        )
                    )

            # -----------------------------------------
            # ADDITIONAL IMAGES
            # -----------------------------------------

            source_images = source.get(
                "images",
                []
            )

            # Remove existing additional images
            ProductImage.objects.filter(
                product=product
            ).delete()

            for image_index, image_url in enumerate(
                source_images[:3],
                start=1
            ):

                try:

                    image_response = requests.get(
                        image_url,
                        timeout=30
                    )

                    image_response.raise_for_status()

                    product_image = ProductImage.objects.create(
                        product=product,
                        is_primary=(image_index == 1)
                    )

                    filename = (
                        f"product-{product.id}-"
                        f"{image_index}.jpg"
                    )

                    product_image.image.save(
                        filename,
                        ContentFile(
                            image_response.content
                        ),
                        save=True
                    )

                    uploaded += 1

                except Exception as e:

                    failed += 1

                    self.stdout.write(
                        self.style.WARNING(
                            f"Additional image failed: {e}"
                        )
                    )

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                "===================================="
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                "IMAGE UPLOAD COMPLETED"
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                "===================================="
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Uploaded: {uploaded}"
            )
        )

        self.stdout.write(
            self.style.WARNING(
                f"Failed: {failed}"
            )
        )