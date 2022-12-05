import {Path, PathView} from "./path"
import {Coordinate} from "../coordinates/coordinate"
import {AngleUnits, Direction} from "core/enums"
import {resolve_angle} from "core/util/math"
import * as p from "core/properties"
import {SXY} from "./common"

export class ArcView extends PathView {
  override model: Arc
  override visuals: Arc.Visuals

  get anticlock(): boolean {
    return this.model.direction == "anticlock"
  }

  get start_angle(): number {
    const {start_angle, angle_units} = this.model
    return resolve_angle(start_angle, angle_units)
  }

  get end_angle(): number {
    const {start_angle, angle_units} = this.model
    return resolve_angle(start_angle, angle_units)
  }

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
    ctx.arc(sx, sy, this.radius, this.start_angle, this.end_angle, this.anticlock)
    this.visuals.line.apply(ctx)
  }
}

export namespace Arc {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Path.Props & {
    center: p.Property<Coordinate>
    radius: p.Property<number>
    //radius_dimension: p.Property<RadiusDimension>
    start_angle: p.Property<number>
    end_angle: p.Property<number>
    angle_units: p.Property<AngleUnits>
    direction: p.Property<Direction>
  }

  export type Visuals = Path.Visuals
}

export interface Arc extends Arc.Attrs {}

export class Arc extends Path {
  override properties: Arc.Props
  override __view_type__: ArcView

  constructor(attrs?: Partial<Arc.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = ArcView

    this.define<Arc.Props>(({Ref, NonNegative, Number, Angle}) => ({
      center: [ Ref(Coordinate) ],
      radius: [ NonNegative(Number) ],
      //radius_dimension: [ RadiusDimension, "x" ],
      start_angle: [ Angle ],
      end_angle: [ Angle ],
      angle_units: [ AngleUnits, "rad" ],
      direction: [ Direction, "anticlock" ],
    }))
  }
}
