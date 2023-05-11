import argparse
import string
import random

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


def main(
    count: int,
    length: int = 10,
    service_account_path: str = None,
    role: str = "participant",
):
    """Generate a set of random alphanumeric CIDs of length `length` and save
    it to Cloud Firestore User Collection.

    Args:
        count (int): Numbers of CIDs to generate.
        length (int, optional): Length of each CID. Defaults to 10.
    """
    cred = credentials.Certificate(service_account_path)
    firebase_admin.initialize_app(credential=cred)
    db = firestore.client()

    for _ in range(count):
        cid = "".join(
            random.choices(string.ascii_uppercase + string.digits, k=length)
        )

        user_ref = db.collection("Users_new").document(cid)
        user_ref.set({"name": None, "type": role, "stampCount": 0})

    print(
        "Generated {} CIDs of role {} and saved to firestore".format(
            role, count
        )
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate CIDs")
    parser.add_argument(
        "-c", "--count", type=int, help="Number of CIDs to generate"
    )
    parser.add_argument(
        "-l", "--length", type=int, default=10, help="Length of each CID"
    )
    parser.add_argument(
        "-s",
        "--service-account-path",
        type=str,
        default="../aisdc-2023-firebase.json",
        help="Path to service account json file",
    )
    parser.add_argument(
        "-r",
        "--role",
        choices=["participant", "admin", "partner"],
        default="participant",
        help="Role of the user",
    )

    args = parser.parse_args()
    main(args.count, args.length, args.service_account_path, args.role)
