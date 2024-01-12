{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    (flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in {
        packages = {
          # exam-poll-frontend = pkgs.callPackage ./frontend { };
          exam-poll-backend = pkgs.callPackage ./backend { };
        };

        formatter = pkgs.nixpkgs-fmt;
      })
    ) // {
      overlays.default = (_: prev: {
        inherit (self.packages.${prev.system})
          exam-poll-backend;
      });

      nixosModules.default = {
        # imports = [ ./module.nix ];

        nixpkgs.overlays = [ self.overlays.default ];
      };
    };
}
