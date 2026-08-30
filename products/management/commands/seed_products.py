# from django.core.management.base import BaseCommand
# from django.core.files.base import ContentFile

# from products.models import (
#     Category,
#     Product,
#     ProductImage,
#     Review,
# )

# from decimal import Decimal
# from io import BytesIO

# import random

# try:
#     from PIL import Image, ImageDraw, ImageFont
# except ImportError:
#     Image = None


# class Command(BaseCommand):

#     help = "Create realistic testing data for Quick Ecommerce"

#     def add_arguments(self, parser):

#         parser.add_argument(
#             "--count",
#             type=int,
#             default=200,
#             help="Number of products to create",
#         )

#         parser.add_argument(
#             "--clear",
#             action="store_true",
#             help="Delete existing categories and products first",
#         )

#     def handle(self, *args, **options):

#         count = options["count"]
#         clear = options["clear"]

#         self.stdout.write(
#             self.style.WARNING(
#                 f"Creating {count} test products..."
#             )
#         )

#         # ============================================================
#         # CLEAR OLD DATA
#         # ============================================================

#         if clear:

#             self.stdout.write(
#                 self.style.WARNING(
#                     "Deleting old product testing data..."
#                 )
#             )

#             Review.objects.all().delete()
#             ProductImage.objects.all().delete()
#             Product.objects.all().delete()
#             Category.objects.all().delete()

#         # ============================================================
#         # CATEGORIES
#         # ============================================================

#         categories_data = [

#             {
#                 "name": "Books & Stationery",
#                 "description": "Books, notebooks, stationery and office essentials.",
#             },

#             {
#                 "name": "Electronics",
#                 "description": "Modern electronics, gadgets and accessories.",
#             },

#             {
#                 "name": "Groceries",
#                 "description": "Fresh groceries and everyday food essentials.",
#             },

#             {
#                 "name": "Beauty",
#                 "description": "Beauty, skincare and personal care products.",
#             },

#             {
#                 "name": "Home & Kitchen",
#                 "description": "Useful products for your home and kitchen.",
#             },

#             {
#                 "name": "Fashion",
#                 "description": "Fashion products, clothing and accessories.",
#             },

#             {
#                 "name": "Sports",
#                 "description": "Sports and fitness equipment.",
#             },

#             {
#                 "name": "Health",
#                 "description": "Everyday health and wellness products.",
#             },

#         ]

#         categories = []

#         for category_data in categories_data:

#             category, created = Category.objects.get_or_create(
#                 name=category_data["name"],
#                 defaults={
#                     "description": category_data["description"]
#                 }
#             )

#             categories.append(category)

#         self.stdout.write(
#             self.style.SUCCESS(
#                 f"Categories ready: {len(categories)}"
#             )
#         )

#         # ============================================================
#         # PRODUCT DATA
#         # ============================================================

#         product_templates = [

#             # BOOKS
#             {
#                 "category": "Books & Stationery",
#                 "names": [
#                     "Professional Book Set",
#                     "Professional Notebook Set",
#                     "Professional Office Notebook",
#                     "Professional Writing Notebook",
#                     "Professional Journal Set",
#                     "Business Management Book",
#                     "Python Programming Book",
#                     "Django REST Framework Book",
#                     "Artificial Intelligence Book",
#                     "Machine Learning Handbook",
#                     "Data Structures Book",
#                     "Algorithms Complete Guide",
#                     "Software Engineering Book",
#                     "Computer Science Handbook",
#                     "Student Notebook Pack",
#                     "Premium Diary",
#                     "Office Stationery Set",
#                     "A4 Writing Notebook",
#                     "Premium Planner",
#                     "Study Notes Notebook",
#                 ],
#             },

#             # ELECTRONICS
#             {
#                 "category": "Electronics",
#                 "names": [
#                     "Wireless Bluetooth Headphones",
#                     "Professional Noise Cancelling Headphones",
#                     "Wireless Mouse",
#                     "Mechanical Keyboard",
#                     "USB Type C Cable",
#                     "Fast Charging Adapter",
#                     "Power Bank 20000mAh",
#                     "Smart Watch",
#                     "Bluetooth Speaker",
#                     "Portable Bluetooth Speaker",
#                     "LED Desk Lamp",
#                     "USB Hub",
#                     "Laptop Stand",
#                     "Webcam HD",
#                     "Wireless Earbuds",
#                     "Gaming Headset",
#                     "Phone Holder",
#                     "Smart LED Bulb",
#                     "Portable SSD",
#                     "Laptop Cooling Pad",
#                 ],
#             },

