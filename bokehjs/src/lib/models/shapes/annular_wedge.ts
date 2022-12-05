import {Path, PathView} from "./path"
import {Coordinate} from "../coordinates/coordinate"
import {AngleUnits, Direction} from "core/enums"
import {resolve_angle} from "core/util/math"
import * as p from "core/properties"
import {SXY} from "./common"

export class AnnularWedgeView extends PathView {
  override model: AnnularWedge
  override visuals: AnnularWedge.Visuals

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

  get inner_radius(): number {
    return this.model.inner_radius
  }

  get outer_radius(): number {
    return this.model.outer_radius
  }

  get center(): SXY {
    return {sx: 0, sy: 0}
  }

  paint(): void {
    const {ctx} = this.layer
    const {sx, sy} = this.center
    const {inner_radius, outer_radius} = this
    const {start_angle, end_angle, anticlock} = this
    const angle = end_angle - start_angle

    ctx.translate(sx, sy)
    ctx.rotate(start_angle)

    ctx.beginPath()
    ctx.moveTo(outer_radius, 0)
    ctx.arc(0, 0, outer_radius, 0, angle, anticlock)
    ctx.rotate(angle)
    ctx.lineTo(inner_radius, 0)
    ctx.arc(0, 0, inner_radius, 0, -angle, !anticlock)
    ctx.closePath()

    ctx.rotate(-angle - start_angle)
    ctx.translate(-sx, -sy)

    this.visuals.line.apply(ctx)
  }
}

export namespace AnnularWedge {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Path.Props & {
    center: p.Property<Coordinate>
    inner_radius: p.Property<number>
    outer_radius: p.Property<number>
    start_angle: p.Property<number>
    end_angle: p.Property<number>
    angle_units: p.Property<AngleUnits>
    direction: p.Property<Direction>
  }

  export type Visuals = Path.Visuals
}

export interface AnnularWedge extends AnnularWedge.Attrs {}

export class AnnularWedge extends Path {
  override properties: AnnularWedge.Props
  override __view_type__: AnnularWedgeView

  constructor(attrs?: Partial<AnnularWedge.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = AnnularWedgeView

    this.define<AnnularWedge.Props>(({Ref, NonNegative, Number, Angle}) => ({
      center: [ Ref(Coordinate) ],
      inner_radius: [ NonNegative(Number) ],
      outer_radius: [ NonNegative(Number) ],
      start_angle: [ Angle ],
      end_angle: [ Angle ],
      angle_units: [ AngleUnits, "rad" ],
      direction: [ Direction, "anticlock" ],
    }))
  }
}
