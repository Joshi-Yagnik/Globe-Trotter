"""Community posts API router."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import Optional

from database import get_db
from models.community_post import CommunityPost
from schemas.community_post import CommunityPostCreate, CommunityPostResponse
from services.auth import get_current_user, get_optional_user

router = APIRouter(prefix="/api/community", tags=["Community"])


@router.get("", response_model=list[CommunityPostResponse])
async def list_posts(
    search: Optional[str] = Query(None),
    sort_by: str = Query("recent"),
    limit: int = Query(20, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Get community posts."""
    query = select(CommunityPost)

    if search:
        query = query.where(
            or_(
                CommunityPost.title.ilike(f"%{search}%"),
                CommunityPost.content.ilike(f"%{search}%"),
                CommunityPost.tags.ilike(f"%{search}%"),
            )
        )

    if sort_by == "popular":
        query = query.order_by(CommunityPost.likes.desc())
    else:
        query = query.order_by(CommunityPost.created_at.desc())

    query = query.limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=CommunityPostResponse, status_code=201)
async def create_post(
    post_data: CommunityPostCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Create a community post."""
    post = CommunityPost(
        user_id=user["sub"],
        author_name=user.get("name", "Anonymous Traveler"),
        title=post_data.title,
        content=post_data.content,
        destination=post_data.destination,
        tags=post_data.tags,
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post
