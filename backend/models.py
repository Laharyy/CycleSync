from database import get_connection


def get_cycle_setup(user_id):

    connection = get_connection()

    row = connection.execute(
        """
        SELECT *
        FROM cycle_setup
        WHERE user_id = ?
        LIMIT 1
        """,
        (user_id,),
    ).fetchone()

    connection.close()

    return row


def save_cycle_setup(
    user_id,
    last_period_date,
    cycle_length,
):

    connection = get_connection()

    existing = connection.execute(
        """
        SELECT id
        FROM cycle_setup
        WHERE user_id = ?
        LIMIT 1
        """,
        (user_id,),
    ).fetchone()


    if existing:

        connection.execute(
            """
            UPDATE cycle_setup

            SET
                last_period_date = ?,
                cycle_length = ?

            WHERE id = ?
            """,
            (
                last_period_date,
                cycle_length,
                existing["id"],
            ),
        )

    else:

        connection.execute(
            """
            INSERT INTO cycle_setup (
                user_id,
                last_period_date,
                cycle_length
            )

            VALUES (?, ?, ?)
            """,
            (
                user_id,
                last_period_date,
                cycle_length,
            ),
        )


    connection.commit()
    connection.close()