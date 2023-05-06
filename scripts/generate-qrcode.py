import argparse
from pathlib import Path

import tqdm
import firebase_admin
import qrcode
from firebase_admin import credentials
from firebase_admin import firestore

BOOTHS_INFO = {
    "1TcFJnMPdOAcYyAgLvb8": "AI Singapore",
    "FGiA6h2tDAuwWOJqSfHB": "SAP AI Lab",
    "Kd4vDZaMYpLphHg4FkLr": "Government Technology Agency",
    "RJm7WuVDeynWLjQoAJjf": (
        "SpeakEase National AI Student Challenge, Category B Winner"
    ),
    "RSZGHOFWAr0mKkkEigc9": "GINA.sg",
    "UaoJb01IhPqS6jjsdlzf": "Amazon Web Services",
    "cmfKFXEY5wUlnLWqITwO": "NVIDIA & Edom Technology Co.,Ltd",
    "d5t5F65WxjqRg3RCcfHk": "The Digital and Intelligence Service",
    "d8c7NYPvOgdhiIEr2tq9": "Auxilium Mechanica Pentahack Second Prize Winner",
    "tRH2khWbIQWLVaO4AhCl": "SpeechCoach Pentahack First Prize Winner",
    "wr0LJ52gTUy4psNaV1E3": "Grab",
    "TwXoXO18z2SrMc4oyc2T": "BBSC Team",
    "asHDVrvPDJ2dRT3VIyoG": "Singapore Computer Society",
}


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
    booth_path = Path(qr_save_dir) / "booth"

    if not admin_path.exists():
        admin_path.mkdir(parents=True)
    if not participant_path.exists():
        participant_path.mkdir(parents=True)
    if not booth_path.exists():
        booth_path.mkdir(parents=True)
    path_dict = {"admin": admin_path, "participant": participant_path}

    # Generate QR codes for every user
    docs = db.collection("Users").stream()
    for doc in tqdm.tqdm(docs):
        doc_dict = doc.to_dict()
        role = doc_dict["type"]
        cid = doc.id
        data = qr_prefix + cid

        img = qrcode.make(data)
        img.save(str(path_dict[role] / f"{cid}.png"))

    for booth_id, booth_name in BOOTHS_INFO.items():
        data = booth_id
        img = qrcode.make(data)
        img.save(str(booth_path / f"{booth_name}.png"))

    print("Generated QR codes for all users and booths")


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
