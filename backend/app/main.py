from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import router as api_v1_router

app = FastAPI(
    title="ScamShield India — AI-Powered Scam Detection API",
    description="Multi-Signal Weighted Evidence Fusion & SEBI Verification Engine",
    version="2.4.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS middleware for React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(api_v1_router)

@app.get("/", include_in_schema=False)
async def root():
    return {
        "message": "ScamShield India Intelligence Engine API is running.",
        "docs": "/docs",
        "health": "/api/v1/health"
    }
