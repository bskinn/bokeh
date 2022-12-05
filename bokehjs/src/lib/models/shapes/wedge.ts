import {Path, PathView} from "./path"
import {Coordinate} from "../coordinates/coordinate"
import {AngleUnits, Direction} from "core/enums"
import {resolve_angle} from "core/util/math"
import * as p from "core/properties"
import {SXY} from "./common"

export class WedgeView extends PathView {
  override model: Wedge
  override visuals: Wedge.Visuals

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
    const {sx, sy} = this.center
    ctx.beginPath()
    ctx.arc(sx, sy, this.radius, this.start_angle, this.end_angle, this.anticlock)
    ctx.lineTo(sx, sy)
    ctx.closePath()
    this.visuals.line.apply(ctx)
  }
}

export namespace Wedge {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Path.Props & {
    center: p.Property<Coordinate>
    radius: p.Property<number>
    start_angle: p.Property<number>
    end_angle: p.Property<number>
    angle_units: p.Property<AngleUnits>
    direction: p.Property<Direction>
  }

  export type Visuals = Path.Visuals
}

export interface Wedge extends Wedge.Attrs {}

export class Wedge extends Path {
  override properties: Wedge.Props
  override __view_type__: WedgeView

  constructor(attrs?: Partial<Wedge.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = WedgeView

    this.define<Wedge.Props>(({Ref, NonNegative, Number, Angle}) => ({
      center: [ Ref(Coordinate) ],
      radius: [ NonNegative(Number) ],
      start_angle: [ Angle ],
      end_angle: [ Angle ],
      angle_units: [ AngleUnits, "rad" ],
      direction: [ Direction, "anticlock" ],
    }))
  }
}
