import {Path, PathView} from "./path"
import {Coordinate} from "../coordinates/coordinate"
import * as p from "core/properties"
import {SXY} from "./common"

export class AnnulusView extends PathView {
  override model: Annulus
  override visuals: Annulus.Visuals

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
    ctx.beginPath()
    ctx.arc(sx, sy, inner_radius, 0, 2*Math.PI, true)
    ctx.moveTo(sx + outer_radius, sy)
    ctx.arc(sx, sy, outer_radius, 2*Math.PI, 0, false)
    this.visuals.line.apply(ctx)
  }
}

export namespace Annulus {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Path.Props & {
    center: p.Property<Coordinate>
    inner_radius: p.Property<number>
    outer_radius: p.Property<number>
  }

  export type Visuals = Path.Visuals
}

export interface Annulus extends Annulus.Attrs {}

export class Annulus extends Path {
  override properties: Annulus.Props
  override __view_type__: AnnulusView

  constructor(attrs?: Partial<Annulus.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = AnnulusView

    this.define<Annulus.Props>(({Ref, NonNegative, Number}) => ({
      center: [ Ref(Coordinate) ],
      inner_radius: [ NonNegative(Number) ],
      outer_radius: [ NonNegative(Number) ],
    }))
  }
}
