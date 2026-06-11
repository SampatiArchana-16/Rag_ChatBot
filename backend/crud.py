from database import SessionLocal

from models import (
    User,
    ChatHistory
)

from auth import (
    hash_password,
    verify_password
)


def create_user(
    username,
    password
):

    db = SessionLocal()

    existing_user = (
        db.query(User)
        .filter(
            User.username == username
        )
        .first()
    )

    if existing_user:

        db.close()

        return False

    user = User(
        username=username,
        password=hash_password(
            password
        )
    )

    db.add(user)

    db.commit()

    db.close()

    return True


def authenticate_user(
    username,
    password
):

    db = SessionLocal()

    user = (
        db.query(User)
        .filter(
            User.username == username
        )
        .first()
    )

    db.close()

    if not user:

        return False

    return verify_password(
        password,
        user.password
    )


def save_message(
    username,
    role,
    message
):

    db = SessionLocal()

    chat = ChatHistory(
        username=username,
        role=role,
        message=message
    )

    db.add(chat)

    db.commit()

    db.close()


    
def load_history(
    username
):

    db = SessionLocal()

    history = db.query(
        ChatHistory
    ).filter(
        ChatHistory.username == username
    ).all()

    db.close()

    return history