#             # GROCERIES
#             {
#                 "category": "Groceries",
#                 "names": [
#                     "Premium Milk",
#                     "Fresh Organic Apples",
#                     "Fresh Bananas",
#                     "Whole Wheat Bread",
#                     "Premium Coffee",
#                     "Green Tea",
#                     "Organic Honey",
#                     "Basmati Rice",
#                     "Cooking Oil",
#                     "Organic Oats",
#                     "Corn Flakes",
#                     "Chocolate Cookies",
#                     "Fresh Orange Juice",
#                     "Mineral Water",
#                     "Premium Pasta",
#                     "Tomato Ketchup",
#                     "Peanut Butter",
#                     "Mixed Nuts",
#                     "Organic Dates",
#                     "Breakfast Cereal",
#                 ],
#             },

#             # BEAUTY
#             {
#                 "category": "Beauty",
#                 "names": [
#                     "Face Wash",
#                     "Vitamin C Face Serum",
#                     "Moisturizing Cream",
#                     "Daily Sunscreen",
#                     "Hair Shampoo",
#                     "Conditioner",
#                     "Hair Oil",
#                     "Body Lotion",
#                     "Lip Balm",
#                     "Face Moisturizer",
#                     "Cleansing Foam",
#                     "Skin Care Kit",
#                     "Beauty Brush Set",
#                     "Makeup Organizer",
#                     "Hand Cream",
#                     "Body Wash",
#                     "Hair Mask",
#                     "Anti Dandruff Shampoo",
#                     "Aloe Vera Gel",
#                     "Premium Beauty Kit",
#                 ],
#             },

#             # HOME
#             {
#                 "category": "Home & Kitchen",
#                 "names": [
#                     "Coffee Mug",
#                     "Stainless Steel Water Bottle",
#                     "Kitchen Knife Set",
#                     "Non Stick Frying Pan",
#                     "Dinner Plate Set",
#                     "Glass Storage Container",
#                     "Electric Kettle",
#                     "Kitchen Organizer",
#                     "Storage Box",
#                     "Bedsheet Set",
#                     "Pillow Cover Set",
#                     "Table Lamp",
#                     "Wall Clock",
#                     "Laundry Basket",
#                     "Vacuum Cleaner",
#                     "Kitchen Scale",
#                     "Cutlery Set",
#                     "Food Storage Box",
#                     "Air Freshener",
#                     "Premium Kitchen Set",
#                 ],
#             },

#             # FASHION
#             {
#                 "category": "Fashion",
#                 "names": [
#                     "Classic T Shirt",
#                     "Premium Cotton Shirt",
#                     "Casual Jeans",
#                     "Sports Jacket",
#                     "Men Wallet",
#                     "Leather Belt",
#                     "Running Shoes",
#                     "Casual Sneakers",
#                     "Fashion Backpack",
#                     "Travel Backpack",
#                     "Baseball Cap",
#                     "Winter Hoodie",
#                     "Premium Socks Pack",
#                     "Classic Sunglasses",
#                     "Leather Handbag",
#                     "Casual Watch",
#                     "Formal Shoes",
#                     "Denim Jacket",
#                     "Cotton Polo Shirt",
#                     "Premium Fashion Set",
#                 ],
#             },

#             # SPORTS
#             {
#                 "category": "Sports",
#                 "names": [
#                     "Football",
#                     "Cricket Bat",
#                     "Cricket Ball",
#                     "Tennis Racket",
#                     "Badminton Racket",
#                     "Yoga Mat",
#                     "Gym Gloves",
#                     "Resistance Bands",
#                     "Skipping Rope",
#                     "Water Bottle Sports",
#                     "Running Shoes Sports",
#                     "Fitness Tracker",
#                     "Dumbbell Set",
#                     "Exercise Mat",
#                     "Sports Backpack",
#                     "Cycling Gloves",
#                     "Football Shoes",
#                     "Training Cone Set",
#                     "Sports Towel",
#                     "Fitness Kit",
#                 ],
#             },

