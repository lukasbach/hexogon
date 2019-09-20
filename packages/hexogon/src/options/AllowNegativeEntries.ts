/**
 * This option is only used if a dense grid storage is used to store the hexogons (which is the case
 * by default). The dense storage container works more efficiently if it knows wether hexagons with
 * negative coordinates are going to be used.
 */
export enum AllowNegativeEntries {
  Allow,
  Disallow
}