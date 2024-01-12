{ lib
, buildGoModule
}:

buildGoModule rec {
  pname = "exam-poll-backend";
  version = "0.0.0";

  src = ./.;

  vendorHash = "sha256-1QmLYg+1GQwqexz1eFzsWt+H9t1CCN7fMialc07UWrg=";

  postInstall = ''
    mv $out/bin/exam-poll{,-backend}
  '';

  meta = {
    license = lib.licenses.gpl3Plus;
    maintainers = with lib.maintainers; [ fugi ];
    mainProgram = pname;
  };
}