#             # HEALTH
#             {
#                 "category": "Health",
#                 "names": [
#                     "Digital Thermometer",
#                     "First Aid Kit",
#                     "Vitamin Organizer",
#                     "Pill Storage Box",
#                     "Heating Pad",
#                     "Reusable Ice Pack",
#                     "Digital Weighing Scale",
#                     "Blood Pressure Monitor",
#                     "Sleep Mask",
#                     "Travel Health Kit",
#                     "Personal Care Kit",
#                     "Hand Sanitizer",
#                     "Face Mask Pack",
#                     "Health Monitoring Watch",
#                     "Wellness Kit",
#                     "Eye Mask",
#                     "Medicine Organizer",
#                     "Portable Humidifier",
#                     "Massage Ball",
#                     "Health Essentials Kit",
#                 ],
#             },

#         ]

#         brands = [
#             "QuickAI",
#             "ProMax",
#             "Nova",
#             "SmartTech",
#             "PremiumChoice",
#             "DailyLife",
#             "Ultra",
#             "EcoLife",
#             "NextGen",
#             "HomePro",
#             "TechZone",
#             "Prime",
#         ]

#         units = [
#             "piece",
#             "pack",
#             "box",
#             "kg",
#             "liter",
#             "set",
#         ]

#         category_map = {
#             category.name: category
#             for category in categories
#         }

#         # ============================================================
#         # CREATE PRODUCTS
#         # ============================================================

#         created_products = []

#         for i in range(count):

#             template = random.choice(product_templates)

#             product_name = random.choice(
#                 template["names"]
#             )

#             # Ensure unique product names
#             product_name = f"{product_name} {i + 1}"

#             category = category_map[
#                 template["category"]
#             ]

#             price = Decimal(
#                 random.randint(150, 15000)
#             )

#             # About 65% products have discount
#             if random.random() < 0.65:

#                 discount_percent = random.randint(
#                     5,
#                     40
#                 )

#                 discount_price = (
#                     price
#                     - (
#                         price
#                         * Decimal(discount_percent)
#                         / Decimal("100")
#                     )
#                 ).quantize(
#                     Decimal("0.01")
#                 )

#             else:

#                 discount_price = None

#             product = Product(

#                 category=category,

#                 name=product_name,

#                 description=(
#                     f"{product_name} is a high quality "
#                     f"product available at QuickAI. "
#                     f"Perfect for everyday use with "
#                     f"excellent value and reliable quality."
#                 ),

#                 brand=random.choice(brands),

#                 price=price,

#                 discount_price=discount_price,

#                 weight=Decimal(
#                     random.randint(50, 5000)
#                 ),

#                 unit=random.choice(units),

#                 stock_status=random.random() > 0.15,

#                 is_active=random.random() > 0.05,

#                 # IMPORTANT:
#                 # Do not generate fake semantic embeddings.
#                 embedding=None,
#             )

#             product.save()

#             # ========================================================
#             # PRODUCT IMAGE
#             # ========================================================

#             image_file = self.create_image(
#                 product.name
#             )

#             product.image.save(
#                 f"product-{product.id}.jpg",
#                 image_file,
#                 save=True
#             )

#             # ========================================================
#             # EXTRA PRODUCT IMAGE
#             # ========================================================

#             second_image_file = self.create_image(
#                 product.name,
#                 variant=True
#             )

#             ProductImage.objects.create(

#                 product=product,

#                 image=second_image_file,

#                 is_primary=False,
#             )

#             # ========================================================
#             # PRIMARY PRODUCT IMAGE
#             # ========================================================

#             primary_image_file = self.create_image(
#                 product.name,
#                 variant=True
#             )

#             ProductImage.objects.create(

#                 product=product,

#                 image=primary_image_file,

#                 is_primary=True,
#             )

#             created_products.append(product)

#         self.stdout.write(
#             self.style.SUCCESS(
#                 f"Products created: {len(created_products)}"
#             )
#         )

#         # ============================================================
#         # CREATE REVIEWS
#         # ============================================================

#         review_names = [
#             "Ali",
#             "Ahmed",
#             "Usman",
#             "Hamza",
#             "Hassan",
#             "Bilal",
#             "Sarah",
#             "Ayesha",
#             "Fatima",
#             "John",
#             "Michael",
#             "Emma",
#         ]

