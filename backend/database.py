import sqlite3


DATABASE_NAME = "cyclesync.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_NAME)

    connection.row_factory = sqlite3.Row

    # Enforce foreign-key relationships in SQLite
    connection.execute("PRAGMA foreign_keys = ON")

    return connection


def init_db():
    connection = get_connection()

    # =====================================================
    # USERS TABLE
    # =====================================================

    connection.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    # =====================================================
    # CYCLE SETUP TABLE
    # =====================================================

    connection.execute("""
        CREATE TABLE IF NOT EXISTS cycle_setup (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            last_period_date TEXT NOT NULL,
            cycle_length INTEGER NOT NULL DEFAULT 28,
            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE
        )
    """)

    # =====================================================
    # DAILY CHECK-INS TABLE
    # =====================================================

    connection.execute("""
        CREATE TABLE IF NOT EXISTS checkins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            check_in_date TEXT NOT NULL,
            cycle_day INTEGER NOT NULL,
            phase TEXT NOT NULL,
            energy INTEGER NOT NULL,
            mood INTEGER NOT NULL,
            pain INTEGER NOT NULL,
            sleep INTEGER NOT NULL,
            symptoms TEXT DEFAULT '',
            notes TEXT DEFAULT '',
            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE,

            UNIQUE (user_id, check_in_date)
        )
    """)

    connection.commit()
    connection.close()