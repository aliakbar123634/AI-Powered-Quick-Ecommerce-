# import json
# import requests
# import re

# from app.graph.state import AgentState
# from app.core.llm import llm
# from app.core.config import settings

# from langchain_core.messages import (
#     HumanMessage,
#     ToolMessage,
#     AIMessage,
# )

# from app.tools.search_tool import (
#     search_products,
#     normalize_search_query,
# )

# from app.tools.recommendation_tool import recommend_products
# from app.tools.memory_tool import save_memory, recall_memory
# from app.tools.cart_tool import add_to_cart
# from app.tools.knowledge_tool import search_knowledge


# # ============================================================
# # RECOMMENDATION REQUEST CHECK
# # ============================================================

# def is_recommendation_request(message: str) -> bool:

#     text = message.lower().strip()

#     keywords = [
#         "recommend",
#         "recommand",
#         "recommendation",
#         "recommendations",
#         "suggest",
#         "suggestion",
#         "suggestions",
#         "best product",
#         "best products",
#         "top product",
#         "top products",
#         "products for me",
#         "give me some products",
#         "show me some products",
#     ]

#     return any(
#         keyword in text
#         for keyword in keywords
#     )


# # ============================================================
# # STOCK / AVAILABILITY FOLLOW-UP CHECK
# # ============================================================

# def is_stock_followup(message: str) -> bool:
#     """
#     Detect stock/availability questions about products
#     already discussed/recommended in the conversation.

#     IMPORTANT:
#     This only checks the latest user message.
#     """

#     text = message.lower().strip()

#     stock_phrases = [
#         "stock",
#         "in stock",
#         "out of stock",
#         "available",
#         "availability",
#         "is it available",
#         "are they available",
#         "are these available",
#         "are these products available",
#         "what is the stock",
#         "what's the stock",
#         "check the stock",
#         "check stock",
#         "product availability",
#     ]

#     reference_phrases = [
#         "these",
#         "those",
#         "them",
#         "these products",
#         "those products",
#         "recommended products",
#         "products you recommended",
#         "the products",
#     ]

#     has_stock_word = any(
#         phrase in text
#         for phrase in stock_phrases
#     )

#     has_reference = any(
#         phrase in text
#         for phrase in reference_phrases
#     )

#     return has_stock_word and has_reference


# # ============================================================
# # GET PREVIOUS RECOMMENDATION
# # ============================================================

# def get_previous_recommendation(state: AgentState):
#     """
#     Find the latest recommendation response from the
#     conversation history.

#     We do NOT call search_products here.

#     The recommendation response already contains:
#         Product
#         Price
#         Stock
#     """

#     messages = state.get("messages", [])

#     for message in reversed(messages):

#         if not isinstance(message, AIMessage):
#             continue

#         content = message.content

#         if not isinstance(content, str):
#             continue

#         if (
#             "Here are some recommendations based on your"
#             in content
#         ):
#             return content

#     return None


# # ============================================================
# # FORMAT STOCK FROM PREVIOUS RECOMMENDATION
# # ============================================================

# def format_previous_stock(recommendation_text: str):
#     """
#     Extract product names and stock information from the
#     already generated recommendation response.
#     """

#     lines = recommendation_text.splitlines()

#     products = []

#     current_product = None

#     for line in lines:

#         line = line.strip()

#         # Example:
#         # 1. Mixed Dry Fruits Pack
#         if line[:2].isdigit() and ". " in line:

#             current_product = line.split(". ", 1)[1].strip()

#         elif line.startswith("Stock:") and current_product:

#             stock_value = line.replace(
#                 "Stock:",
#                 "",
#                 1
#             ).strip()

#             products.append(
#                 f"{current_product} — {stock_value}"
#             )

#             current_product = None

#     if not products:
#         return None

#     return (
#         "Here is the current stock status of the products "
#         "I recommended:\n\n"
#         + "\n".join(
#             f"{index}. {product}"
#             for index, product in enumerate(
#                 products,
#                 start=1
#             )
#         )
#     )


# # ============================================================
# # STOCK FALLBACK SEARCH
# # ============================================================

# def get_product_names_from_recommendation(
#     recommendation_text: str
# ):
#     """
#     Extract product names from a previous recommendation.

#     This is only used when the recommendation text does not
#     already contain Stock: lines.
#     """

#     names = []

#     for line in recommendation_text.splitlines():
#         line = line.strip()

#         # Example:
#         # 1. Mixed Dry Fruits Pack
#         match = re.match(r"^\d+\.\s+(.+)$", line)

#         if match:
#             name = match.group(1).strip()

#             # Ignore non-product numbered text.
#             if name:
#                 names.append(name)

#     return names





# def get_stock_from_previous_recommendation(
#     recommendation_text: str
# ):
#     """
#     First use stock already present in the recommendation.
#     If it is missing, search each previously recommended
#     product by its exact product name.

#     IMPORTANT:
#     We never append words like 'stock' to the search query.
#     """

#     # 1. Stock is already present — use it directly.
#     existing_stock = format_previous_stock(
#         recommendation_text
#     )

#     if existing_stock:
#         return existing_stock

#     # 2. Stock is missing — recover product names.
#     product_names = get_product_names_from_recommendation(
#         recommendation_text
#     )

#     if not product_names:
#         return None

#     print("=" * 60)
#     print("STOCK FALLBACK → SEARCHING PREVIOUS PRODUCTS")
#     print("=" * 60)

#     stock_lines = []

#     for product_name in product_names[:5]:

#         print(
#             "Checking stock for:",
#             product_name
#         )

#         try:
#             result = search_products.invoke(
#                 {
#                     "query": product_name
#                 }
#             )

#             print(
#                 "Stock search result:",
#                 result
#             )

#             data = json.loads(result)

#             if isinstance(data, list) and data:

#                 # Prefer exact product-name match.
#                 product = data[0]

#                 stock = product.get("stock")

#                 if stock is True:
#                     status = "Available"
#                 elif stock is False:
#                     status = "Out of stock"
#                 else:
#                     status = "Stock information unavailable"

#                 stock_lines.append(
#                     f"{product_name} — {status}"
#                 )

#             else:
#                 stock_lines.append(
#                     f"{product_name} — Stock information unavailable"
#                 )

#         except (
#             TypeError,
#             json.JSONDecodeError,
#             requests.RequestException,
#             Exception,
#         ) as exc:

#             print(
#                 "Stock lookup failed:",
#                 exc
#             )

#             stock_lines.append(
#                 f"{product_name} — Stock information unavailable"
#             )

#     if not stock_lines:
#         return None

#     print("Returning stock information directly.")

#     response_lines = [
#         "Yes, both recommended products are currently available in stock:"
#     ]