#         review_comments = [
#             "Excellent product. Really happy with the quality.",
#             "Good quality and fast delivery.",
#             "Product is exactly as described.",
#             "Very useful product. Recommended.",
#             "Good value for money.",
#             "Quality is better than expected.",
#             "I really like this product.",
#             "Fast delivery and good packaging.",
#             "Amazing product for the price.",
#             "Would definitely buy again.",
#         ]

#         reviews = []

#         for product in created_products:

#             # 0-5 reviews per product
#             review_count = random.randint(
#                 0,
#                 5
#             )

#             for _ in range(review_count):

#                 reviews.append(
#                     Review(
#                         product=product,

#                         name=random.choice(
#                             review_names
#                         ),

#                         rating=random.randint(
#                             3,
#                             5
#                         ),

#                         comment=random.choice(
#                             review_comments
#                         ),
#                     )
#                 )

#         Review.objects.bulk_create(
#             reviews
#         )

#         self.stdout.write(
#             self.style.SUCCESS(
#                 f"Reviews created: {len(reviews)}"
#             )
#         )

#         # ============================================================
#         # FINAL SUMMARY
#         # ============================================================

#         self.stdout.write("")
#         self.stdout.write(
#             self.style.SUCCESS(
#                 "=========================================="
#             )
#         )

#         self.stdout.write(
#             self.style.SUCCESS(
#                 "TEST DATA CREATED SUCCESSFULLY"
#             )
#         )

#         self.stdout.write(
#             self.style.SUCCESS(
#                 "=========================================="
#             )
#         )

#         self.stdout.write(
#             f"Categories : {Category.objects.count()}"
#         )

#         self.stdout.write(
#             f"Products   : {Product.objects.count()}"
#         )

#         self.stdout.write(
#             f"Images     : {ProductImage.objects.count()}"
#         )

#         self.stdout.write(
#             f"Reviews    : {Review.objects.count()}"
#         )

#         self.stdout.write("")
#         self.stdout.write(
#             self.style.WARNING(
#                 "Embeddings were left NULL intentionally."
#             )
#         )

#     # ================================================================
#     # IMAGE GENERATOR
#     # ================================================================

#     def create_image(
#     self,
#     text,
#     variant=False
# ):

#         if Image is None:
#             raise ImportError(
#             "Pillow is required. Run: pip install Pillow"
#         )

#         width = 800
#         height = 800

#         backgrounds = [
#         (235, 245, 255),
#         (245, 240, 255),
#         (240, 255, 245),
#         (255, 248, 235),
#         (255, 240, 245),
#         (240, 250, 255),
#     ]

#         background = random.choice(backgrounds)

#         image = Image.new(
#         "RGB",
#         (width, height),
#         background
#     )

#         draw = ImageDraw.Draw(image)

#         draw.rounded_rectangle(
#         (80, 80, 720, 720),
#         radius=40,
#         fill=(255, 255, 255)
#     )

#     draw.rounded_rectangle(
#         (220, 180, 580, 450),
#         radius=30,
#         fill=(230, 238, 255)
#     )

#     try:

#         font_large = ImageFont.truetype(
#             "arial.ttf",
#             42
#         )

#         font_small = ImageFont.truetype(
#             "arial.ttf",
#             28
#         )

#     except:

#         font_large = ImageFont.load_default()
#         font_small = ImageFont.load_default()

#     display_name = text[:28]

#     draw.text(
#         (400, 500),
#         display_name,
#         fill=(15, 23, 42),
#         font=font_large,
#         anchor="mm"
#     )

#     draw.text(
#         (400, 580),
#         "QuickAI",
#         fill=(37, 99, 235),
#         font=font_small,
#         anchor="mm"
#     )

#     draw.text(
#         (400, 630),
#         "Premium Product",
#         fill=(100, 116, 139),
#         font=font_small,
#         anchor="mm"
#     )

#     buffer = BytesIO()

#     image.save(
#         buffer,
#         format="JPEG",
#         quality=90
#     )

#     buffer.seek(0)

#     # IMPORTANT:
#     # ContentFile ko filename dena zaroori hai

#     filename = (
#         text.lower()
#         .replace(" ", "-")
#         .replace("/", "-")[:40]
#     )

#     if variant:
#         filename += "-variant"

#     filename += ".jpg"

#     return ContentFile(
#         buffer.read(),
#         name=filename
#     )

