import {Shape, ShapeView} from "./shape"
import * as mixins from "core/property_mixins"
import * as visuals from "core/visuals"
import * as p from "core/properties"

export abstract class PathView extends ShapeView {
  override model: Path
}

export namespace Path {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Shape.Props & Mixins

  export type Mixins = mixins.Line

  export type Visuals = Shape.Visuals & {
    line: visuals.Line
  }
}

export interface Path extends Path.Attrs {}

export abstract class Path extends Shape {
  override properties: Path.Props
  override __view_type__: PathView

  constructor(attrs?: Partial<Path.Attrs>) {
    super(attrs)
  }

  static {
    this.mixins<Path.Mixins>(mixins.Line)
  }
}
