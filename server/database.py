import sqlite3
import time

class AsyncDatabase:
    def __init__(self, db_path="asyncshield.db"):
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.cursor = self.conn.cursor()
        self._create_tables()

    def _create_tables(self):
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS commits (
                id TEXT PRIMARY KEY,
                client_id TEXT,
                status TEXT,
                reason TEXT,
                version_bump TEXT,
                bounty INTEGER,
                timestamp REAL
            )
        ''')
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS bounties (
                client_id TEXT PRIMARY KEY,
                total_bounty INTEGER
            )
        ''')
        self.conn.commit()

    def add_commit(self, client_id, status, reason, version_bump, bounty):
        commit_id = f"commit-{int(time.time() * 1000)}"
        self.cursor.execute('''
            INSERT INTO commits (id, client_id, status, reason, version_bump, bounty, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (commit_id, client_id, status, reason, version_bump, bounty, time.time()))
        
        # Update Leaderboard if it was a successful merged commit
        if bounty > 0:
            self.cursor.execute('''
                INSERT INTO bounties (client_id, total_bounty)
                VALUES (?, ?)
                ON CONFLICT(client_id) DO UPDATE SET total_bounty = total_bounty + ?
            ''', (client_id, bounty, bounty))
            
        self.conn.commit()

    def get_dashboard_data(self):
        """Fetches data formatted for the Next.js frontend."""
        self.cursor.execute('SELECT client_id, total_bounty FROM bounties ORDER BY total_bounty DESC')
        leaderboard = [{"client": row[0], "bounty": row[1]} for row in self.cursor.fetchall()]

        self.cursor.execute('SELECT client_id, status, reason, version_bump, bounty FROM commits ORDER BY timestamp DESC LIMIT 15')
        commits = [{
            "client": row[0], "status": row[1], "reason": row[2], 
            "version_bump": row[3], "bounty": row[4]
        } for row in self.cursor.fetchall()]

        return {"leaderboard": leaderboard, "commits": commits}