{ lib
, fetchYarnDeps
, mkYarnPackage
, nodejs
, makeWrapper
, localApiBaseUrl ? null
, publicApiBaseUrl ? null
}:

mkYarnPackage rec {
  pname = "exam-poll-frontend";
  version = "0.1.0";
  src = ./.;

  yarnLock = ./yarn.lock;
  packageJSON = ./package.json;

  offlineCache = fetchYarnDeps {
    inherit yarnLock;
    hash = "sha256-uq8kRuXbywcGCIMu8Q2QBOb1T0tKNUGDCTkFJOUxGk0=";
  };

  NODE_ENV = "production";
  API_BASEURL = localApiBaseUrl;
  NEXT_PUBLIC_API_BASEURL = publicApiBaseUrl;

  nativeBuildInputs = [ makeWrapper ];

  configurePhase = ''
    runHook preConfigure

    ln -s $node_modules node_modules

    runHook postConfigure
  '';

  buildPhase = ''
    runHook preBuild

    export HOME=$(mktemp -d)
    # pipe to cat to disable fancy progress indicators cluttering the log
    yarn --offline run build | cat

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    export OUT_LIBEXEC="$out/libexec/${pname}"
    mkdir -p $out $OUT_LIBEXEC
    # copy compiled files
    cp -r .next/standalone/. $OUT_LIBEXEC
    # copy static files too
    cp -r .next/static $OUT_LIBEXEC/.next/static
    cp -r public $OUT_LIBEXEC/public
    # server wrapper
    makeWrapper '${nodejs}/bin/node' "$out/bin/${pname}" \
      --add-flags "$OUT_LIBEXEC/server.js"

    runHook postInstall
  '';

  dontFixup = true;
  doDist = false;

  meta = {
    license = lib.licenses.gpl3Plus;
    maintainers = with lib.maintainers; [ fugi ];
    mainProgram = pname;
  };
}
