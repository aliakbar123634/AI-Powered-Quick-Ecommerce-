# # from fastapi import FastAPI
# # from pydantic import BaseModel
# # from app.core.config import settings
# # from app.core.llm import llm
# # from app.api.chat import router as chat_router


# # app=FastAPI(
# #     title=settings.MODEL_NAME,
# #     description="QuicKAI API Service",
# # )

# # app.include_router(chat_router)



# # @app.get("/")
# # def home():
# #     return {
# #         "message": "QuickAI AI Service Running"
# #     }




# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from app.core.config import settings
# from app.core.llm import llm
# from app.api.chat import router as chat_router


# app = FastAPI(
#     title=settings.MODEL_NAME,
#     description="QuicKAI API Service",
# )


# # =========================
# # CORS CONFIGURATION
# # =========================

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # =========================
# # ROUTES
# # =========================

# app.include_router(chat_router)


# @app.get("/")
# def home():
#     return {
#         "message": "QuickAI AI Service Running"
#     }













from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.llm import llm
from app.api.chat import router as chat_router


app = FastAPI(
    title=settings.MODEL_NAME,
    description="QuicKAI API Service",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(chat_router)


@app.get("/")
def home():
    return {
        "message": "QuickAI AI Service Running"
    }