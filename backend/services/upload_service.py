from supabase import create_client
import os

url = os.getenv(
    "SUPABASE_URL"
)

key = os.getenv(
    "SUPABASE_KEY"
)

supabase = create_client(
    url,
    key
)

def upload_file(
    filepath,
    filename
):

    with open(
        filepath,
        "rb"
    ) as f:

        supabase.storage\
        .from_("ecg-files")\
        .upload(
            filename,
            f
        )