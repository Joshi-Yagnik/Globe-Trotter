from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from config import get_settings

settings = get_settings()

engine_kwargs = {"echo": False}
if "sqlite" not in settings.DATABASE_URL:
    engine_kwargs.update({
        "pool_size": 5,
        "max_overflow": 10,
    })

engine = create_async_engine(
    settings.DATABASE_URL,
    **engine_kwargs
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


async def get_db():
    """Dependency that provides an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_tables():
    """Create all database tables on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
