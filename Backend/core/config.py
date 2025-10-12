# backend/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # These variables will be loaded from the .env file
    MONGO_URI: str
    FIREBASE_CREDENTIALS_PATH: str

    # Pydantic v2 configuration to specify the .env file
    model_config = SettingsConfigDict(env_file=".env")


# Create a single instance of the Settings class
# We will import this 'settings' object into other files
settings = Settings()