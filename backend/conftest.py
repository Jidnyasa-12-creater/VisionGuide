"""pytest fixtures for VisionGuide AI backend tests."""
import pytest
import io
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use in-memory SQLite for tests
TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="session")
def test_engine():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    return engine

@pytest.fixture(scope="session")
def test_client(test_engine):
    # Override the database before importing app
    import database
    database.engine = test_engine
    database.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    database.Base.metadata.create_all(bind=test_engine)

    from main import app
    from database import get_db

    def override_get_db():
        db = database.SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)

@pytest.fixture
def dummy_image():
    """Create a minimal valid JPEG-like bytes object."""
    buf = io.BytesIO()
    buf.write(b'\xff\xd8\xff\xe0' + b'\x00' * 100)  # JPEG header + padding
    buf.seek(0)
    return buf.read()

@pytest.fixture
def dummy_image_file(dummy_image):
    return ("test.jpg", io.BytesIO(dummy_image), "image/jpeg")
