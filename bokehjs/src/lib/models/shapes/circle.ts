import {Path, PathView} from "./path"
import {Coordinate} from "../coordinates/coordinate"
import * as p from "core/properties"
import {SXY} from "./common"

export class CircleView extends PathView {
  override model: Circle
  override visuals: Circle.Visuals

  get radius(): number {
    return this.model.radius
  }

  get center(): SXY {
    return {sx: 0, sy: 0}
  }

  paint(): void {
    const {ctx} = this.layer
    ctx.beginPath()
    const {sx, sy} = this.center
    ctx.arc(sx, sy, this.radius, 0, 2*Math.PI, false)
    this.visuals.line.apply(ctx)
  }
}

export namespace Circle {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Path.Props & {
    center: p.Property<Coordinate>
    radius: p.Property<number>
    //radius_dimension: p.Property<RadiusDimension>
  }

  export type Visuals = Path.Visuals
}

export interface Circle extends Circle.Attrs {}

export class Circle extends Path {
  override properties: Circle.Props
  override __view_type__: CircleView

  constructor(attrs?: Partial<Circle.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = CircleView

    this.define<Circle.Props>(({Ref, NonNegative, Number}) => ({
      center: [ Ref(Coordinate) ],
      radius: [ NonNegative(Number) ],
      //radius_dimension: [ RadiusDimension, "x" ],
    }))
  }
}
