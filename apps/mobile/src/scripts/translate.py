#!/usr/bin/env -S uv --quiet run --script
# /// script
# requires-python = ">=3.13"
# dependencies = [
#   "openai",
#   "typer"
# ]
# ///
import json
import openai
import typer
from openai import OpenAI
from pathlib import Path
from tqdm import tqdm

client = OpenAI()

LANGUAGE_CODES = {
    "en": "English",
    "es": "Spanish",
}

TRANSLATIONS_DIR = Path(__file__, "../../assets/translations").resolve()

EXCLUDED_KEYS = ["language."]


def flatten(data, sep=".", parent=""):
    items = {}
    for child, v in data.items():
        key = f"{parent}{sep}{child}" if parent else child
        if isinstance(v, dict):
            items.update(flatten(v, sep, key))
        else:
            items[key] = v
    return items


def unflatten(data, sep=".", parent=""):
    items = {}
    for key, value in data.items():
        parts = key.split(sep)
        d = items
        for part in parts[:-1]:
            if part not in d:
                d[part] = {}
            d = d[part]
        d[parts[-1]] = value
    return items


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    val = []
    for i in range(0, len(lst), n):
        val.append(lst[i : i + n])
    return val


def main(from_path: Path, to_path: Path):
    with open(from_path, "r") as f:
        from_translations = json.load(f)

    from_language = LANGUAGE_CODES[from_path.stem]
    to_language = LANGUAGE_CODES[to_path.stem]

    if not to_path.exists():
        print(f"Creating translation file: {to_path.name}")
        to_path.write_text("{}")

    with open(to_path, "r") as f:
        to_translations = json.load(f)

    flat_from_translations = flatten(from_translations)
    flat_to_translations = flatten(to_translations)
    missing_translations = {
        key: value
        for key, value in flat_from_translations.items()
        if key not in flat_to_translations
        and not any(key.startswith(prefix) for prefix in EXCLUDED_KEYS)
    }

    print(f"{len(missing_translations)} missing translations found.")

    for chunk in tqdm(
        chunks(list(missing_translations.items()), 8), desc="Translating"
    ):
        translation = client.responses.create(
            model="gpt-4o-mini",
            instructions=f"You are a translation assistant for a self-service immigration app. Translate the following i18n file {from_language} to {to_language}. Keep the translation concise and accurate. Do not output anything except a single valid JSON object. The keys must match the input exactly.",
            input=json.dumps(dict(chunk)),
        ).output_text
        if translation.startswith('```json'):
            translation = '\n'.join(translation.splitlines()[1:-1])
        try:
            translated_items = json.loads(translation)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            print(f"Response was: {translation}")
            continue

        from_keys = set(dict(chunk).keys())
        to_keys = set(translated_items.keys())
        if not from_keys == to_keys:
            raise ValueError(
                f"Translation keys do not match between source and target: {from_keys.symmetric_difference(to_keys)}"
            )

        for key, value in translated_items.items():
            flat_to_translations[key] = value

        with open(to_path, "w") as f:
            json.dump(
                unflatten(flat_to_translations), f, indent=2, ensure_ascii=False
            )

    print(f"Writing translations to {to_path.name}")


if __name__ == "__main__":
    typer.run(main)
