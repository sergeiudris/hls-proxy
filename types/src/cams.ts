
export namespace Cams {

    export interface DatasetInfo {
      title: string
      fileName: string,
      type: CamType
    }

    export interface Dataset {
      type: CamType
      items: CameraInfo[]
    }

    export enum CamType {
      httpcameras = 3,
      INTELELCT = 2
    }

    export interface CameraInfo {
      "id": number;
      "title": string;
      "fullTitle": string;
      "version": {
        "id": number;
        "dateStart": string;
        "object": {
          "type": CamType;
          "title": string;
          "address": string;
          "cam_url": string;
          "control_url": string;
          "geocoordinates": {
            "type": string;
            "features": {
              "type": string;
              "geometry": {
                "type": string;
                "coordinates": string[];
              };
              "properties": {};
            }[];
          };
          "_type": {
            "id": number;
            "versionId": number;
            "title": string;
            "absolutPath": string;
            "available": boolean;
            "reason": string;
            "rfc": boolean;
            "version": {
              "icon": {
                "mime": string;
                "name": string;
                "size": number;
                "uuid": string;
              };
              "proto": string;
              "title": string;
              "visibility_radius": number;
            };
          };
        };
      };
      "isAvailable": boolean;
      "versionId": number;
      "absolutPath": string;
      "lastChange": string;
    }
  }