#     for item in stock_lines:
#         response_lines.append(
#             f"- {item}"
#         )

#     return "\n".join(response_lines)


# # ============================================================
# # LLM WITH TOOLS
# # ============================================================

# llm_with_tools = llm.bind_tools(
#     [
#         search_products,
#         recommend_products,
#         add_to_cart,
#         save_memory,
#         recall_memory,
#         search_knowledge,
#     ]
# )


# # ============================================================
# # CART REQUEST CHECK
# # ============================================================

# def is_cart_request(state: AgentState) -> bool:

#     """
#     Check ONLY the latest user message.

#     Do NOT scan the complete conversation history.
#     Otherwise an old message containing "cart" or "add"
#     can incorrectly make every future message a cart request.
#     """

#     last_human_message = None

#     for message in reversed(state["messages"]):

#         if isinstance(message, HumanMessage):

#             last_human_message = message
#             break

#     if not last_human_message:
#         return False

#     text = last_human_message.content.lower().strip()

#     cart_phrases = [
#         "add to cart",
#         "add it to my cart",
#         "add this to my cart",
#         "put it in my cart",
#         "put this in my cart",
#         "add this to cart",
#         "add that to my cart",
#         "add that into my cart",
#         "add it into my cart",
#         "buy this",
#         "buy it",
#         "purchase this",
#         "purchase it",
#     ]

#     return any(
#         phrase in text
#         for phrase in cart_phrases
#     )


# # ============================================================
# # MEMORY RECALL
# # ============================================================

# def parse_memory_recall(text: str):

#     normalized = text.strip().lower()

#     if any(
#         phrase in normalized
#         for phrase in (
#             "what is my",
#             "what's my",
#             "do you remember",
#             "tell me my",
#             "what do you remember",
#         )
#     ):

#         if "favorite category" in normalized:
#             return "favorite_category"

#         if "favorite brand" in normalized:
#             return "favorite_brand"

#         if "budget" in normalized:
#             return "budget"

#     return None


# # ============================================================
# # KNOWLEDGE / POLICY REQUEST CHECK
# # ============================================================

# def is_knowledge_request(message: str) -> bool:

#     text = message.lower().strip()

#     knowledge_phrases = [
#         "return policy",
#         "refund policy",
#         "shipping policy",
#         "privacy policy",
#         "terms and conditions",
#         "terms of service",
#         "store policy",
#         "store policies",
#         "knowledge base",
#         "return",
#         "refund",
#         "shipping",
#         "privacy",
#         "how many days do i have to return",
#         "how long can i return",
#         "can i return",
#         "can i get a refund",
#         "refund method",
#         "restocking fee",
#     ]

#     return any(
#         phrase in text
#         for phrase in knowledge_phrases
#     )




# # ============================================================
# # DIRECT SEARCH FALLBACK
# # ============================================================

# def _direct_search_fallback(query: str):

#     try:

#         response = requests.get(
#             f"{settings.BACKEND_BASE_URL}/api/products/products/",
#             params={
#                 "search": query
#             },
#             timeout=10,
#         )

#         response.raise_for_status()

#         data = response.json()

#         if isinstance(data, dict):

#             results = data.get("results") or []

#         elif isinstance(data, list):

#             results = data

#         else:

#             results = []

#         if not results:

#             return "No products found."

#         formatted = []

#         for item in results[:3]:

#             price = (
#                 item.get("discount_price")
#                 or item.get("price")
#                 or "N/A"
#             )

#             formatted.append(
#                 f"- {item.get('name')} | "
#                 f"Brand: {item.get('brand')} | "
#                 f"Price: {price}"
#             )

#         return (
#             "Here are some matching products:\n"
#             + "\n".join(formatted)
#         )

#     except requests.RequestException as exc:

#         print(
#             f"Direct fallback search failed: {exc}"
#         )

#         return "I couldn't fetch products right now."


# # ============================================================
# # FORMAT RECOMMENDATIONS FOR THE USER
# # ============================================================

# def _format_recommendation_response(
#     recommendation_result: str,
#     basis: str,
#     preference: str
# ) -> str:

#     """
#     Convert recommendation tool JSON into a clean
#     user-facing response.
#     """

#     try:

#         data = json.loads(
#             recommendation_result
#         )

#     except (
#         TypeError,
#         json.JSONDecodeError
#     ):

#         return str(
#             recommendation_result
#         )

#     if not isinstance(data, list) or not data:

#         return (
#             f"I couldn't find any matching recommendations "
#             f"based on your {basis} ({preference})."
#         )

#     lines = [
#         f"Here are some recommendations based on your "
#         f"{basis} ({preference}):",
#         "",
#     ]

#     for index, item in enumerate(
#         data[:5],
#         start=1
#     ):

#         name = (
#             item.get("name")
#             or "Unnamed product"
#         )

#         brand = item.get("brand")

#         price = item.get("price")

#         discount_price = item.get(
#             "discount_price"
#         )

#         rating = item.get("rating")

#         stock = item.get("stock")

#         if (
#             discount_price
#             and price
#             and str(discount_price) != str(price)
#         ):

#             price_text = (
#                 f"${discount_price} "
#                 f"(originally ${price})"
#             )

#         elif discount_price:

#             price_text = (
#                 f"${discount_price}"
#             )

#         elif price:

#             price_text = (
#                 f"${price}"
#             )

#         else:

#             price_text = (
#                 "Price unavailable"
#             )

#         lines.append(
#             f"{index}. {name}"
#         )

#         if brand and brand != name:

#             lines.append(
#                 f"   Brand: {brand}"
#             )

#         lines.append(
#             f"   Price: {price_text}"
#         )

#         if rating is not None:

#             lines.append(
#                 f"   Rating: {rating}"
#             )

#         if stock is not None:

#             lines.append(
#                 f"   Stock: "
#                 f"{'Available' if stock else 'Out of stock'}"
#             )

#         lines.append("")

#     lines.append(
#         "Would you like me to add one of these to your cart?"
#     )

#     return "\n".join(lines)


# # ============================================================
# # SHOPPING AGENT
# # ============================================================

# def shopping_agent(state: AgentState):

#     print("=" * 80)
#     print("SHOPPING AGENT")
#     print("=" * 80)

#     for i, message in enumerate(
#         state["messages"]
#     ):

#         print(i)
#         print(type(message))
#         print(message)
#         print()

#     print("=" * 80)

#     last_message = state["messages"][-1]


#     # ========================================================
#     # 1. AUTOMATIC MEMORY EXTRACTION RESULT
#     # ========================================================

#     memory_result = state.get(
#         "memory_result"
#     )

#     if memory_result:

