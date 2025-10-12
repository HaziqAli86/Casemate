# backend/routers/chat.py
from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List
# --- MODIFICATIONS START HERE ---
import uuid
from datetime import datetime
# --- MODIFICATIONS END HERE ---


# Import our security dependency, models, and database collection
from core.security import get_current_user
from models.chat import ChatConversation, ChatMessage
from core.database import conversation_collection
# We also need the Ollama integration for the messages endpoint
from core.llm import get_ollama_response


router = APIRouter(
    prefix="/api/v1",
    tags=["Chat"]
)

@router.get("/users/me")
def read_current_user(user: dict = Depends(get_current_user)):
    """ A protected endpoint to get the current user's details. """
    return {"uid": user.get("uid"), "email": user.get("email")}


# --- New Chat Endpoints ---

@router.get("/chats", response_model=List[ChatConversation])
async def get_user_conversations(user: dict = Depends(get_current_user)):
    """
    Retrieve all conversations for the currently authenticated user.
    """
    user_id = user["uid"]
    # Find all documents in the collection where 'user_id' matches
    conversations_cursor = conversation_collection.find({"user_id": user_id})
    conversations = await conversations_cursor.to_list(length=100)
    return conversations

# --- MODIFICATIONS START HERE ---
# This function has been replaced with a more robust implementation.

@router.post("/chats", response_model=ChatConversation, status_code=status.HTTP_201_CREATED)
async def create_new_conversation(user: dict = Depends(get_current_user)):
    """
    Create a new, empty chat conversation for the user.
    """
    user_id = user["uid"]

    # Create the dictionary to be inserted into MongoDB
    new_conversation_data = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "messages": [],
        "created_at": datetime.utcnow()
    }

    # Insert the new data into the database
    await conversation_collection.insert_one(new_conversation_data)

    # --- THE FIX ---
    # Create a ChatConversation instance from our dictionary.
    # Pydantic will correctly handle the aliasing (reading "_id" into the "id" field).
    # This is the valid object that FastAPI expects.
    return ChatConversation(**new_conversation_data)
# --- MODIFICATIONS END HERE ---


@router.post("/chats/{conversation_id}/messages")
async def add_message_to_conversation(
    conversation_id: str,
    message_content: str = Body(..., embed=True), # Expects JSON: {"message_content": "..."}
    user: dict = Depends(get_current_user)
):
    """
    Add a new user message to a specific conversation and get a bot response.
    """
    user_id = user["uid"]

    # 1. Create the user's message object
    user_message = ChatMessage(role="user", content=message_content)

    # 2. Get a real response from the Ollama Llama 3 model
    #    (This replaces the old placeholder)
    bot_response_content = await get_ollama_response(message_content)
    bot_message = ChatMessage(role="assistant", content=bot_response_content)

    # 3. Add both messages to the conversation in the database
    update_result = await conversation_collection.update_one(
        {"_id": conversation_id, "user_id": user_id}, # Security: ensure the user owns this chat
        {"$push": {"messages": {"$each": [user_message.model_dump(), bot_message.model_dump()]}}}
    )

    # 4. Check if the conversation was found and updated
    if update_result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or you do not have permission to access it."
        )

    return bot_message # Return the bot's message to the user