#         if Image is None:

#             raise ImportError(
#                 "Pillow is required. Run: pip install Pillow"
#             )

#         width = 800
#         height = 800

#         # Different backgrounds
#         backgrounds = [

#             (235, 245, 255),

#             (245, 240, 255),

#             (240, 255, 245),

#             (255, 248, 235),

#             (255, 240, 245),

#             (240, 250, 255),

#         ]

#         background = random.choice(
#             backgrounds
#         )

#         image = Image.new(
#             "RGB",
#             (width, height),
#             background
#         )

#         draw = ImageDraw.Draw(
#             image
#         )

#         # Product card
#         draw.rounded_rectangle(
#             (80, 80, 720, 720),
#             radius=40,
#             fill=(255, 255, 255)
#         )

#         # Product icon / simple visual
#         draw.rounded_rectangle(
#             (220, 180, 580, 450),
#             radius=30,
#             fill=(230, 238, 255)
#         )

#         # Try default font
#         try:

#             font_large = ImageFont.truetype(
#                 "arial.ttf",
#                 42
#             )

#             font_small = ImageFont.truetype(
#                 "arial.ttf",
#                 28
#             )

#         except:

#             font_large = ImageFont.load_default()

#             font_small = ImageFont.load_default()

#         # Product name
#         display_name = text[:28]

#         draw.text(
#             (400, 500),
#             display_name,
#             fill=(15, 23, 42),
#             font=font_large,
#             anchor="mm"
#         )

#         draw.text(
#             (400, 580),
#             "QuickAI",
#             fill=(37, 99, 235),
#             font=font_small,
#             anchor="mm"
#         )

#         draw.text(
#             (400, 630),
#             "Premium Product",
#             fill=(100, 116, 139),
#             font=font_small,
#             anchor="mm"
#         )

#         buffer = BytesIO()

#         image.save(
#             buffer,
#             format="JPEG",
#             quality=90
#         )

#         buffer.seek(0)

#         return ContentFile(
#             buffer.read()
#         )
















from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile

from products.models import (
    Category,
    Product,
    ProductImage,
    Review,
)

from decimal import Decimal
from io import BytesIO

import random

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    Image = None