#         print("=" * 60)
#         print("MEMORY RESULT")
#         print(memory_result)
#         print("=" * 60)

#         if (
#             memory_result.should_save
#             and memory_result.key
#             and memory_result.value
#         ):

#             print("=" * 60)
#             print("SAVING AUTOMATIC MEMORY")
#             print("=" * 60)

#             save_result = save_memory.invoke(
#                 {
#                     "key": memory_result.key,
#                     "value": memory_result.value,
#                     "token": state.get(
#                         "access_token",
#                         ""
#                     ),
#                 }
#             )

#             print(
#                 "Memory save result:"
#             )

#             print(save_result)

#             print("=" * 60)

#         memory_result = None


#     # ========================================================
#     # 2. MEMORY RECALL
#     # ========================================================

#     if isinstance(
#         last_message,
#         HumanMessage
#     ):

#         recall_key = parse_memory_recall(
#             last_message.content
#         )

#         if recall_key:

#             print("=" * 60)
#             print("MEMORY RECALL")
#             print(
#                 "Key:",
#                 recall_key
#             )
#             print("=" * 60)

#             recall_result = recall_memory.invoke(
#                 {
#                     "key": recall_key,
#                     "token": state.get(
#                         "access_token",
#                         ""
#                     ),
#                 }
#             )

#             print(
#                 "Recall result:"
#             )

#             print(recall_result)

#             if isinstance(
#                 recall_result,
#                 dict
#             ):

#                 value = recall_result.get(
#                     "value"
#                 )

#                 if value:

#                     return {
#                         "messages": [
#                             HumanMessage(
#                                 content=(
#                                     f"I remember that your "
#                                     f"{recall_key.replace('_', ' ')} "
#                                     f"is {value}."
#                                 )
#                             )
#                         ],
#                         "memory_result": None,
#                     }

#             return {
#                 "messages": [
#                     HumanMessage(
#                         content=(
#                             "I don't have that information "
#                             "saved yet."
#                         )
#                     )
#                 ],
#                 "memory_result": None,
#             }


#     # ========================================================
#     # 3. STOCK / AVAILABILITY FOLLOW-UP
#     # ========================================================

#     if (
#         isinstance(
#             last_message,
#             HumanMessage
#         )
#         and is_stock_followup(
#             last_message.content
#         )
#     ):

#         print("=" * 60)
#         print("STOCK / AVAILABILITY FOLLOW-UP")
#         print("=" * 60)

#         previous_recommendation = (
#             get_previous_recommendation(
#                 state
#             )
#         )

#         if previous_recommendation:

#             stock_response = (
#                 get_stock_from_previous_recommendation(
#                     previous_recommendation
#                 )
#             )

#             if stock_response:

#                 print(
#                     "Returning stock information directly."
#                 )

#                 return {
#                     "messages": [
#                         AIMessage(
#                             content=stock_response
#                         )
#                     ],
#                     "memory_result": None,
#                 }

#         # Do NOT fall through to the normal LLM tool loop.
#         # If we cannot identify the previous products, give a
#         # deterministic answer instead of letting the LLM invent
#         # queries such as '<product> stock'.
#         print(
#             "Could not identify previous recommended products."
#         )

#         return {
#             "messages": [
#                 AIMessage(
#                     content=(
#                         "I couldn't identify the products "
#                         "you are referring to. Please mention "
#                         "the product names and I'll check their "
#                         "current stock."
#                     )
#                 )
#             ],
#             "memory_result": None,
#         }


#     # ========================================================
#     # 4. DIRECT PRODUCT SEARCH
#     # ========================================================

#     if (
#         isinstance(
#             last_message,
#             HumanMessage
#         )
#         and not is_recommendation_request(
#             last_message.content
#         )
#         and not is_cart_request(
#             state
#         )
#         and not is_stock_followup(
#             last_message.content
#         )
#     ):

#         user_query = (
#             last_message.content.lower()
#         )

#         search_words = [
#             "do you have",
#             "do you sell",
#             "is there",
#             "are there",
#             "find",
#             "search",
#             "show me",
#             "product",
#             "price",
#         ]

#         if any(
#             word in user_query
#             for word in search_words
#         ):

#             print("=" * 60)
#             print("DIRECT PRODUCT SEARCH")
#             print("=" * 60)

#             search_result = search_products.invoke(
#                 {
#                     "query":
#                         last_message.content
#                 }
#             )

#             print(
#                 "Search result:"
#             )

#             print(
#                 search_result
#             )

#             return {
#                 "messages": [
#                     AIMessage(
#                         content="",
#                         tool_calls=[
#                             {
#                                 "name":
#                                     "search_products",
#                                 "args": {
#                                     "query":
#                                         normalize_search_query(
#                                             last_message.content
#                                         )
#                                 },
#                                 "id":
#                                     "direct_search_1",
#                                 "type":
#                                     "tool_call",
#                             }
#                         ],
#                     ),

#                     ToolMessage(
#                         content=search_result,
#                         tool_call_id=
#                             "direct_search_1",
#                         name=
#                             "search_products",
#                     ),
#                 ],

#                 "memory_result":
#                     None,
#             }


#     # ========================================================
#     # 5. RECOMMENDATION FLOW
#     # ========================================================

#     if (
#         isinstance(
#             last_message,
#             HumanMessage
#         )
#         and is_recommendation_request(
#             last_message.content
#         )
#     ):

#         print("=" * 60)
#         print("RECOMMENDATION FLOW")
#         print("=" * 60)

#         token = state.get(
#             "access_token",
#             ""
#         )


#         # ----------------------------------------------------
#         # STEP 1: Try favorite category
#         # ----------------------------------------------------

#         category_result = (
#             recall_memory.invoke(
#                 {
#                     "key":
#                         "favorite_category",
#                     "token":
#                         token,
#                 }
#             )
#         )

#         print(
#             "Favorite category result:"
#         )

#         print(
#             category_result
#         )

#         category = None

#         if isinstance(
#             category_result,
#             dict
#         ):

#             category = (
#                 category_result.get(
#                     "value"
#                 )
#             )


#         # ----------------------------------------------------
#         # STEP 2: Category exists
#         # ----------------------------------------------------

#         if category:

#             print(
#                 "Using favorite category:",
#                 category
#             )

#             recommendation_result = (
#                 recommend_products.invoke(
#                     {
#                         "query":
#                             category,
#                         "search_type":
#                             "category",
#                     }
#                 )
#             )

#             print(
#                 "Recommendation result:"
#             )

#             print(
#                 recommendation_result
#             )

#             formatted_response = (
#                 _format_recommendation_response(
#                     recommendation_result=
#                         recommendation_result,
#                     basis=
#                         "favorite category",
#                     preference=
#                         category,
#                 )
#             )

