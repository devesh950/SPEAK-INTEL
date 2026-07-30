import asyncio
import os
from prisma import Prisma

# Use direct connection URL
direct_url = "postgresql://postgres.rydltswmnlfwouibwwmk:Siddebu%409955@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"

async def main():
    # Set DATABASE_URL in environment for prisma client
    os.environ["DATABASE_URL"] = direct_url
    db = Prisma(datasource={"url": direct_url})
    await db.connect()
    try:
        tables = await db.query_raw("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
        print("Existing tables in public schema:")
        print(tables)
    except Exception as e:
        print("Error listing tables:", e)
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
