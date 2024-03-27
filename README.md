# Exam Poll

Exam Poll is a tool for creating polls about exam results. It aims to be simplistic and accessible. Anyone can create a poll and share a link to it. Polls can be edited by their creator and run for a specified time span.

The current implementation consists of a backend written in Go, which uses MongoDB, and a server-side rendered frontend using NextJS.

Feel free to use the public instance at [poll.fugi.dev](https://poll.fugi.dev).

## Development

See the README file in the frontend and backend directories, respectively.

## Deployment

### Docker Compose

The compose files I use are provided for reference. You can use them with slight adjustments.

Replace the domains for frontend and api in `docker-compose.prod.yml` and hook up your reverse proxy (which can access the containers via the `swag-net` network, in my case).

Then run the following command to deploy everything:

```sh
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### NixOS module

This repository includes a Flake that provides a NixOS module for exam poll. You can use it like this:

```nix
# flake.nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    exam-poll.url = "github:fugidev/exam-poll";
  };

  outputs = { self, nixpkgs, exam-poll }: {
    # change `yourhostname` to your actual hostname
    nixosConfigurations.yourhostname = nixpkgs.lib.nixosSystem {
      # customize to your system
      system = "x86_64-linux";
      modules = [
        exam-poll.nixosModules.default
        ./configuration.nix
      ];
    };
  };
}
```

```nix
# configuration.nix
{
  services.exam-poll = {
    enable = true;
    frontend = {
      # optionally specify the local port
      # port = 3000;
      hostName = "poll.example.com";
    };
    backend = {
      # optionally specify the local port
      # port = 8000;
      hostName = "poll-api.example.com";
    };
    mongodb = {
      # provide your own mongodb instance, this is currently not handled by the module
      uri = "mongodb://localhost:27017";
      database = "exam-poll";
      collection = "polls";
    };
  };
}
```

Nginx will (by default) be automatically configured as reverse proxy with https. This can be disabled by setting `services.exam-poll.configureNginx = false;`.

The creation of a MongoDB instance is currently not handled by the module. Because of MongoDB's non-free license, your options are to use its NixOS module and compile it yourself (requires _a lot_ of resources) or to run it in Docker or Podman.

See [`module.nix`](module.nix) for all available options and their explanations.
