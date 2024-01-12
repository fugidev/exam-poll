{ config, lib, pkgs, ... }:
let
  cfg = config.services.exam-poll;

  mkService = service: lib.mkMerge [
    {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];
      serviceConfig = {
        Type = "exec";
        Restart = "on-failure";
        DynamicUser = true;
        UMask = "0077";
        WorkingDirectory = /tmp;
        # Hardening
        CapabilityBoundingSet = [ "" ];
        DeviceAllow = [ "" ];
        LockPersonality = true;
        NoNewPrivileges = true;
        PrivateDevices = true;
        PrivateMounts = true;
        PrivateTmp = true;
        ProtectClock = true;
        ProtectControlGroups = true;
        ProtectHome = true;
        ProtectHostname = true;
        ProtectKernelLogs = true;
        ProtectKernelModules = true;
        ProtectKernelTunables = true;
        ProtectSystem = "strict";
        RemoveIPC = true;
        RestrictAddressFamilies = [ "AF_INET" "AF_INET6" ];
        RestrictNamespaces = true;
        RestrictRealtime = true;
        RestrictSUIDSGID = true;
        SystemCallArchitectures = "native";
      };
    }
    service
  ];
in
{
  options.services.exam-poll = with lib; {
    enable = mkEnableOption "Exam Poll";

    configureNginx = mkOption {
      type = types.bool;
      default = true;
      description = "Whether to configure nginx as reverse proxy.";
    };

    frontend = {
      package = mkOption {
        type = types.package;
        default = pkgs.exam-poll-frontend;
        description = "The package to use.";
      };

      port = mkOption {
        type = types.port;
        default = 3000;
        description = "The port to listen on.";
      };

      hostName = mkOption {
        type = types.str;
        example = "exam-poll.example.com";
        description = "The hostname the application will be served on.";
      };
    };

    backend = {
      package = mkOption {
        type = types.package;
        default = pkgs.exam-poll-backend;
        description = "The package to use.";
      };

      port = mkOption {
        type = types.port;
        default = 8000;
        description = "The port to listen on.";
      };

      hostName = mkOption {
        type = types.str;
        example = "exam-poll-api.example.com";
        description = "The hostname the api will be served on.";
      };
    };

    mongodb = {
      uri = mkOption {
        type = types.str;
        example = "mongodb://localhost:27017";
        description = "MongoDB connection string.";
      };

      database = mkOption {
        type = types.str;
        description = "The database name.";
      };

      collection = mkOption {
        type = types.str;
        description = "The collection name.";
      };
    };
  };

  config = lib.mkIf cfg.enable {
    systemd.services = {
      exam-poll-frontend = mkService {
        description = "Exam Poll frontend";
        environment = {
          PORT = toString cfg.frontend.port;
        };
        serviceConfig = {
          ExecStart = lib.getExe (cfg.frontend.package.override {
            localApiBaseUrl = "http://localhost:${toString cfg.backend.port}";
            publicApiBaseUrl = "https://${cfg.backend.hostName}";
          });
        };
      };

      exam-poll-backend = mkService {
        description = "Exam Poll backend";
        environment = {
          EXAM_POLL_HTTP_LISTEN = "localhost:${toString cfg.backend.port}";
          EXAM_POLL_CORS_LIST = "https://${cfg.frontend.hostName},localhost";
          EXAM_POLL_MONGODB = cfg.mongodb.uri;
          EXAM_POLL_DATABASE = cfg.mongodb.database;
          EXAM_POLL_COLLECTION = cfg.mongodb.collection;
        };
        serviceConfig = {
          ExecStart = lib.getExe pkgs.exam-poll-backend;
        };
      };
    };

    services.nginx = lib.mkIf cfg.configureNginx {
      enable = true;
      recommendedProxySettings = true;
      virtualHosts = {
        ${cfg.frontend.hostName} = {
          forceSSL = lib.mkDefault true;
          enableACME = lib.mkDefault true;
          locations."/".proxyPass = "http://localhost:${toString cfg.frontend.port}";
        };
        ${cfg.backend.hostName} = {
          forceSSL = lib.mkDefault true;
          enableACME = lib.mkDefault true;
          locations."/".proxyPass = "http://localhost:${toString cfg.backend.port}";
        };
      };
    };
  };
}
