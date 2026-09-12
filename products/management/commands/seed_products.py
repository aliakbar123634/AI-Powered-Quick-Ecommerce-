import requests
from io import BytesIO
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils.text import slugify

from products.models import Category, Product, ProductImage, Review


DUMMY_JSON_URL = "https://dummyjson.com/products?limit=100"


class Command(BaseCommand):
    help = "Seed 100 realistic products with real product images"

    def handle(self, *args, **options):

        self.stdout.write(
            self.style.WARNING(
                "Fetching products from DummyJSON..."
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
                    f"Could not fetch products: {e}"
                )
            )
            return

        products_data = data.get("products", [])

        if not products_data:
            self.stdout.write(
                self.style.ERROR("No products received.")
            )
            return

        self.stdout.write(
            self.style.SUCCESS(
                f"Fetched {len(products_data)} products."
            )
        )

        # --------------------------------------------------
        # DELETE OLD SEEDED DATA
        # --------------------------------------------------

        self.stdout.write(
            self.style.WARNING(
                "Deleting old products..."
            )
        )

        Review.objects.all().delete()
        ProductImage.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()

        # --------------------------------------------------
        # CATEGORY CACHE
        # --------------------------------------------------

        categories = {}

        # --------------------------------------------------
        # CREATE PRODUCTS
        # --------------------------------------------------

        created_products = 0
        created_images = 0
        created_reviews = 0

        for index, item in enumerate(products_data, start=1):

            title = item.get(
                "title",
                f"Product {index}"
            )

            description = item.get(
                "description",
                "High quality product."
            )

            brand = item.get(
                "brand",
                "Premium Brand"
            )

            category_name = item.get(
                "category",
                "general"
            )

            category_display = category_name.replace(
                "-", " "
            ).title()

            # --------------------------------------------------
            # CATEGORY
            # --------------------------------------------------

            if category_name not in categories:

                category = Category.objects.create(
                    name=category_display,
                    description=(
                        f"Explore our {category_display} "
                        f"collection."
                    )
                )

                # Category image
                category_image_url = item.get(
                    "thumbnail"
                )

                if category_image_url:

                    try:

                        image_response = requests.get(
                            category_image_url,
                            timeout=20
                        )

                        if image_response.status_code == 200:

                            filename = (
                                f"{slugify(category_name)}.jpg"
                            )

                            category.image.save(
                                filename,
                                ContentFile(
                                    image_response.content
                                ),
                                save=True
                            )

                    except Exception as e:

                        self.stdout.write(
                            self.style.WARNING(
                                f"Category image failed: "
                                f"{category_name} - {e}"
                            )
                        )

                categories[category_name] = category

            else:

                category = categories[category_name]

            # --------------------------------------------------
            # PRICE
            # --------------------------------------------------

            price = Decimal(
                str(item.get("price", 10))
            )

            discount_percentage = Decimal(
                str(
                    item.get(
                        "discountPercentage",
                        0
                    )
                )
            )

            discount_price = price * (
                Decimal("1")
                - discount_percentage / Decimal("100")
            )

            discount_price = round(
                discount_price,
                2
            )

            # --------------------------------------------------
            # STOCK
            # --------------------------------------------------

            stock = item.get(
                "stock",
                20
            )

            # --------------------------------------------------
            # PRODUCT
            # --------------------------------------------------

            product = Product.objects.create(

                category=category,

                name=title,

                description=description,

                brand=brand,

                price=price,

                discount_price=discount_price,

                weight=Decimal(
                    str(
                        item.get(
                            "weight",
                            1
                        )
                    )
                ),

                unit="piece",

                stock_status=stock > 0,

                is_active=True,
            )

            created_products += 1

            # --------------------------------------------------
            # MAIN IMAGE
            # --------------------------------------------------

            thumbnail_url = item.get(
                "thumbnail"
            )

            if thumbnail_url:

                try:

                    image_response = requests.get(
                        thumbnail_url,
                        timeout=20
                    )

                    if image_response.status_code == 200:

                        extension = self.get_extension(
                            thumbnail_url
                        )

                        filename = (
                            f"{slugify(title)}"
                            f"{extension}"
                        )

                        product.image.save(
                            filename,
                            ContentFile(
                                image_response.content
                            ),
                            save=True
                        )

                except Exception as e:

                    self.stdout.write(
                        self.style.WARNING(
                            f"Main image failed: "
                            f"{title} - {e}"
                        )
                    )

            # --------------------------------------------------
            # ADDITIONAL IMAGES
            # --------------------------------------------------

            images = item.get(
                "images",
                []
            )

            for image_index, image_url in enumerate(
                images[:3],
                start=1
            ):

                try:

                    image_response = requests.get(
                        image_url,
                        timeout=20
                    )

                    if image_response.status_code != 200:
                        continue

                    extension = self.get_extension(
                        image_url
                    )

                    filename = (
                        f"{slugify(title)}"
                        f"-{image_index}"
                        f"{extension}"
                    )

                    product_image = (
                        ProductImage.objects.create(
                            product=product
                        )
                    )

                    product_image.image.save(
                        filename,
                        ContentFile(
                            image_response.content
                        ),
                        save=True
                    )

                    created_images += 1

                except Exception as e:

                    self.stdout.write(
                        self.style.WARNING(
                            f"Additional image failed: "
                            f"{title} - {e}"
                        )
                    )

            # --------------------------------------------------
            # REVIEWS
            # --------------------------------------------------

            rating = item.get(
                "rating",
                4.5
            )

            review_names = [
                "John Smith",
                "Michael Brown",
                "David Wilson",
                "James Miller",
                "Robert Davis",
            ]

            for review_index in range(2):

                review_name = review_names[
                    (index + review_index)
                    % len(review_names)
                ]

                Review.objects.create(

                    product=product,

                    name=review_name,

                    rating=max(
                        1,
                        min(
                            5,
                            round(float(rating))
                        )
                    ),

                    comment=(
                        "Great product. "
                        "The quality is really good "
                        "and I am satisfied with my purchase."
                    )
                )

                created_reviews += 1

            # --------------------------------------------------
            # PROGRESS
            # --------------------------------------------------

            self.stdout.write(
                f"[{index}/{len(products_data)}] "
                f"{title}"
            )

        # --------------------------------------------------
        # FINAL RESULT
        # --------------------------------------------------

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                "========================================"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                "PRODUCT SEEDING COMPLETED"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                "========================================"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Categories : {len(categories)}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Products   : {created_products}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Images     : {created_images}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Reviews    : {created_reviews}"
            )
        )

    # ------------------------------------------------------
    # IMAGE EXTENSION
    # ------------------------------------------------------

    def get_extension(self, url):

        url = url.lower()

        if ".png" in url:
            return ".png"

        if ".webp" in url:
            return ".webp"

        if ".jpeg" in url:
            return ".jpeg"

        return ".jpg"