#             return {
#                 "messages": [
#                     AIMessage(
#                         content=
#                             formatted_response
#                     )
#                 ],
#                 "memory_result":
#                     None,
#             }


#         # ----------------------------------------------------
#         # STEP 3: No category → try favorite product
#         # ----------------------------------------------------

#         product_result = (
#             recall_memory.invoke(
#                 {
#                     "key":
#                         "favorite_product",
#                     "token":
#                         token,
#                 }
#             )
#         )

#         print(
#             "Favorite product result:"
#         )

#         print(
#             product_result
#         )

#         favorite_product = None

#         if isinstance(
#             product_result,
#             dict
#         ):

#             favorite_product = (
#                 product_result.get(
#                     "value"
#                 )
#             )


#         # ----------------------------------------------------
#         # STEP 4: Favorite product exists
#         # ----------------------------------------------------

#         if favorite_product:

#             print(
#                 "Using favorite product:",
#                 favorite_product
#             )

#             recommendation_result = (
#                 recommend_products.invoke(
#                     {
#                         "query":
#                             favorite_product,
#                         "search_type":
#                             "product",
#                     }
#                 )
#             )

#             print(
#                 "Recommendation result:"
#             )

#             print(
#                 recommendation_result
#             )

#             formatted_response = (
#                 _format_recommendation_response(
#                     recommendation_result=
#                         recommendation_result,
#                     basis=
#                         "favorite product",
#                     preference=
#                         favorite_product,
#                 )
#             )

#             return {
#                 "messages": [
#                     AIMessage(
#                         content=
#                             formatted_response
#                     )
#                 ],
#                 "memory_result":
#                     None,
#             }


#         # ----------------------------------------------------
#         # STEP 5: Nothing saved
#         # ----------------------------------------------------

#         return {
#             "messages": [
#                 HumanMessage(
#                     content=(
#                         "I don't have a favorite "
#                         "category or favorite product "
#                         "saved for you yet. "
#                         "Please tell me what type of "
#                         "products you're interested in."
#                     )
#                 )
#             ],
#             "memory_result":
#                 None,
#         }


#     # ========================================================
#     # 6. CART FLOW
#     # ========================================================

#     # --------------------------------------------------------
#     # FIRST STEP:
#     # User asks to add something to cart.
#     #
#     # ONLY search_products is available.
#     # --------------------------------------------------------

#     if (
#         is_cart_request(state)
#         and isinstance(
#             last_message,
#             HumanMessage
#         )
#     ):

#         print("=" * 60)
#         print(
#             "CART REQUEST → SEARCH PRODUCT"
#         )
#         print("=" * 60)

#         active_llm = llm.bind_tools(
#             [
#                 search_products
#             ],
#             tool_choice=
#                 "search_products"
#         )


#     # --------------------------------------------------------
#     # SECOND STEP:
#     # search_products completed.
#     #
#     # ONLY add_to_cart is available.
#     # --------------------------------------------------------

#     elif (
#         is_cart_request(state)
#         and isinstance(
#             last_message,
#             ToolMessage
#         )
#         and last_message.name ==
#             "search_products"
#     ):

#         print("=" * 60)
#         print(
#             "PRODUCT SEARCH COMPLETE → "
#             "ADD TO CART"
#         )
#         print("=" * 60)

#         active_llm = llm.bind_tools(
#             [
#                 add_to_cart
#             ],
#             tool_choice=
#                 "add_to_cart"
#         )


#     # --------------------------------------------------------
#     # THIRD STEP:
#     # add_to_cart completed.
#     #
#     # IMPORTANT:
#     # NO TOOLS HERE.
#     #
#     # This prevents:
#     #
#     # add_to_cart
#     #      ↓
#     # search_products
#     #      ↓
#     # add_to_cart
#     #      ↓
#     # LOOP
#     # --------------------------------------------------------

#     elif (
#         isinstance(
#             last_message,
#             ToolMessage
#         )
#         and last_message.name ==
#             "add_to_cart"
#     ):

#         print("=" * 60)
#         print(
#             "ADD TO CART COMPLETED"
#         )
#         print(
#             "STOPPING TOOL LOOP"
#         )
#         print("=" * 60)

#         active_llm = llm


#     # --------------------------------------------------------
#     # RECOMMENDATION COMPLETED
#     #
#     # Do not give the LLM tools again.
#     # --------------------------------------------------------

#     elif (
#         isinstance(
#             last_message,
#             ToolMessage
#         )
#         and last_message.name ==
#             "recommend_products"
#     ):

#         print("=" * 60)
#         print(
#             "RECOMMENDATION COMPLETED"
#         )
#         print(
#             "STOPPING TOOL LOOP"
#         )
#         print("=" * 60)

#         active_llm = llm


#     # --------------------------------------------------------
#     # NORMAL SHOPPING FLOW
#     # --------------------------------------------------------

#     else:

#         active_llm = llm_with_tools


#     # ========================================================
#     # 7. CALL LLM
#     # ========================================================

#     print("=" * 80)
#     print(
#         "CALLING LLM"
#     )
#     print("=" * 80)

#     try:

#         response = active_llm.invoke(
#             state["messages"]
#         )

#     except Exception as exc:

#         print(
#             f"LLM invocation failed: {exc}"
#         )

#         # ====================================================
#         # SEARCH FALLBACK
#         # ====================================================

#         if (
#             isinstance(
#                 last_message,
#                 ToolMessage
#             )
#             and last_message.name ==
#                 "search_products"
#         ):

#             try:

#                 tool_payload = json.loads(
#                     last_message.content
#                 )

#                 if tool_payload:

#                     first = tool_payload[0]

#                     summary = (
#                         f"I found "
#                         f"{first['name']} "
#                         f"for "
#                         f"{first['price']} "
#                         f"(brand: "
#                         f"{first['brand']}, "
#                         f"stock: "
#                         f"{'available' if first.get('stock') else 'out of stock'})."
#                     )

#                     return {
#                         "messages": [
#                             HumanMessage(
#                                 content=
#                                     summary
#                             )
#                         ],
#                         "memory_result":
#                             None,
#                     }

#             except Exception as fallback_error:

#                 print(
#                     "Fallback parsing failed:",
#                     fallback_error
#                 )


#         # ====================================================
#         # CART FAILURE FALLBACK
#         # ====================================================

#         if (
#             isinstance(
#                 last_message,
#                 ToolMessage
#             )
#             and last_message.name ==
#                 "add_to_cart"
#         ):

#             return {
#                 "messages": [
#                     HumanMessage(
#                         content=(
#                             "Sorry, I couldn't add "
#                             "the product to your cart."
#                         )
#                     )
#                 ],
#                 "memory_result":
#                     None,
#             }


