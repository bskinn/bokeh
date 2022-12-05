import {Path, PathView} from "./path"
import {Coordinate} from "../coordinates/coordinate"
import * as p from "core/properties"

export class SplineView extends PathView {
  override model: Spline
  override visuals: Spline.Visuals

  paint(): void {
    const {ctx} = this.layer
    ctx.beginPath()
    this.visuals.line.apply(ctx)
  }
}

export namespace Spline {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Path.Props & {
    points: p.Property<Coordinate[]>
    tension: p.Property<number>
    closed: p.Property<boolean>
  }

  export type Visuals = Path.Visuals
}

export interface Spline extends Spline.Attrs {}

export class Spline extends Path {
  override properties: Spline.Props
  override __view_type__: SplineView

  constructor(attrs?: Partial<Spline.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = SplineView

    this.define<Spline.Props>(({NonNegative, Number, Boolean, Array, Ref}) => ({
      points: [ Array(Ref(Coordinate)) ],
      tension: [ NonNegative(Number), 0.5 ],
      closed: [ Boolean, false ],
    }))
  }
}
