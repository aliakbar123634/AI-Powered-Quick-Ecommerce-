import os
import re
import requests

from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.db import transaction

from products.models import Category, Product, ProductImage


DUMMY_JSON_URL = "https://dummyjson.com/products?limit=194"


class Command(BaseCommand):
    help = "Update existing products and categories with real product images without deleting data."

    def add_arguments(self, parser):
        parser.add_argument(
            "--limit",
            type=int,
            default=0,
            help="Number of products to update. 0 means all products.",
        )

        parser.add_argument(
            "--skip-existing",
            action="store_true",
            help="Only update products that don't already have an image.",
        )

    def handle(self, *args, **options):

        limit = options["limit"]
        skip_existing = options["skip_existing"]

        self.stdout.write("")
        self.stdout.write("=" * 60)
        self.stdout.write("UPDATING PRODUCT IMAGES")
        self.stdout.write("=" * 60)

        # ---------------------------------------------------------
        # 1. GET PRODUCTS FROM DUMMYJSON
        # ---------------------------------------------------------

        self.stdout.write("Downloading real product image data...")

        try:
            response = requests.get(
                DUMMY_JSON_URL,
                timeout=30,
            )

            response.raise_for_status()

            data = response.json()

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f"Could not download product data: {e}"
                )
            )
            return

        remote_products = data.get("products", [])

        if not remote_products:
            self.stdout.write(
                self.style.ERROR(
                    "No products received from image source."
                )
            )
            return

        self.stdout.write(
            self.style.SUCCESS(
                f"Remote products available: {len(remote_products)}"
            )
        )

        # ---------------------------------------------------------
        # 2. PREPARE LOCAL PRODUCTS
        # ---------------------------------------------------------

        products = Product.objects.select_related("category").all()

        if limit > 0:
            products = products[:limit]

        total_products = products.count()

        self.stdout.write(
            f"Local products to process: {total_products}"
        )

        # ---------------------------------------------------------
        # 3. CATEGORY KEYWORDS
        # ---------------------------------------------------------

        category_keywords = {
            "electronics": [
                "laptop",
                "smartphone",
                "mobile",
                "phone",
                "tablet",
                "computer",
                "monitor",
                "keyboard",
                "mouse",
                "headphones",
                "earbuds",
                "camera",
                "webcam",
                "watch",
                "charger",
                "speaker",
            ],

            "groceries": [
                "milk",
                "apple",
                "banana",
                "bread",
                "butter",
                "cheese",
                "egg",
                "coffee",
                "juice",
                "food",
                "groceries",
            ],

            "beauty": [
                "beauty",
                "makeup",
                "lipstick",
                "mascara",
                "foundation",
                "cream",
                "serum",
                "skin",
                "shampoo",
                "perfume",
                "fragrance",
            ],

            "books": [
                "book",
                "notebook",
                "pen",
                "pencil",
                "stationery",
                "paper",
            ],

            "sports": [
                "sport",
                "football",
                "basketball",
                "tennis",
                "running",
                "exercise",
                "fitness",
                "gym",
                "yoga",
                "mat",
            ],

            "fashion": [
                "shirt",
                "t-shirt",
                "dress",
                "jeans",
                "jacket",
                "shoes",
                "sneakers",
                "watch",
                "bag",
                "fashion",
            ],

            "home": [
                "home",
                "furniture",
                "chair",
                "table",
                "sofa",
                "bed",
                "kitchen",
                "lamp",
                "decor",
            ],

            "health": [
                "health",
                "medicine",
                "vitamin",
                "supplement",
                "protein",
                "fitness",
                "medical",
            ],
        }

        # ---------------------------------------------------------
        # 4. FIND BEST REMOTE PRODUCT
        # ---------------------------------------------------------

        def normalize(value):
            if not value:
                return ""

            value = str(value).lower()

            value = re.sub(
                r"[^a-z0-9\s-]",
                " ",
                value,
            )

            value = re.sub(
                r"\s+",
                " ",
                value,
            )

            return value.strip()

        def find_best_remote_product(local_product):

            local_name = normalize(local_product.name)
            local_brand = normalize(local_product.brand)

            category_name = normalize(
                local_product.category.name
            )

            best_product = None
            best_score = -1

            for remote in remote_products:

                score = 0

                remote_title = normalize(
                    remote.get("title")
                )

                remote_brand = normalize(
                    remote.get("brand")
                )

                remote_category = normalize(
                    remote.get("category")
                )

                # ---------------------------------------------
                # Product name matching
                # ---------------------------------------------

                local_words = set(
                    local_name.split()
                )

                remote_words = set(
                    remote_title.split()
                )

                common_words = (
                    local_words & remote_words
                )

                score += len(common_words) * 5

                # ---------------------------------------------
                # Brand matching
                # ---------------------------------------------

                if (
                    local_brand
                    and remote_brand
                    and local_brand == remote_brand
                ):
                    score += 10

                # ---------------------------------------------
                # Category matching
                # ---------------------------------------------

                if (
                    category_name
                    and remote_category
                    and (
                        category_name in remote_category
                        or remote_category in category_name
                    )
                ):
                    score += 15

                # ---------------------------------------------
                # Keyword matching
                # ---------------------------------------------

                keywords = []

                for key, values in category_keywords.items():

                    if key in category_name:
                        keywords.extend(values)

                for keyword in keywords:

                    if (
                        keyword in local_name
                        and keyword in remote_title
                    ):
                        score += 8

                if score > best_score:

                    best_score = score
                    best_product = remote

            return best_product

        # ---------------------------------------------------------
        # 5. DOWNLOAD IMAGE
        # ---------------------------------------------------------

        def download_image(image_url):

            if not image_url:
                return None

            try:

                image_response = requests.get(
                    image_url,
                    timeout=20,
                    headers={
                        "User-Agent": (
                            "Mozilla/5.0 "
                            "(Windows NT 10.0; Win64; x64)"
                        )
                    },
                )

                image_response.raise_for_status()

                content_type = image_response.headers.get(
                    "Content-Type",
                    ""
                )

                if not content_type.startswith("image"):

                    self.stdout.write(
                        self.style.WARNING(
                            "URL did not return an image."
                        )
                    )

                    return None

                return image_response.content

            except Exception as e:

                self.stdout.write(
                    self.style.WARNING(
                        f"Image download failed: {e}"
                    )
                )

                return None

        # ---------------------------------------------------------
        # 6. SAVE PRODUCT IMAGE
        # ---------------------------------------------------------

        updated_products = 0
        updated_images = 0
        failed_images = 0

        used_remote_images = {}

        with transaction.atomic():

            for index, product in enumerate(products, start=1):

                self.stdout.write(
                    f"[{index}/{total_products}] "
                    f"{product.name}"
                )

                # -------------------------------------------------
                # SKIP EXISTING IMAGE
                # -------------------------------------------------

                if (
                    skip_existing
                    and product.image
                    and product.image.name
                ):
                    self.stdout.write(
                        "   Already has image - skipped."
                    )

                    continue

                # -------------------------------------------------
                # FIND REMOTE PRODUCT
                # -------------------------------------------------

                remote_product = find_best_remote_product(
                    product
                )

                if not remote_product:

                    self.stdout.write(
                        self.style.WARNING(
                            "   No matching remote product."
                        )
                    )

                    failed_images += 1
                    continue

                # -------------------------------------------------
                # GET REMOTE IMAGES
                # -------------------------------------------------

                images = remote_product.get(
                    "images",
                    []
                )

                thumbnail = remote_product.get(
                    "thumbnail"
                )

                if not images and thumbnail:
                    images = [thumbnail]

                if not images:

                    self.stdout.write(
                        self.style.WARNING(
                            "   No image available."
                        )
                    )

                    failed_images += 1
                    continue

                # -------------------------------------------------
                # MAIN PRODUCT IMAGE
                # -------------------------------------------------

                main_image_url = images[0]

                # Avoid downloading same remote image repeatedly
                if main_image_url in used_remote_images:

                    image_bytes = used_remote_images[
                        main_image_url
                    ]

                else:

                    image_bytes = download_image(
                        main_image_url
                    )

                    if image_bytes:
                        used_remote_images[
                            main_image_url
                        ] = image_bytes

                if not image_bytes:

                    failed_images += 1
                    continue

                # -------------------------------------------------
                # CREATE FILE NAME
                # -------------------------------------------------

                safe_name = normalize(
                    product.name
                )

                safe_name = safe_name.replace(
                    " ",
                    "-"
                )

                safe_name = re.sub(
                    r"-+",
                    "-",
                    safe_name
                )

                filename = (
                    f"{safe_name}-"
                    f"{product.id}.jpg"
                )

                # -------------------------------------------------
                # SAVE MAIN PRODUCT IMAGE
                # -------------------------------------------------

                product.image.save(
                    filename,
                    ContentFile(image_bytes),
                    save=False,
                )

                product.save(
                    update_fields=["image"]
                )

                updated_products += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        "   Main image updated."
                    )
                )

                # -------------------------------------------------
                # PRODUCT IMAGE GALLERY
                # -------------------------------------------------

                gallery_urls = images[:2]

                existing_images = list(
                    product.images.all()
                    .order_by("id")
                )

                for image_index, image_url in enumerate(
                    gallery_urls
                ):

                    if image_url in used_remote_images:

                        gallery_bytes = (
                            used_remote_images[
                                image_url
                            ]
                        )

                    else:

                        gallery_bytes = download_image(
                            image_url
                        )

                        if gallery_bytes:

                            used_remote_images[
                                image_url
                            ] = gallery_bytes

                    if not gallery_bytes:
                        continue

                    gallery_filename = (
                        f"{safe_name}-"
                        f"{product.id}-"
                        f"{image_index + 1}.jpg"
                    )

                    if image_index < len(
                        existing_images
                    ):

                        product_image = (
                            existing_images[
                                image_index
                            ]
                        )

                        product_image.image.save(
                            gallery_filename,
                            ContentFile(
                                gallery_bytes
                            ),
                            save=True,
                        )

                        product_image.is_primary = (
                            image_index == 0
                        )

                        product_image.save(
                            update_fields=[
                                "is_primary"
                            ]
                        )

                    else:

                        ProductImage.objects.create(
                            product=product,
                            image=ContentFile(
                                gallery_bytes,
                                name=gallery_filename,
                            ),
                            is_primary=(
                                image_index == 0
                            ),
                        )

                    updated_images += 1

        # ---------------------------------------------------------
        # 7. CATEGORY IMAGES
        # ---------------------------------------------------------

        self.stdout.write("")
        self.stdout.write(
            "=" * 60
        )
        self.stdout.write(
            "UPDATING CATEGORY IMAGES"
        )
        self.stdout.write(
            "=" * 60
        )

        updated_categories = 0

        categories = Category.objects.all()

        category_remote_map = {}

        for remote in remote_products:

            remote_category = normalize(
                remote.get("category")
            )

            remote_images = remote.get(
                "images",
                []
            )

            if remote_category and remote_images:

                if remote_category not in category_remote_map:

                    category_remote_map[
                        remote_category
                    ] = remote_images[0]

        for category in categories:

            category_name = normalize(
                category.name
            )

            matching_url = None

            # ---------------------------------------------
            # Find matching category image
            # ---------------------------------------------

            for remote_category, image_url in (
                category_remote_map.items()
            ):

                if (
                    category_name in remote_category
                    or remote_category in category_name
                ):

                    matching_url = image_url
                    break

            # ---------------------------------------------
            # If category doesn't match,
            # use image from one of its products
            # ---------------------------------------------

            if not matching_url:

                category_product = (
                    category.products
                    .exclude(image="")
                    .exclude(image=None)
                    .first()
                )

                if category_product and category_product.image:

                    try:

                        with category_product.image.open(
                            "rb"
                        ) as image_file:

                            category_bytes = (
                                image_file.read()
                            )

                        category_filename = (
                            f"{category.slug}.jpg"
                        )

                        category.image.save(
                            category_filename,
                            ContentFile(
                                category_bytes
                            ),
                            save=True,
                        )

                        updated_categories += 1

                        self.stdout.write(
                            self.style.SUCCESS(
                                f"   Category updated: "
                                f"{category.name}"
                            )
                        )

                        continue

                    except Exception:
                        pass

            if not matching_url:

                self.stdout.write(
                    self.style.WARNING(
                        f"   No category image: "
                        f"{category.name}"
                    )
                )

                continue

            category_bytes = download_image(
                matching_url
            )

            if not category_bytes:
                continue

            category_filename = (
                f"{category.slug}.jpg"
            )

            category.image.save(
                category_filename,
                ContentFile(category_bytes),
                save=True,
            )

            updated_categories += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"   Category updated: "
                    f"{category.name}"
                )
            )

        # ---------------------------------------------------------
        # 8. FINAL RESULT
        # ---------------------------------------------------------

        self.stdout.write("")
        self.stdout.write(
            "=" * 60
        )

        self.stdout.write(
            self.style.SUCCESS(
                "IMAGE UPDATE COMPLETED"
            )
        )

        self.stdout.write(
            "=" * 60
        )

        self.stdout.write(
            f"Products updated   : {updated_products}"
        )

        self.stdout.write(
            f"Product images     : {updated_images}"
        )

        self.stdout.write(
            f"Categories updated : {updated_categories}"
        )

        self.stdout.write(
            f"Failed images      : {failed_images}"
        )

        self.stdout.write(
            "=" * 60
        )

        self.stdout.write(
            "Existing products were NOT deleted."
        )

        self.stdout.write(
            "Existing categories were NOT deleted."
        )

        self.stdout.write(
            "Existing reviews were NOT deleted."
        )

        self.stdout.write(
            "Existing prices/stock/data were NOT changed."
        )

        self.stdout.write(
            "=" * 60
        )