#         # ====================================================
#         # GENERAL FALLBACK
#         # ====================================================

#         return {
#             "messages": [
#                 HumanMessage(
#                     content=
#                         _direct_search_fallback(
#                             last_message.content
#                         )
#                 )
#             ],
#             "memory_result":
#                 None,
#         }


#     # ========================================================
#     # 8. DEBUG
#     # ========================================================

#     print("=" * 50)
#     print(
#         "LLM RESPONSE"
#     )
#     print(response)
#     print("=" * 50)

#     print(
#         "Tool Calls:",
#         getattr(
#             response,
#             "tool_calls",
#             []
#         )
#     )


#     # ========================================================
#     # 9. RETURN
#     # ========================================================

#     return {
#         "messages": [
#             response
#         ],
#         "memory_result":
#             None,
#     }




import json
import requests
import re

from app.graph.state import AgentState
from app.core.llm import llm
from app.core.config import settings

from langchain_core.messages import (
    HumanMessage,
    ToolMessage,
    AIMessage,
)

from app.tools.search_tool import (
    search_products,
    normalize_search_query,
)

from app.tools.recommendation_tool import recommend_products
from app.tools.memory_tool import save_memory, recall_memory
from app.tools.cart_tool import add_to_cart
from app.tools.knowledge_tool import search_knowledge


# ============================================================
# RECOMMENDATION REQUEST CHECK
# ============================================================

def is_recommendation_request(message: str) -> bool:

    text = message.lower().strip()

    keywords = [
        "recommend",
        "recommand",
        "recommendation",
        "recommendations",
        "suggest",
        "suggestion",
        "suggestions",
        "best product",
        "best products",
        "top product",
        "top products",
        "products for me",
        "give me some products",
        "show me some products",
    ]

    return any(
        keyword in text
        for keyword in keywords
    )


# ============================================================
# STOCK / AVAILABILITY FOLLOW-UP CHECK
# ============================================================

def is_stock_followup(message: str) -> bool:
    """
    Detect stock/availability questions about products
    already discussed/recommended in the conversation.

    IMPORTANT:
    This only checks the latest user message.
    """

    text = message.lower().strip()

    stock_phrases = [
        "stock",
        "in stock",
        "out of stock",
        "available",
        "availability",
        "is it available",
        "are they available",
        "are these available",
        "are these products available",
        "what is the stock",
        "what's the stock",
        "check the stock",
        "check stock",
        "product availability",
    ]

    reference_phrases = [
        "these",
        "those",
        "them",
        "these products",
        "those products",
        "recommended products",
        "products you recommended",
        "the products",
    ]

    has_stock_word = any(
        phrase in text
        for phrase in stock_phrases
    )

    has_reference = any(
        phrase in text
        for phrase in reference_phrases
    )

    return has_stock_word and has_reference


# ============================================================
# GET PREVIOUS RECOMMENDATION
# ============================================================

def get_previous_recommendation(state: AgentState):
    """
    Find the latest recommendation response from the
    conversation history.

    We do NOT call search_products here.

    The recommendation response already contains:
        Product
        Price
        Stock
    """

    messages = state.get("messages", [])

    for message in reversed(messages):

        if not isinstance(message, AIMessage):
            continue

        content = message.content

        if not isinstance(content, str):
            continue

        if (
            "Here are some recommendations based on your"
            in content
        ):
            return content

    return None


# ============================================================
# FORMAT STOCK FROM PREVIOUS RECOMMENDATION
# ============================================================

def format_previous_stock(recommendation_text: str):
    """
    Extract product names and stock information from the
    already generated recommendation response.
    """

    lines = recommendation_text.splitlines()

    products = []

    current_product = None

    for line in lines:

        line = line.strip()

        # Example:
        # 1. Mixed Dry Fruits Pack
        if line[:2].isdigit() and ". " in line:

            current_product = line.split(". ", 1)[1].strip()

        elif line.startswith("Stock:") and current_product:

            stock_value = line.replace(
                "Stock:",
                "",
                1
            ).strip()

            products.append(
                f"{current_product} — {stock_value}"
            )

            current_product = None

    if not products:
        return None

    return (
        "Here is the current stock status of the products "
        "I recommended:\n\n"
        + "\n".join(
            f"{index}. {product}"
            for index, product in enumerate(
                products,
                start=1
            )
        )
    )


# ============================================================
# STOCK FALLBACK SEARCH
# ============================================================

def get_product_names_from_recommendation(
    recommendation_text: str
):
    """
    Extract product names from a previous recommendation.

    This is only used when the recommendation text does not
    already contain Stock: lines.
    """

    names = []

    for line in recommendation_text.splitlines():
        line = line.strip()

        # Example:
        # 1. Mixed Dry Fruits Pack
        match = re.match(r"^\d+\.\s+(.+)$", line)

        if match:
            name = match.group(1).strip()

            # Ignore non-product numbered text.
            if name:
                names.append(name)

    return names





def get_stock_from_previous_recommendation(
    recommendation_text: str
):
    """
    First use stock already present in the recommendation.
    If it is missing, search each previously recommended
    product by its exact product name.

    IMPORTANT:
    We never append words like 'stock' to the search query.
    """

    # 1. Stock is already present — use it directly.
    existing_stock = format_previous_stock(
        recommendation_text
    )

    if existing_stock:
        return existing_stock

    # 2. Stock is missing — recover product names.
    product_names = get_product_names_from_recommendation(
        recommendation_text
    )

    if not product_names:
        return None

    print("=" * 60)
    print("STOCK FALLBACK → SEARCHING PREVIOUS PRODUCTS")
    print("=" * 60)

    stock_lines = []

    for product_name in product_names[:5]:

        print(
            "Checking stock for:",
            product_name
        )

        try:
            result = search_products.invoke(
                {
                    "query": product_name
                }
            )

            print(
                "Stock search result:",
                result
            )

            data = json.loads(result)

            if isinstance(data, list) and data:

                # Prefer exact product-name match.
                product = data[0]

                stock = product.get("stock")

                if stock is True:
                    status = "Available"
                elif stock is False:
                    status = "Out of stock"
                else:
                    status = "Stock information unavailable"

                stock_lines.append(
                    f"{product_name} — {status}"
                )

            else:
                stock_lines.append(
                    f"{product_name} — Stock information unavailable"
                )

        except (
            TypeError,
            json.JSONDecodeError,
            requests.RequestException,
            Exception,
        ) as exc:

            print(
                "Stock lookup failed:",
                exc
            )

            stock_lines.append(
                f"{product_name} — Stock information unavailable"
            )

    if not stock_lines:
        return None

    print("Returning stock information directly.")

    response_lines = [
        "Yes, both recommended products are currently available in stock:"
    ]

    for item in stock_lines:
        response_lines.append(
            f"- {item}"
        )

    return "\n".join(response_lines)