class Command(BaseCommand):

    help = "Create realistic testing data for Quick Ecommerce"

    def add_arguments(self, parser):

        parser.add_argument(
            "--count",
            type=int,
            default=200,
            help="Number of products to create",
        )

        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete existing categories and products first",
        )

    def handle(self, *args, **options):

        count = options["count"]
        clear = options["clear"]

        self.stdout.write(
            self.style.WARNING(
                f"Creating {count} test products..."
            )
        )

        # ============================================================
        # CLEAR OLD DATA
        # ============================================================

        if clear:

            self.stdout.write(
                self.style.WARNING(
                    "Deleting old product testing data..."
                )
            )

            Review.objects.all().delete()
            ProductImage.objects.all().delete()
            Product.objects.all().delete()
            Category.objects.all().delete()

        # ============================================================
        # CATEGORIES
        # ============================================================

        categories_data = [

            {
                "name": "Books & Stationery",
                "description": "Books, notebooks, stationery and office essentials.",
            },

            {
                "name": "Electronics",
                "description": "Modern electronics, gadgets and accessories.",
            },

            {
                "name": "Groceries",
                "description": "Fresh groceries and everyday food essentials.",
            },

            {
                "name": "Beauty",
                "description": "Beauty, skincare and personal care products.",
            },

            {
                "name": "Home & Kitchen",
                "description": "Useful products for your home and kitchen.",
            },

            {
                "name": "Fashion",
                "description": "Fashion products, clothing and accessories.",
            },

            {
                "name": "Sports",
                "description": "Sports and fitness equipment.",
            },

            {
                "name": "Health",
                "description": "Everyday health and wellness products.",
            },

        ]

        categories = []

        for category_data in categories_data:

            category, created = Category.objects.get_or_create(
                name=category_data["name"],
                defaults={
                    "description": category_data["description"]
                }
            )

            categories.append(category)

        self.stdout.write(
            self.style.SUCCESS(
                f"Categories ready: {len(categories)}"
            )
        )

        # ============================================================
        # PRODUCT DATA
        # ============================================================

        product_templates = [

            # BOOKS
            {
                "category": "Books & Stationery",
                "names": [
                    "Professional Book Set",
                    "Professional Notebook Set",
                    "Professional Office Notebook",
                    "Professional Writing Notebook",
                    "Professional Journal Set",
                    "Business Management Book",
                    "Python Programming Book",
                    "Django REST Framework Book",
                    "Artificial Intelligence Book",
                    "Machine Learning Handbook",
                    "Data Structures Book",
                    "Algorithms Complete Guide",
                    "Software Engineering Book",
                    "Computer Science Handbook",
                    "Student Notebook Pack",
                    "Premium Diary",
                    "Office Stationery Set",
                    "A4 Writing Notebook",
                    "Premium Planner",
                    "Study Notes Notebook",
                ],
            },

            # ELECTRONICS
            {
                "category": "Electronics",
                "names": [
                    "Wireless Bluetooth Headphones",
                    "Professional Noise Cancelling Headphones",
                    "Wireless Mouse",
                    "Mechanical Keyboard",
                    "USB Type C Cable",
                    "Fast Charging Adapter",
                    "Power Bank 20000mAh",
                    "Smart Watch",
                    "Bluetooth Speaker",
                    "Portable Bluetooth Speaker",
                    "LED Desk Lamp",
                    "USB Hub",
                    "Laptop Stand",
                    "Webcam HD",
                    "Wireless Earbuds",
                    "Gaming Headset",
                    "Phone Holder",
                    "Smart LED Bulb",
                    "Portable SSD",
                    "Laptop Cooling Pad",
                ],
            },

            # GROCERIES
            {
                "category": "Groceries",
                "names": [
                    "Premium Milk",
                    "Fresh Organic Apples",
                    "Fresh Bananas",
                    "Whole Wheat Bread",
                    "Premium Coffee",
                    "Green Tea",
                    "Organic Honey",
                    "Basmati Rice",
                    "Cooking Oil",
                    "Organic Oats",
                    "Corn Flakes",
                    "Chocolate Cookies",
                    "Fresh Orange Juice",
                    "Mineral Water",
                    "Premium Pasta",
                    "Tomato Ketchup",
                    "Peanut Butter",
                    "Mixed Nuts",
                    "Organic Dates",
                    "Breakfast Cereal",
                ],
            },

            # BEAUTY
            {
                "category": "Beauty",
                "names": [
                    "Face Wash",
                    "Vitamin C Face Serum",
                    "Moisturizing Cream",
                    "Daily Sunscreen",
                    "Hair Shampoo",
                    "Conditioner",
                    "Hair Oil",
                    "Body Lotion",
                    "Lip Balm",
                    "Face Moisturizer",
                    "Cleansing Foam",
                    "Skin Care Kit",
                    "Beauty Brush Set",
                    "Makeup Organizer",
                    "Hand Cream",
                    "Body Wash",
                    "Hair Mask",
                    "Anti Dandruff Shampoo",
                    "Aloe Vera Gel",
                    "Premium Beauty Kit",
                ],
            },

            # HOME
            {
                "category": "Home & Kitchen",
                "names": [
                    "Coffee Mug",
                    "Stainless Steel Water Bottle",
                    "Kitchen Knife Set",
                    "Non Stick Frying Pan",
                    "Dinner Plate Set",
                    "Glass Storage Container",
                    "Electric Kettle",
                    "Kitchen Organizer",
                    "Storage Box",
                    "Bedsheet Set",
                    "Pillow Cover Set",
                    "Table Lamp",
                    "Wall Clock",
                    "Laundry Basket",
                    "Vacuum Cleaner",
                    "Kitchen Scale",
                    "Cutlery Set",
                    "Food Storage Box",
                    "Air Freshener",
                    "Premium Kitchen Set",
                ],
            },

            # FASHION
            {
                "category": "Fashion",
                "names": [
                    "Classic T Shirt",
                    "Premium Cotton Shirt",
                    "Casual Jeans",
                    "Sports Jacket",
                    "Men Wallet",
                    "Leather Belt",
                    "Running Shoes",
                    "Casual Sneakers",
                    "Fashion Backpack",
                    "Travel Backpack",
                    "Baseball Cap",
                    "Winter Hoodie",
                    "Premium Socks Pack",
                    "Classic Sunglasses",
                    "Leather Handbag",
                    "Casual Watch",
                    "Formal Shoes",
                    "Denim Jacket",
                    "Cotton Polo Shirt",
                    "Premium Fashion Set",
                ],
            },

            # SPORTS
            {
                "category": "Sports",
                "names": [
                    "Football",
                    "Cricket Bat",
                    "Cricket Ball",
                    "Tennis Racket",
                    "Badminton Racket",
                    "Yoga Mat",
                    "Gym Gloves",
                    "Resistance Bands",
                    "Skipping Rope",
                    "Water Bottle Sports",
                    "Running Shoes Sports",
                    "Fitness Tracker",
                    "Dumbbell Set",
                    "Exercise Mat",
                    "Sports Backpack",
                    "Cycling Gloves",
                    "Football Shoes",
                    "Training Cone Set",
                    "Sports Towel",
                    "Fitness Kit",
                ],
            },

            # HEALTH
            {
                "category": "Health",
                "names": [
                    "Digital Thermometer",
                    "First Aid Kit",
                    "Vitamin Organizer",
                    "Pill Storage Box",
                    "Heating Pad",
                    "Reusable Ice Pack",
                    "Digital Weighing Scale",
                    "Blood Pressure Monitor",
                    "Sleep Mask",
                    "Travel Health Kit",
                    "Personal Care Kit",
                    "Hand Sanitizer",
                    "Face Mask Pack",
                    "Health Monitoring Watch",
                    "Wellness Kit",
                    "Eye Mask",
                    "Medicine Organizer",
                    "Portable Humidifier",
                    "Massage Ball",
                    "Health Essentials Kit",
                ],
            },

        ]

        brands = [
            "QuickAI",
            "ProMax",
            "Nova",
            "SmartTech",
            "PremiumChoice",
            "DailyLife",
            "Ultra",
            "EcoLife",
            "NextGen",
            "HomePro",
            "TechZone",
            "Prime",
        ]

        units = [
            "piece",
            "pack",
            "box",
            "kg",
            "liter",
            "set",
        ]

        category_map = {
            category.name: category
            for category in categories
        }

        # ============================================================
        # CREATE PRODUCTS
        # ============================================================

        created_products = []

        for i in range(count):

            template = random.choice(product_templates)

            product_name = random.choice(
                template["names"]
            )

            # Ensure unique product names
            product_name = f"{product_name} {i + 1}"

            category = category_map[
                template["category"]
            ]

            price = Decimal(
                random.randint(150, 15000)
            )

            # About 65% products have discount
            if random.random() < 0.65:

                discount_percent = random.randint(
                    5,
                    40
                )

                discount_price = (
                    price
                    - (
                        price
                        * Decimal(discount_percent)
                        / Decimal("100")
                    )
                ).quantize(
                    Decimal("0.01")
                )

            else:

                discount_price = None

            product = Product(

                category=category,

                name=product_name,

                description=(
                    f"{product_name} is a high quality "
                    f"product available at QuickAI. "
                    f"Perfect for everyday use with "
                    f"excellent value and reliable quality."
                ),

                brand=random.choice(brands),

                price=price,

                discount_price=discount_price,

                weight=Decimal(
                    random.randint(50, 5000)
                ),

                unit=random.choice(units),

                stock_status=random.random() > 0.15,

                is_active=random.random() > 0.05,

                # IMPORTANT:
                # Do not generate fake semantic embeddings.
                embedding=None,
            )

            product.save()

            # ========================================================
            # PRODUCT IMAGE
            # ========================================================

            image_file = self.create_image(
                product.name
            )

            product.image.save(
                f"product-{product.id}.jpg",
                image_file,
                save=True
            )

            # ========================================================
            # EXTRA PRODUCT IMAGE
            # ========================================================

            second_image_file = self.create_image(
                product.name,
                variant=True
            )

            ProductImage.objects.create(

                product=product,

                image=second_image_file,

                is_primary=False,
            )

            # ========================================================
            # PRIMARY PRODUCT IMAGE
            # ========================================================

            primary_image_file = self.create_image(
                product.name,
                variant=True
            )

            ProductImage.objects.create(

                product=product,

                image=primary_image_file,

                is_primary=True,
            )

            created_products.append(product)

        self.stdout.write(
            self.style.SUCCESS(
                f"Products created: {len(created_products)}"
            )
        )

        # ============================================================
        # CREATE REVIEWS
        # ============================================================

        review_names = [
            "Ali",
            "Ahmed",
            "Usman",
            "Hamza",
            "Hassan",
            "Bilal",
            "Sarah",
            "Ayesha",
            "Fatima",
            "John",
            "Michael",
            "Emma",
        ]

        review_comments = [
            "Excellent product. Really happy with the quality.",
            "Good quality and fast delivery.",
            "Product is exactly as described.",
            "Very useful product. Recommended.",
            "Good value for money.",
            "Quality is better than expected.",
            "I really like this product.",
            "Fast delivery and good packaging.",
            "Amazing product for the price.",
            "Would definitely buy again.",
        ]

        reviews = []

        for product in created_products:

            # 0-5 reviews per product
            review_count = random.randint(
                0,
                5
            )

            for _ in range(review_count):

                reviews.append(
                    Review(
                        product=product,

                        name=random.choice(
                            review_names
                        ),

                        rating=random.randint(
                            3,
                            5
                        ),

                        comment=random.choice(
                            review_comments
                        ),
                    )
                )

        Review.objects.bulk_create(
            reviews
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Reviews created: {len(reviews)}"
            )
        )

        # ============================================================
        # FINAL SUMMARY
        # ============================================================

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                "=========================================="
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                "TEST DATA CREATED SUCCESSFULLY"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                "=========================================="
            )
        )

        self.stdout.write(
            f"Categories : {Category.objects.count()}"
        )

        self.stdout.write(
            f"Products   : {Product.objects.count()}"
        )

        self.stdout.write(
            f"Images     : {ProductImage.objects.count()}"
        )

        self.stdout.write(
            f"Reviews    : {Review.objects.count()}"
        )

        self.stdout.write("")
        self.stdout.write(
            self.style.WARNING(
                "Embeddings were left NULL intentionally."
            )
        )


    # ================================================================
    # IMAGE GENERATOR
    # ================================================================

    def create_image(self, text, variant=False):
        """
        Generate a local testing image and return it as a named ContentFile.

        IMPORTANT:
        ImageField/FileField requires ContentFile to have a filename.
        """

        if Image is None:
            raise ImportError(
                "Pillow is required. Run: pip install Pillow"
            )

        width = 800
        height = 800

        backgrounds = [
            (235, 245, 255),
            (245, 240, 255),
            (240, 255, 245),
            (255, 248, 235),
            (255, 240, 245),
            (240, 250, 255),
        ]

        background = random.choice(backgrounds)

        image = Image.new(
            "RGB",
            (width, height),
            background
        )

        draw = ImageDraw.Draw(image)

        # Product card
        draw.rounded_rectangle(
            (80, 80, 720, 720),
            radius=40,
            fill=(255, 255, 255)
        )

        # Simple product visual
        draw.rounded_rectangle(
            (220, 180, 580, 450),
            radius=30,
            fill=(230, 238, 255)
        )

        # Use Arial when available; otherwise Pillow's default font.
        try:
            font_large = ImageFont.truetype(
                "arial.ttf",
                42
            )
            font_small = ImageFont.truetype(
                "arial.ttf",
                28
            )
        except Exception:
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()

        display_name = text[:28]

        draw.text(
            (400, 500),
            display_name,
            fill=(15, 23, 42),
            font=font_large,
            anchor="mm"
        )

        draw.text(
            (400, 580),
            "QuickAI",
            fill=(37, 99, 235),
            font=font_small,
            anchor="mm"
        )

        draw.text(
            (400, 630),
            "Premium Product",
            fill=(100, 116, 139),
            font=font_small,
            anchor="mm"
        )

        buffer = BytesIO()

        image.save(
            buffer,
            format="JPEG",
            quality=90
        )

        buffer.seek(0)

        # IMPORTANT:
        # Give ContentFile a filename so Django's ImageField can save it.
        safe_name = (
            text.lower()
            .replace(" ", "-")
            .replace("/", "-")
            .replace("\\", "-")
        )

        safe_name = "".join(
            char for char in safe_name
            if char.isalnum() or char in "-_"
        )

        safe_name = safe_name[:40] or "product"

        if variant:
            safe_name += "-variant"

        filename = f"{safe_name}.jpg"

        return ContentFile(
            buffer.read(),
            name=filename
        )