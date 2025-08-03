import json
from pathlib import Path
import openai
import re

from openai import OpenAI
from tqdm import tqdm

client = OpenAI()

instructions = "\n".join(
    [
        "You are Migri, a virtual assistant embedded inside the app 'iMigration'.",
        "Your purpose is to help spanish-speaking users complete a simple in-app form whose information is used to pre-fill a government form.",
        "You will be provided with a 'form path' from the app, which will look like this:",
        "'services.i589.info.personal-information.basic-demographics'",
        "This path indicates the service (i589 application for asylum), the step (info), the screen",
        "(personal-information), and the specific page (basic-demographics) within that screen.",
        "You will also be given a JSON object containing field and page titles, labels, and other user-facing text.",
        "Your task is to help the user fill out the form on this screen. You will not be able to ask the user questions",
        " or interact with them directly. Instead, you will provide a message to display to them, as Migri, to guide them in filling out the form.",
        "Your message should be clear, concise, and friendly. It should explain what information is needed on this screen and why it is important.",
        "Make sure to use simple language that is easy to understand. Each line of your message should be kept concise, ideally under 100 characters.",
        "Here is an example of a good message:",
        "Aquí simplemente indica tu sexo de nacimiento, tal y como aparecen en tu certificado de nacimiento.",
        "Puedes hacer para arriba y abajo en el calendario para cambiar de mes, dia y año. Haz click en Confirmar cuando estes listo.",
        "Please provide a similar message, in spanish, for the following form path and JSON object:",
    ]
)


steps = ["info", "eligibility"]
SERVICE = "i589"

PROJECT_DIR = Path(__file__).parent.parent.parent
SERVICE_DIR = PROJECT_DIR / "src/app/(drawer)/services/i589"
SPANISH_TRANSLATION_FILE = PROJECT_DIR / "src/assets/translations/es.json"
ENGLISH_TRANSLATION_FILE = PROJECT_DIR / "src/assets/translations/en.json"

spanish_translations = json.loads(SPANISH_TRANSLATION_FILE.read_text())
english_translations = json.loads(ENGLISH_TRANSLATION_FILE.read_text())


def resolve(data: dict, path: str):
    parts = path.split(".")
    for part in parts:
        if part in data:
            data = data[part]
        else:
            return None
    return data


def paths():
    for step in steps:
        step_dir = SERVICE_DIR / step
        for file in step_dir.glob("**/*.tsx"):
            screen = ".".join(
                file.relative_to(step_dir).parts[:-1] + (file.stem,)
            )
            file_content = file.read_text()
            for match in re.finditer(r"pageId='(.*)'", file_content):
                page = match.group(1)
                yield f"services.{SERVICE}.{step}.{screen}.{page}"


for path in tqdm(list(paths())):
    form_data = resolve(english_translations, path)
    if not form_data:
        print(f"Warning: No JSON object found for path: {path}")
        continue

    migri_data = spanish_translations["migri"]
    for key in path.split("."):
        if key not in migri_data:
            migri_data[key] = {}
        migri_data = migri_data[key]

    if "talk" in migri_data:
        print(f"Skipping {path}, already has talk node.")
        continue

    message = client.responses.create(
        model="gpt-4o-mini",
        instructions=instructions,
        input=json.dumps({"form_path": path, "json_object": form_data}),
    ).output_text

    lines = [line.strip() for line in message.split("\n") if line.strip()]

    migri_data["talk"] = lines
    SPANISH_TRANSLATION_FILE.write_text(
        json.dumps(spanish_translations, indent=2, ensure_ascii=False)
    )
