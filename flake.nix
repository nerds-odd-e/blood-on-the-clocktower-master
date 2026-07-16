{
  description = "Blood on the Clocktower — Storyteller Copilot development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          name = "botc-storyteller-copilot";

          buildInputs = with pkgs; [
            nodejs_24
            git
            jq
            nixfmt
          ];

          shellHook = ''
            if [[ "''${PS1:-}" != *"(nix)"* ]]; then
              export PS1="(nix) ''${PS1:-}"
            fi

            export PATH="$PWD/node_modules/.bin:$PATH"
            # Playwright installs its own browsers; avoid host-lib validation noise in Nix.
            export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true

            echo "Blood on the Clocktower — Storyteller Copilot"
            echo "  Node.js: $(node --version)"
            echo "  npm:     $(npm --version)"
            echo ""
            echo "Quick start:"
            echo "  npm install"
            echo "  npm run dev"
            echo "  npm test"
          '';
        };
      }
    );
}
