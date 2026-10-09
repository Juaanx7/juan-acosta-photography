// Estos tamaños acompañan el contenedor de 90% / 2200px y sus límites internos.
const series = (desktop, tablet = "calc(100vw - 48px)", mobile = "calc(100vw - 44px)") =>
  `(max-width: 580px) ${mobile}, (max-width: 900px) ${tablet}, ${desktop}`;

export const seriesPhotoSizes = {
  wide: series("min(90vw, 2200px)"),
  horizontal: series("calc((min(90vw, 2200px) - 28px) / 2)", "calc((100vw - 76px) / 2)"),
  medium: series("min(76.5vw, 1760px)", "calc((100vw - 48px) * .85)"),
  sanMarcosPortrait: series("calc((min(67.5vw, 1320px) - 48px) / 2)", "calc(((100vw - 48px) * .75 - 48px) / 2)", "280px"),
  achalaPortrait: series("calc((min(67.5vw, 1280px) - 44px) / 2)", "calc(((100vw - 48px) * .75 - 44px) / 2)", "280px"),
  returning: series("min(440px, calc((min(76.5vw, 1280px) - 78px) * .44445))", "calc(((100vw - 48px) * .85 - 78px) * .44445)", "280px"),
  exhibition: series("calc((min(90vw, 960px) - 40px) / 3)", "calc((min(100vw - 48px, 960px) - 40px) / 3)", "230px"),
};

export const collectionPhotoSizes = "(max-width: 580px) calc(100vw - 40px), (max-width: 900px) calc((100vw - 88px) / 3), calc((min(90vw, 2200px) - 40px) / 3)";