# ============================================================
# LLM WITH TOOLS
# ============================================================

llm_with_tools = llm.bind_tools(
    [
        search_products,
        recommend_products,
        add_to_cart,
        save_memory,
        recall_memory,
        search_knowledge,
    ]
)


# ============================================================
# CART REQUEST CHECK
# ============================================================

def is_cart_request(state: AgentState) -> bool:

    """
    Check ONLY the latest user message.

    Do NOT scan the complete conversation history.
    Otherwise an old message containing "cart" or "add"
    can incorrectly make every future message a cart request.
    """

    last_human_message = None

    for message in reversed(state["messages"]):

        if isinstance(message, HumanMessage):

            last_human_message = message
            break

    if not last_human_message:
        return False

    text = last_human_message.content.lower().strip()

    cart_phrases = [
        "add to cart",
        "add it to my cart",
        "add this to my cart",
        "put it in my cart",
        "put this in my cart",
        "add this to cart",
        "add that to my cart",
        "add that into my cart",
        "add it into my cart",
        "buy this",
        "buy it",
        "purchase this",
        "purchase it",
    ]

    return any(
        phrase in text
        for phrase in cart_phrases
    )


# ============================================================
# MEMORY RECALL
# ============================================================

def parse_memory_recall(text: str):

    normalized = text.strip().lower()

    if any(
        phrase in normalized
        for phrase in (
            "what is my",
            "what's my",
            "do you remember",
            "tell me my",
            "what do you remember",
        )
    ):

        if "favorite category" in normalized:
            return "favorite_category"

        if "favorite brand" in normalized:
            return "favorite_brand"

        if "budget" in normalized:
            return "budget"

    return None


# ============================================================
# KNOWLEDGE / POLICY REQUEST CHECK
# ============================================================

def is_knowledge_request(message: str) -> bool:

    text = message.lower().strip()

    knowledge_phrases = [
        "return policy",
        "refund policy",
        "shipping policy",
        "privacy policy",
        "terms and conditions",
        "terms of service",
        "store policy",
        "store policies",
        "knowledge base",
        "return",
        "refund",
        "shipping",
        "privacy",
        "how many days do i have to return",
        "how long can i return",
        "can i return",
        "can i get a refund",
        "refund method",
        "restocking fee",
    ]

    return any(
        phrase in text
        for phrase in knowledge_phrases
    )




# ============================================================
# DIRECT SEARCH FALLBACK
# ============================================================

def _direct_search_fallback(query: str):

    try:

        response = requests.get(
            f"{settings.BACKEND_BASE_URL}/api/products/products/",
            params={
                "search": query
            },
            timeout=10,
        )

        response.raise_for_status()

        data = response.json()

        if isinstance(data, dict):

            results = data.get("results") or []

        elif isinstance(data, list):

            results = data

        else:

            results = []

        if not results:

            return "No products found."

        formatted = []

        for item in results[:3]:

            price = (
                item.get("discount_price")
                or item.get("price")
                or "N/A"
            )

            formatted.append(
                f"- {item.get('name')} | "
                f"Brand: {item.get('brand')} | "
                f"Price: {price}"
            )

        return (
            "Here are some matching products:\n"
            + "\n".join(formatted)
        )

    except requests.RequestException as exc:

        print(
            f"Direct fallback search failed: {exc}"
        )

        return "I couldn't fetch products right now."


# ============================================================
# FORMAT RECOMMENDATIONS FOR THE USER
# ============================================================

def _format_recommendation_response(
    recommendation_result: str,
    basis: str,
    preference: str
) -> str:

    """
    Convert recommendation tool JSON into a clean
    user-facing response.
    """

    try:

        data = json.loads(
            recommendation_result
        )

    except (
        TypeError,
        json.JSONDecodeError
    ):

        return str(
            recommendation_result
        )

    if not isinstance(data, list) or not data:

        return (
            f"I couldn't find any matching recommendations "
            f"based on your {basis} ({preference})."
        )

    lines = [
        f"Here are some recommendations based on your "
        f"{basis} ({preference}):",
        "",
    ]

    for index, item in enumerate(
        data[:5],
        start=1
    ):

        name = (
            item.get("name")
            or "Unnamed product"
        )

        brand = item.get("brand")

        price = item.get("price")

        discount_price = item.get(
            "discount_price"
        )

        rating = item.get("rating")

        stock = item.get("stock")

        if (
            discount_price
            and price
            and str(discount_price) != str(price)
        ):

            price_text = (
                f"${discount_price} "
                f"(originally ${price})"
            )

        elif discount_price:

            price_text = (
                f"${discount_price}"
            )

        elif price:

            price_text = (
                f"${price}"
            )

        else:

            price_text = (
                "Price unavailable"
            )

        lines.append(
            f"{index}. {name}"
        )

        if brand and brand != name:

            lines.append(
                f"   Brand: {brand}"
            )

        lines.append(
            f"   Price: {price_text}"
        )

        if rating is not None:

            lines.append(
                f"   Rating: {rating}"
            )

        if stock is not None:

            lines.append(
                f"   Stock: "
                f"{'Available' if stock else 'Out of stock'}"
            )

        lines.append("")

    lines.append(
        "Would you like me to add one of these to your cart?"
    )

    return "\n".join(lines)


# ============================================================
# SHOPPING AGENT
# ============================================================

