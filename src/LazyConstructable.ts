export interface LazyConstructable<Constructable, PossibleParameters> {
  lazyConstruct(parameter: PossibleParameters): Constructable;
}