"""CLI aislada. Python 3.10+, únicamente biblioteca estándar."""
import argparse
import json
import re
import sys

from data import ROOT, CONDITIONS, inside, read_json, register, validate, write_json
from cloudinary import event_photos, load_catalog, register_cloudinary
from evaluate import evaluate, print_report
from runner import run


def main():
    parser = argparse.ArgumentParser(description="Benchmark local de dorsales; Etapa 3A solo incluye MOCK")
    commands = parser.add_subparsers(dest="command", required=True)
    command = commands.add_parser("register-cloudinary", help="Congela web/high; no crea ground truth")
    command.add_argument("--dataset", type=lambda value: inside(ROOT, value), default=ROOT / "dataset")
    command.add_argument("--event", required=True)
    command.add_argument("--photo", required=True)
    command.add_argument("--split", choices=("tuning", "evaluation"), required=True)
    command.add_argument("--condition", choices=sorted(CONDITIONS), required=True)
    command.add_argument("--sequence", required=True, help="Mismo identificador para fotos de una ráfaga")
    command = commands.add_parser("list-cloudinary", help="Lista IDs/URLs; no clasifica ni descarga")
    command.add_argument("--event", required=True)
    command.add_argument("--category")
    command.add_argument("--limit", type=int, default=20)
    command.add_argument("--offset", type=int, default=0)
    for name in ("validate", "register", "run"):
        command = commands.add_parser(name)
        command.add_argument("--dataset", type=lambda value: inside(ROOT, value), default=ROOT / "dataset")
        if name == "register":
            command.add_argument("--case", required=True)
            command.add_argument("--variant", choices=("web", "high"), required=True)
            command.add_argument("--source", required=True)
        if name == "run":
            command.add_argument("--engine", choices=("mock",), required=True)
            command.add_argument("--variant", choices=("web", "high"), required=True)
            command.add_argument("--split", choices=("tuning", "evaluation"), default="tuning")
            command.add_argument("--config")
            command.add_argument("--run-id")
    command = commands.add_parser("evaluate")
    command.add_argument("--run", required=True)
    command.add_argument("--threshold", type=float)
    args = parser.parse_args()
    try:
        if args.command == "register-cloudinary":
            case = register_cloudinary(args.dataset, args.event, args.photo, args.split, args.condition, args.sequence)
            print(json.dumps(case, ensure_ascii=False, indent=2))
            print(f"Registrado {case['caseId']}. Falta completar ground-truth.json manualmente.")
        elif args.command == "list-cloudinary":
            if args.limit < 1 or args.offset < 0:
                raise ValueError("limit debe ser positivo y offset no negativo")
            photos = event_photos(load_catalog(), args.event)
            if args.category:
                photos = [photo for photo in photos if photo.get("categoryId") == args.category]
            print(json.dumps({"total": len(photos), "photos": photos[args.offset:args.offset + args.limit]}, ensure_ascii=False, indent=2))
        elif args.command == "validate":
            manifest, _, errors = validate(args.dataset)
            if errors:
                print("Dataset inválido:\n- " + "\n- ".join(errors), file=sys.stderr)
                return 1
            print(f"Dataset válido: {len(manifest['cases'])} fotos, ambas variantes verificadas.")
        elif args.command == "register":
            print(json.dumps(register(args.dataset, args.case, args.variant, args.source), indent=2))
        elif args.command == "run":
            print("SIMULACIÓN MOCK: no se ejecuta reconocimiento ni se llama a APIs.")
            config = read_json(args.config) if args.config else {}
            directory = run(args.dataset, args.engine, args.variant, args.split, config, args.run_id)
            print(f"Run guardado: {directory.name}")
        else:
            if not re.fullmatch(r"[A-Za-z0-9_-]+", args.run):
                raise ValueError("runId inválido")
            directory = inside(ROOT, ROOT / "results" / args.run)
            report = evaluate(directory, args.threshold)
            suffix = "all" if args.threshold is None else str(args.threshold)
            path = ROOT / "reports" / f"{args.run}-threshold-{suffix}.json"
            write_json(path, report)
            print_report(report)
            print(f"Reporte JSON: {path}")
        return 0
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    sys.exit(main())