def shopping_agent(state: AgentState):

    print("=" * 80)
    print("SHOPPING AGENT")
    print("=" * 80)

    for i, message in enumerate(
        state["messages"]
    ):

        print(i)
        print(type(message))
        print(message)
        print()

    print("=" * 80)

    last_message = state["messages"][-1]


    # ========================================================
    # 1. AUTOMATIC MEMORY EXTRACTION RESULT
    # ========================================================

    memory_result = state.get(
        "memory_result"
    )

    if memory_result:

        print("=" * 60)
        print("MEMORY RESULT")
        print(memory_result)
        print("=" * 60)

        if (
            memory_result.should_save
            and memory_result.key
            and memory_result.value
        ):

            print("=" * 60)
            print("SAVING AUTOMATIC MEMORY")
            print("=" * 60)

            save_result = save_memory.invoke(
                {
                    "key": memory_result.key,
                    "value": memory_result.value,
                    "token": state.get(
                        "access_token",
                        ""
                    ),
                }
            )

            print(
                "Memory save result:"
            )

            print(save_result)

            print("=" * 60)

        memory_result = None


    # ========================================================
    # 2. MEMORY RECALL
    # ========================================================

    if isinstance(
        last_message,
        HumanMessage
    ):

        recall_key = parse_memory_recall(
            last_message.content
        )

        if recall_key:

            print("=" * 60)
            print("MEMORY RECALL")
            print(
                "Key:",
                recall_key
            )
            print("=" * 60)

            recall_result = recall_memory.invoke(
                {
                    "key": recall_key,
                    "token": state.get(
                        "access_token",
                        ""
                    ),
                }
            )

            print(
                "Recall result:"
            )

            print(recall_result)

            if isinstance(
                recall_result,
                dict
            ):

                value = recall_result.get(
                    "value"
                )

                if value:

                    return {
                        "messages": [
                            HumanMessage(
                                content=(
                                    f"I remember that your "
                                    f"{recall_key.replace('_', ' ')} "
                                    f"is {value}."
                                )
                            )
                        ],
                        "memory_result": None,
                    }

            return {
                "messages": [
                    HumanMessage(
                        content=(
                            "I don't have that information "
                            "saved yet."
                        )
                    )
                ],
                "memory_result": None,
            }


    # ========================================================
    # 3. STOCK / AVAILABILITY FOLLOW-UP
    # ========================================================

    if (
        isinstance(
            last_message,
            HumanMessage
        )
        and is_stock_followup(
            last_message.content
        )
    ):

        print("=" * 60)
        print("STOCK / AVAILABILITY FOLLOW-UP")
        print("=" * 60)

        previous_recommendation = (
            get_previous_recommendation(
                state
            )
        )

        if previous_recommendation:

            stock_response = (
                get_stock_from_previous_recommendation(
                    previous_recommendation
                )
            )

            if stock_response:

                print(
                    "Returning stock information directly."
                )

                return {
                    "messages": [
                        AIMessage(
                            content=stock_response
                        )
                    ],
                    "memory_result": None,
                }

        # Do NOT fall through to the normal LLM tool loop.
        # If we cannot identify the previous products, give a
        # deterministic answer instead of letting the LLM invent
        # queries such as '<product> stock'.
        print(
            "Could not identify previous recommended products."
        )

        return {
            "messages": [
                AIMessage(
                    content=(
                        "I couldn't identify the products "
                        "you are referring to. Please mention "
                        "the product names and I'll check their "
                        "current stock."
                    )
                )
            ],
            "memory_result": None,
        }


    # ========================================================
    # 4. KNOWLEDGE / POLICY FLOW
    # ========================================================

    if (
        isinstance(last_message, HumanMessage)
        and is_knowledge_request(last_message.content)
    ):

        print("=" * 60)
        print("KNOWLEDGE FLOW")
        print("=" * 60)

        knowledge_result = search_knowledge.invoke(
            {
                "query": last_message.content
            }
        )

        print("=" * 60)
        print("KNOWLEDGE RESULT")
        print("=" * 60)

        print(knowledge_result)

        return {
            "messages": [
                AIMessage(
                    content="",
                    tool_calls=[
                        {
                            "name": "search_knowledge",
                            "args": {
                                "query": last_message.content
                            },
                            "id": "knowledge_search_1",
                            "type": "tool_call",
                        }
                    ],
                ),
                ToolMessage(
                    content=knowledge_result,
                    tool_call_id="knowledge_search_1",
                    name="search_knowledge",
                ),
            ],
            "memory_result": None,
        }


    # ========================================================
    # 5. DIRECT PRODUCT SEARCH
    # ========================================================

    if (
        isinstance(
            last_message,
            HumanMessage
        )
        and not is_recommendation_request(
            last_message.content
        )
        and not is_cart_request(
            state
        )
        and not is_stock_followup(
            last_message.content
        )
    ):

        user_query = (
            last_message.content.lower()
        )

        search_words = [
            "do you have",
            "do you sell",
            "is there",
            "are there",
            "find",
            "search",
            "show me",
            "product",
            "price",
        ]

        if any(
            word in user_query
            for word in search_words
        ):

            print("=" * 60)
            print("DIRECT PRODUCT SEARCH")
            print("=" * 60)

            search_result = search_products.invoke(
                {
                    "query":
                        last_message.content
                }
            )

            print(
                "Search result:"
            )

            print(
                search_result
            )

            return {
                "messages": [
                    AIMessage(
                        content="",
                        tool_calls=[
                            {
                                "name":
                                    "search_products",
                                "args": {
                                    "query":
                                        normalize_search_query(
                                            last_message.content
                                        )
                                },
                                "id":
                                    "direct_search_1",
                                "type":
                                    "tool_call",
                            }
                        ],
                    ),

                    ToolMessage(
                        content=search_result,
                        tool_call_id=
                            "direct_search_1",
                        name=
                            "search_products",
                    ),
                ],

                "memory_result":
                    None,
            }


    # ========================================================
    # 6. RECOMMENDATION FLOW
    # ========================================================

    if (
        isinstance(
            last_message,
            HumanMessage
        )
        and is_recommendation_request(
            last_message.content
        )
    ):

        print("=" * 60)
        print("RECOMMENDATION FLOW")
        print("=" * 60)

        token = state.get(
            "access_token",
            ""
        )


        # ----------------------------------------------------
        # STEP 1: Try favorite category
        # ----------------------------------------------------

        category_result = (
            recall_memory.invoke(
                {
                    "key":
                        "favorite_category",
                    "token":
                        token,
                }
            )
        )

        print(
            "Favorite category result:"
        )

        print(
            category_result
        )

        category = None

        if isinstance(
            category_result,
            dict
        ):

            category = (
                category_result.get(
                    "value"
                )
            )


        # ----------------------------------------------------
        # STEP 2: Category exists
        # ----------------------------------------------------

        if category:

            print(
                "Using favorite category:",
                category
            )

            recommendation_result = (
                recommend_products.invoke(
                    {
                        "query":
                            category,
                        "search_type":
                            "category",
                    }
                )
            )

            print(
                "Recommendation result:"
            )

            print(
                recommendation_result
            )

            formatted_response = (
                _format_recommendation_response(
                    recommendation_result=
                        recommendation_result,
                    basis=
                        "favorite category",
                    preference=
                        category,
                )
            )

            return {
                "messages": [
                    AIMessage(
                        content=
                            formatted_response
                    )
                ],
                "memory_result":
                    None,
            }


        # ----------------------------------------------------
        # STEP 3: No category → try favorite product
        # ----------------------------------------------------

        product_result = (
            recall_memory.invoke(
                {
                    "key":
                        "favorite_product",
                    "token":
                        token,
                }
            )
        )

        print(
            "Favorite product result:"
        )

        print(
            product_result
        )

        favorite_product = None

        if isinstance(
            product_result,
            dict
        ):

            favorite_product = (
                product_result.get(
                    "value"
                )
            )


        # ----------------------------------------------------
        # STEP 4: Favorite product exists
        # ----------------------------------------------------

        if favorite_product:

            print(
                "Using favorite product:",
                favorite_product
            )

            recommendation_result = (
                recommend_products.invoke(
                    {
                        "query":
                            favorite_product,
                        "search_type":
                            "product",
                    }
                )
            )

            print(
                "Recommendation result:"
            )

            print(
                recommendation_result
            )

            formatted_response = (
                _format_recommendation_response(
                    recommendation_result=
                        recommendation_result,
                    basis=
                        "favorite product",
                    preference=
                        favorite_product,
                )
            )

            return {
                "messages": [
                    AIMessage(
                        content=
                            formatted_response
                    )
                ],
                "memory_result":
                    None,
            }


        # ----------------------------------------------------
        # STEP 5: Nothing saved
        # ----------------------------------------------------

        return {
            "messages": [
                HumanMessage(
                    content=(
                        "I don't have a favorite "
                        "category or favorite product "
                        "saved for you yet. "
                        "Please tell me what type of "
                        "products you're interested in."
                    )
                )
            ],
            "memory_result":
                None,
        }


    # ========================================================
    # 7. CART FLOW
    # ========================================================

    # --------------------------------------------------------
    # FIRST STEP:
    # User asks to add something to cart.
    #
    # ONLY search_products is available.
    # --------------------------------------------------------

    if (
        is_cart_request(state)
        and isinstance(
            last_message,
            HumanMessage
        )
    ):

        print("=" * 60)
        print(
            "CART REQUEST → SEARCH PRODUCT"
        )
        print("=" * 60)

        active_llm = llm.bind_tools(
            [
                search_products
            ],
            tool_choice=
                "search_products"
        )


    # --------------------------------------------------------
    # SECOND STEP:
    # search_products completed.
    #
    # ONLY add_to_cart is available.
    # --------------------------------------------------------

    elif (
        is_cart_request(state)
        and isinstance(
            last_message,
            ToolMessage
        )
        and last_message.name ==
            "search_products"
    ):

        print("=" * 60)
        print(
            "PRODUCT SEARCH COMPLETE → "
            "ADD TO CART"
        )
        print("=" * 60)

        active_llm = llm.bind_tools(
            [
                add_to_cart
            ],
            tool_choice=
                "add_to_cart"
        )


    # --------------------------------------------------------
    # THIRD STEP:
    # add_to_cart completed.
    #
    # IMPORTANT:
    # NO TOOLS HERE.
    #
    # This prevents:
    #
    # add_to_cart
    #      ↓
    # search_products
    #      ↓
    # add_to_cart
    #      ↓
    # LOOP
    # --------------------------------------------------------

    elif (
        isinstance(
            last_message,
            ToolMessage
        )
        and last_message.name ==
            "add_to_cart"
    ):

        print("=" * 60)
        print(
            "ADD TO CART COMPLETED"
        )
        print(
            "STOPPING TOOL LOOP"
        )
        print("=" * 60)

        active_llm = llm


    # --------------------------------------------------------
    # KNOWLEDGE SEARCH COMPLETED
    #
    # Do not give the LLM tools again.
    # Use the knowledge result as the final source.
    # --------------------------------------------------------

    elif (
        isinstance(
            last_message,
            ToolMessage
        )
        and last_message.name ==
            "search_knowledge"
    ):

        print("=" * 60)
        print("KNOWLEDGE SEARCH COMPLETED")
        print("STOPPING TOOL LOOP")
        print("=" * 60)

        active_llm = llm


    # --------------------------------------------------------
    # RECOMMENDATION COMPLETED
    #
    # Do not give the LLM tools again.
    # --------------------------------------------------------

    elif (
        isinstance(
            last_message,
            ToolMessage
        )
        and last_message.name ==
            "recommend_products"
    ):

        print("=" * 60)
        print(
            "RECOMMENDATION COMPLETED"
        )
        print(
            "STOPPING TOOL LOOP"
        )
        print("=" * 60)

        active_llm = llm


    # --------------------------------------------------------
    # NORMAL SHOPPING FLOW
    # --------------------------------------------------------

    else:

        active_llm = llm_with_tools


    # ========================================================
    # 8. CALL LLM
    # ========================================================

    print("=" * 80)
    print(
        "CALLING LLM"
    )
    print("=" * 80)

    try:

        response = active_llm.invoke(
            state["messages"]
        )

    except Exception as exc:

        print(
            f"LLM invocation failed: {exc}"
        )

        # ====================================================
        # SEARCH FALLBACK
        # ====================================================

        if (
            isinstance(
                last_message,
                ToolMessage
            )
            and last_message.name ==
                "search_products"
        ):

            try:

                tool_payload = json.loads(
                    last_message.content
                )

                if tool_payload:

                    first = tool_payload[0]

                    summary = (
                        f"I found "
                        f"{first['name']} "
                        f"for "
                        f"{first['price']} "
                        f"(brand: "
                        f"{first['brand']}, "
                        f"stock: "
                        f"{'available' if first.get('stock') else 'out of stock'})."
                    )

                    return {
                        "messages": [
                            HumanMessage(
                                content=
                                    summary
                            )
                        ],
                        "memory_result":
                            None,
                    }

            except Exception as fallback_error:

                print(
                    "Fallback parsing failed:",
                    fallback_error
                )


        # ====================================================
        # CART FAILURE FALLBACK
        # ====================================================

        if (
            isinstance(
                last_message,
                ToolMessage
            )
            and last_message.name ==
                "add_to_cart"
        ):

            return {
                "messages": [
                    HumanMessage(
                        content=(
                            "Sorry, I couldn't add "
                            "the product to your cart."
                        )
                    )
                ],
                "memory_result":
                    None,
            }


        # ====================================================
        # GENERAL FALLBACK
        # ====================================================

        return {
            "messages": [
                HumanMessage(
                    content=
                        _direct_search_fallback(
                            last_message.content
                        )
                )
            ],
            "memory_result":
                None,
        }


    # ========================================================
    # 9. DEBUG
    # ========================================================

    print("=" * 50)
    print(
        "LLM RESPONSE"
    )
    print(response)
    print("=" * 50)

    print(
        "Tool Calls:",
        getattr(
            response,
            "tool_calls",
            []
        )
    )


    # ========================================================
    # 10. RETURN
    # ========================================================

    return {
        "messages": [
            response
        ],
        "memory_result":
            None,
    }