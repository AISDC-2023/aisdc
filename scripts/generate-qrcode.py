import argparse
from pathlib import Path

import tqdm
import firebase_admin
import qrcode
from firebase_admin import credentials
from firebase_admin import firestore


def main(
    qr_prefix: str = "",
    qr_save_dir: str = "",
    service_account_path: str = None,
):
    """Fetch all CIDs from Cloud Firestore User Collection and generate QR
    codes and save it to different sub-directory based on the role of the user.
    """
    # Initialize Firebase
    cred = credentials.Certificate(service_account_path)
    firebase_admin.initialize_app(credential=cred)
    db = firestore.client()

    # Ensure that the save directory exists
    admin_path = Path(qr_save_dir) / "admin"
    participant_path = Path(qr_save_dir) / "participant"

    if not admin_path.exists():
        admin_path.mkdir(parents=True)
    if not participant_path.exists():
        participant_path.mkdir(parents=True)
    path_dict = {"admin": admin_path, "participant": participant_path}

    # Generate QR codes for every user
    docs = db.collection("Users").stream()
    for doc in tqdm.tqdm(docs):
        doc_dict = doc.to_dict()
        role = doc_dict["type"]
        cid = doc.id
        data = qr_prefix + cid

        img = qrcode.make(data)
        img.save(str(path_dict[role]/f"{cid}.png"))

    print("Generated QR codes for all users")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate QR codes")
    parser.add_argument(
        "-p",
        "--qr-prefix",
        type=str,
        default="https://aisdc-2023.web.app/login?cid=",
        help="Prefix to be added to the CID",
    )
    parser.add_argument(
        "-s",
        "--qr-save-dir",
        type=str,
        default="../qr-codes",
        help="Directory to save the QR codes",
    )
    parser.add_argument(
        "-a",
        "--service-account-path",
        type=str,
        default="../aisdc-2023-firebase.json",
        help="Path to service account json file",
    )
    args = parser.parse_args()
    main(
        qr_prefix=args.qr_prefix,
        qr_save_dir=args.qr_save_dir,
        service_account_path=args.service_account_path,
    )
