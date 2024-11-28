/** Identificador de un Sistema de Referencia de Coordenadas. */
export enum CRS {
  EPSG_4326 = "EPSG:4326",
  EPSG_22175 = "EPSG:22175",
}

/** Tipos de operaciones posibles de realizar sobre el mapa en esta app. */
export type OperationType =
  | "navigate"
  | "measure-line"
  | "measure-area"
  | "query";
